import { getSockets } from "..";
import ChatModel, { ChatType } from "../../models/chat";
import MessageModel, { MessageType } from "../../models/message";
import SubscriptionModel from "../../models/subscription";
import User from "../../models/user";

export default (socket: SocketIO.Socket) => {
    socket.on("send_message", async (payload: any) => {
        if(!payload.chatId) {
            const receiver = await User.findOne({_id: payload.receiverId});
            if(!receiver)
              return;
            const chat = await ChatModel.create({name: receiver.nickname, type: ChatType.USER});
            const userSubscription = await SubscriptionModel.create({chatId: chat._id, userId: (socket as any).user._id});
            const recevierSubscription = await SubscriptionModel.create({chatId: chat._id, userId: receiver._id});
            const message = await MessageModel.create({chatId: chat._id, content: payload.message, type: MessageType.TEXT, ownerId: (socket as any).user._id});
      
            const responseObj = {chat: {
              _id: chat._id,
              updatedAt: chat.updatedAt,
              createdAt: chat.createdAt,
              name: chat.name,
              type: chat.type,
              messages: [message],
              subscriptions: [userSubscription, recevierSubscription],
            }};
      
            socket.to(receiver._id).emit('chat_created', responseObj);
            socket.emit('receiver_chat_created', responseObj);
      
            let receiverSocket = getSockets().find((u) => u.userId == receiver._id);
            if(receiverSocket)
              receiverSocket.socket.join(chat._id);
            socket.join(chat._id);
          } else {
            const chat = await ChatModel.findOne({_id: payload.chatId});
            if(!chat)
              return;
            
            const message = await MessageModel.create({chatId: chat._id, content: payload.message, type: MessageType.TEXT, ownerId: (socket as any).user._id});
            await chat.updateOne({updatedAt: new Date()});
      
            socket.to(chat._id+'').emit('message_emitted', {message: message, chat: chat});
            socket.emit('message_sent_success', {message: message, chat: chat, psevdoId: payload.psevdoId});
          }
    });
};