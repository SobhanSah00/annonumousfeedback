import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/user.model";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id : "Credentials",
            name : "Credentials",
            credentials : {
                email : {label : "Email", type : "text"},
                password : {label : "Password", type : "password"}
            },
            async authorize(Credentials : any) : Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: Credentials.identifier},
                            {username: Credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("User not found")
                    }
                    if (!user.isVerifyed) {
                        throw new Error('please verify your account before login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(Credentials.password,user.password)

                    if(!isPasswordCorrect) {
                        throw new Error("Password is incorrect")
                    } else {
                        return user
                    }
                } catch (error : any) {
                    throw new Error(error.message)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {

            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        },
        async session({session, token}) {

            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }

            return session
        }  
    },
    pages : {
        signIn : "/signin"
    },
    session : {
        strategy : "jwt" // this is a bearrer startegy , who have the token they can login 
    },
    secret : process.env.NEXTAUTH_SECRET
}