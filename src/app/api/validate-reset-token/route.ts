import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Token is valid",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating reset token:", error);
    return Response.json(
      {
        success: false,
        message: "Error validating reset token",
      },
      { status: 500 }
    );
  }
}