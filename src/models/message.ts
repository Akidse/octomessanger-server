import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export enum MessageType {
    TEXT = "TEXT",
};

@modelOptions({ options: { customName: 'Messages' } })
export class MessageClass extends TimeStamps {
    @prop()
    public type?: MessageType;

    @prop()
    public content?: string;

    @prop()
    public ownerId?: string;

    @prop()
    public chatId?: string;
}

const MessageModel = getModelForClass(MessageClass);

export default MessageModel;