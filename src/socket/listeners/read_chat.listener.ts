import ChatModel from "../../models/chat";
import SubscriptionModel from "../../models/subscription";

export default (socket: SocketIO.Socket) => {
    socket.on('read_chat', async (payload: any) => {
        const chat = await ChatModel.findOne({_id: payload.chatId});
        if(!chat)
          return;
        const subscription = await SubscriptionModel.findOne({chatId: chat._id, userId: (socket as any).user._id});
        if(!subscription)
          return;
    
        const updatedAt = new Date();
        SubscriptionModel.findOneAndUpdate({_id: subscription._id}, {updatedAt}, {new: true}, (err, doc) => {
          console.log(doc);
          socket.emit('read_chat_success', {chatId: payload.chatId, subscription: doc});
          socket.to(payload.chatId+'').emit('user_reads_chat', {userId: (socket as any).user._id, subscription: doc});
        });
    });
};