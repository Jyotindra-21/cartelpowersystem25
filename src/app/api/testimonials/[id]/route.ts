// app/api/testimonials/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/testimonialModel";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  await dbConnect();

  try {
    const testimonial = await Testimonial.findById(params.id).lean();

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          error: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to fetch testimonial',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  await dbConnect();

  try {
    const body = await request.json();
    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          error: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to update testimonial',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();

  try {
    const testimonial = await Testimonial.findByIdAndDelete(params.id).lean();

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          error: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { _id: params.id },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to delete testimonial',
      },
      { status: 500 }
    );
  }
}