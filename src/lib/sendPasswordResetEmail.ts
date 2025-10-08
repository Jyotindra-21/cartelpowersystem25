import { Resend } from 'resend';
import PasswordResetEmail from '@/components/emails/PasswordResetEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetLink: string
): Promise<{ success: boolean; message?: string }> {
  try {
    await resend.emails.send({
      from: 'Cartel <team@cartelard.com>', 
      to: email,
      subject: 'Reset Your Password - Cartel',
      react: PasswordResetEmail({ username, resetLink }),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      message: 'Failed to send password reset email',
    };
  }
}