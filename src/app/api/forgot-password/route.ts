import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { sendPasswordResetEmail } from "@/lib/sendPasswordResetEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    // Find user by email
    const user = await UserModel.findOne({ email });

    // Don't reveal if email exists or not for security
    if (!user) {
      return Response.json(
        {
          success: true,
          message: "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    const emailResponse = await sendPasswordResetEmail(email, user.username, resetLink);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return Response.json(
      {
        success: false,
        message: "Error processing forgot password request",
      },
      { status: 500 }
    );
  }
}