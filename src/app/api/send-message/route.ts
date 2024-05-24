import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";


export async function POST(request : Request) {
    await dbConnect()

    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user) {
            return Response.json({
                status: false,
                message: "User not found" 
            },{status : 404})
        }

        //is user accepting the messages
        if(!user.isAcceptingMessage) {
            return Response.json({
                status: false,
                message: "User is not accepting messages"
                },{status : 403}
            )
        }

        const newMessage = {content,createdAt : new Date()}

        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json({
            status: true,
            message: "Message sent successfully",
            data: newMessage
            },{status : 200}
        )
    } catch (error) {
        return Response.json({
            status: false,
            message: "Internal server error : Something went wrong"
            },{status : 500}
        )
    }
}