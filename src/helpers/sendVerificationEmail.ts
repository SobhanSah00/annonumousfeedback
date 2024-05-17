import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode : string
):Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery message | verification code',
            react: VerificationEmail({username : username, otp : verifycode}),
          });

        return {success : true,message : 'verification eamil send successfully'}
    } catch(eamilError) { 
        console.error("Error sending in verification email",eamilError)
        return {success : false,message : 'Failed to send verification email'}
    }
}