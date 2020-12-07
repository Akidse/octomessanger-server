import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ options: { customName: 'Users' }})
class UserClass {
    @prop()
    public nickname?: string;

    @prop({autopopulate: false})
    public password?: string;
}

const User = getModelForClass(UserClass);

export default User;