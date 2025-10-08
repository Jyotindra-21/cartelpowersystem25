import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token, password } = await request.json();

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

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Password reset successfully. You can now sign in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json(
      {
        success: false,
        message: "Error resetting password",
      },
      { status: 500 }
    );
  }
}