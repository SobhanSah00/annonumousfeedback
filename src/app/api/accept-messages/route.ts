import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session?.user) {
        return Response.json({
            success : false,
            message : "Error verifying user"
        },{status : 401})
    }

    const userId = user._id

    
}