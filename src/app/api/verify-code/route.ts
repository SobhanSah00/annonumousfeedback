import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import {z} from 'zod'

export async function POST(request : Request) {
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})

        if(!user) {
            return Response.json({
                success : false,
                messsage : "user not found"
            },{status : 500}) 
        }

        const isCodeValid = user.verifycode === code
        const CheckIsCodeExpired = new Date(user.verifycodeExpiry) > new Date()

        if(isCodeValid && CheckIsCodeExpired) {
            user.isVerifyed = true
            await user.save()

            return Response.json({
                success : true,
                message : "user account verified successfully"
            },{status : 200})
        } 
        else if(!CheckIsCodeExpired) {
            return Response.json({
                success : false,
                message : "Verification code has expired, please signup again to get a new code"
            },{status : 400})
        }
        else {
            return Response.json({
                success : false,
                message : "Verification code is invalid"
            },{status : 400})    
        }


    } catch (error) {
        console.error("Error in verifying user check the Verify code",error);
        return Response.json({
            success : false,
            messsage : "Error verifying user"
        },{status : 500})
    }
}