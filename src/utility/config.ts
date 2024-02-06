import {INotification, IUserChat, User} from "../types";

export const isSameSenderMargin = (messages: INotification[], message:INotification, index:number, userId:string) => {

    if (
        index < messages.length - 1 &&
        messages[index + 1].sender._id === message.sender._id &&
        messages[index].sender._id !== userId
    )
        return 40;
    else if (
        (index < messages.length - 1 &&
            messages[index + 1].sender._id !== message.sender._id &&
            messages[index].sender._id !== userId) ||
        (index === messages.length - 1 && messages[index].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameSender = (messages: INotification[], message:INotification, index:number, userId:string) => {

    return (
        index < messages.length - 1 &&
        (messages[index + 1].sender._id !== message.sender._id ||
            messages[index + 1].sender._id === undefined) &&
        messages[index].sender._id !== userId
    );
};

export const isLastMessage = (messages: INotification[], index:number, userId:string) => {
    return (
        index === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages: INotification[], message:INotification, index:number) => {
    return index > 0 && messages[index - 1].sender._id === message.sender._id;
};

export const getSender = (loggedUser: IUserChat, users: User[]) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser: IUserChat, users: User[]) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};