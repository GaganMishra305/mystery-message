import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificaitonEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verificaiton Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });

        return {success: true, message: "Verification email sent"}
    }catch(err){
        console.error("Error sendin verificaiton email: ",err)
        return {success: false, message: "Error sending verification email"}
    }

}