import { Message } from "@/model/user.model"

export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptMessages ?:  boolean; // optional
    messages ?: Array<Message>; // optional
}