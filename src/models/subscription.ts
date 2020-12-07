import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ options: { customName: 'Subscriptions' }})
export class SubscriptionClass extends TimeStamps {
    @prop()
    public userId?: string;

    @prop()
    public chatId?: string;
}

const SubscriptionModel = getModelForClass(SubscriptionClass);

export default SubscriptionModel;