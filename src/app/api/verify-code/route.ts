import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code, email } = await request.json();

    // Find user by username or email
    const user = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if verifyCode and verifyCodeExpiry exist
    if (!user.verifyCode || !user.verifyCodeExpiry) {
      return Response.json(
        {
          success: false,
          message: "Verification data not found. Please request a new verification code.",
        },
        { status: 400 }
      );
    }

    // Check if code matches
    const isCodeValid = user.verifyCode === code;
    // Check if code is not expired (with proper type checking)
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      // Clear verification code after successful verification
      user.verifyCode = undefined;
      user.verifyCodeExpiry = undefined;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}