import { IExtendedSocket } from "..";
import ChatModel from "../../models/chat";
import MessageModel from "../../models/message";
import SubscriptionModel from "../../models/subscription";
import User from "../../models/user";

async function populateChatsWithMessages(chats: any[], userId: string) {
    const MESSAGES_CHUNK_SIZE = 30;
    for(let i = 0; i < chats.length; i++) {
        const subscription = chats[i].subscriptions.find((s: any) => s.chatId === chats[i]._id+'' && s.userId == userId);
        let messages = await MessageModel.find({chatId: chats[i]._id, ownerId: {$not: {$eq: userId+''}}, createdAt: {$gt: subscription.updatedAt}});
        const unreadCount = messages.length;
        if(unreadCount < MESSAGES_CHUNK_SIZE)
            messages = await MessageModel.find({chatId: chats[i]._id}).limit(MESSAGES_CHUNK_SIZE);

        chats[i] = {...chats[i], messages, unreadCount};
    }
}

async function populateChatsWithUsers(chats: any[]) {
    for(let i = 0; i < chats.length; i++) {
        const subscriptions = await SubscriptionModel.find({chatId: chats[i]._id});
        const usersIds = subscriptions.map((s) => s.userId);
        const users = await User.find({_id: {$in: usersIds}});
        const populatedWithUsersSubscriptions = subscriptions.map((s: any) => {
            return {...s._doc, user: users.find((u) => u._id == s.userId)};
        });
        chats[i] = {...chats[i]._doc, subscriptions: populatedWithUsersSubscriptions};
    }
}

export default async (payload: {socket: IExtendedSocket}) => {
    let chats: any[] = [];
    const subscriptions = await SubscriptionModel.find({userId: payload.socket.user._id});
    if(subscriptions.length) {
        chats = await ChatModel.find({_id: {$in: subscriptions.map((s) => s.chatId)}});
        await populateChatsWithUsers(chats);
        await populateChatsWithMessages(chats, payload.socket.user._id);
    }
    
    chats.forEach((c) => {
        payload.socket.join(c._id+'');
    });
    payload.socket.emit('chats', {
        chats: chats,
    });
    payload.socket.join(payload.socket.user._id+'');
}