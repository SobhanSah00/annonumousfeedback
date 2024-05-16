import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password : string;
    verifycode : string;
    verifycodeExpiry : Date;
    isVerifyed : boolean;
    isAcceptingMessage : boolean;
    messages : Message[];
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match : [/.+\@.+\..+/, "please use a valid email address"]
    },
    password: {
        type : String,
        required: [true, "password is required"],
    },
    verifycode: {
        type: String,
        required : [true, "verifycode is required"]
    },
    verifycodeExpiry: {
        type: Date,
        required : [true, "verifycode Expiry is required"]
    },
    isVerifyed: {
        type: Boolean,
        default : false
    },
    isAcceptingMessage: {
        type: Boolean,
    },
    messages: {
        type: [MessageSchema]
    }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);
const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) ||mongoose.model<Message>('Message', MessageSchema);


export default UserModel;
