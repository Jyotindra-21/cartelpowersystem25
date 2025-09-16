import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/testimonialModel";
import { TestimonialCreateSchema } from "@/schemas/testimonialSchema";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = TestimonialCreateSchema.parse(body);

    // Create the testimonial
    const testimonial = await Testimonial.create(validatedData);

    // Return the created testimonial without unnecessary fields
    const { __v, ...testimonialData } = testimonial.toObject();

    return NextResponse.json(
      {
        success: true,
        data: testimonialData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating testimonial:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (if you have unique constraints)
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Testimonial with similar data already exists",
        },
        { status: 409 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create testimonial",
      },
      { status: 500 }
    );
  }
}
