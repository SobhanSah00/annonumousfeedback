import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import {usernameValidation} from "@/schemas/signupSchema"


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request) {

    // if(request.method !== 'GET') {
    //     return Response.json({
    //         success : false,
    //         message : "This Method is not allowed and please cheack the method"
    //     },{status : 405})
    // }

    await dbConnect()

    try {
      const {searchParams} = new URL(request.url)  
      const queryParam = {
        username : searchParams.get('username')
      }

      //Validate with zod
      const result = UsernameQuerySchema.safeParse(queryParam)

      console.log(result);

      if(!result.success) {
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success : false,
            message : usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query parameters"
        },{status : 400})
      } 

      const {username} = result.data

      const existingVerifiedUser = await UserModel.findOne({username,isVerifyed : true})

      if(existingVerifiedUser) {
            return Response.json({
                success : false,
                message : "Username is already taken",
            },{status : 400})
        }   

        return Response.json({
            success : true,
            message : "Username is unique",
        },{status : 200})
        
      
    } catch (error) {
        console.error("Error checking username",error);
        return Response.json({
            success : false,
            messsage : "Error checking username"
        },{status : 500})
    }
}