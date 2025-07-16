import VerificationEmail from "@/components/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
   const res =  await resend.emails.send({
      from: 'team@speedengineering.in',
      to: email,
      subject: 'Cartel Power System Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}