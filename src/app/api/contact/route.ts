import dbConnect from "@/lib/dbConnect";
import { ContactFormModel } from "@/models/contactModel";
import { contactFormSchema } from "@/schemas/contactSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    const validatedData = contactFormSchema.parse(requestBody);

    const newContact = await ContactFormModel.create({
      ...validatedData,
      status: "new", // Default status
    });

    return NextResponse.json(
      {
        success: true,
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Submission failed",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const { contactId, status } = await request.json();

    if (!["new", "inprogress", "resolved"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedContact = await ContactFormModel.findByIdAndUpdate(
      contactId,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedContact },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Handle both single ID and array of IDs
    const contactIds = Array.isArray(body.contactIds)
      ? body.contactIds
      : body.contactId
        ? [body.contactId]
        : null;

    // Validation
    if (!contactIds || contactIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Contact ID or array of IDs is required" },
        { status: 400 }
      );
    }

    if (contactIds.some((id: string) => typeof id !== "string")) {
      return NextResponse.json(
        { success: false, error: "All contact IDs must be strings" },
        { status: 400 }
      );
    }

    // Perform deletion
    const deleteResult = await ContactFormModel.deleteMany({
      _id: { $in: contactIds },
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "No contacts found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          deleteResult.deletedCount === 1
            ? "Contact deleted successfully"
            : `${deleteResult.deletedCount} contacts deleted successfully`,
        data: deleteResult,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
