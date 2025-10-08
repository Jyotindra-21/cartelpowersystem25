import VerificationEmail from "@/components/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const res = await resend.emails.send({
      from: "Cartel <team@cartelard.com>",
      to: email,
      subject: "Email Verification",
      react: VerificationEmail({ username, otp: verifyCode }),
      replyTo: "support@cartelard.com",
    });
    if (res.data?.id) {
      return {
        success: true,
        message: "Verification email sent successfully.",
      };
    } else {
      return {
        success: true,
        message: `Something went Wrong! While Sending Email.`,
      };
    }
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
