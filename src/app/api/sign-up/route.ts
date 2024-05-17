import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs"
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail"

export async function POST(request:Request) {
    await dbConnect();

    try {
        const {username , email, password} = await request.json();
        const existingUserVerifyedByUsername = await UserModel.findOne
        ({
            username,
            isVerifyed : true
        });

        if(existingUserVerifyedByUsername) { 
            return Response.json({
                success : false,
                message : "Username is already taken"
            },{status: 400})
        }

        const existingUserVerifyedByEmail = await UserModel.findOne({email})

        const verifycode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserVerifyedByEmail) {
            if(existingUserVerifyedByEmail.isVerifyed) {
                return Response.json({
                    success : false,
                    message : "User is already exist with this email"
                },{status: 400})
            }else {
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserVerifyedByEmail.password = hashedPassword
                existingUserVerifyedByEmail.verifycode = verifycode;
                existingUserVerifyedByEmail.verifycodeExpiry = new Date(Date.now() + 3600000)

                await existingUserVerifyedByEmail.save();
            }
        }  
         else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();

            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username: username,
                email: email,
                password : hashPassword,
                verifycode : verifycode,
                verifycodeExpiry : expiryDate,
                isVerifyed : false,
                isAcceptingMessage : true,
                messages : [],
            })

            await newUser.save()
        }

        //send verifiacation eamil

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifycode
        )

        if(!emailResponse.success) {
            return Response.json({
                success : false,
                message : emailResponse.message
                },{status: 500}
            )
        }

        return Response.json({
            success : true,
            message : "User registered successfully, please verify yout email"
            },{status: 201}
        )
    
    }

    catch (error) { 
        console.error('error in registering user',error);
        return Response.json(
            {
                success : false,
                message : 'error in registering user'
            },
            {
                status : 500
            }
        )
    }
}