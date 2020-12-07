import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Schema } from "mongoose";

export enum ChatType {
    USER = "USER",
    GROUP = "GROUP",
};

@modelOptions({ options: { customName: 'Chats' }})
export class ChatClass extends TimeStamps {
    @prop()
    public name?: string;

    @prop({ enum: ChatType})
    public type?: ChatType;
}

const ChatModel = getModelForClass(ChatClass);

export default ChatModel;