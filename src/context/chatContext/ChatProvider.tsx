import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {IChats, INotification, IUserChat} from "../../types";
import {
    INITIAL_STATE_CHATS,
    INITIAL_STATE_MESSAGE,
    INITIAL_STATE_MESSAGE_USER_CHAT,
} from "../../utility";
import io, {Socket} from "socket.io-client";


interface IChatProvider {
    children: ReactNode
}

interface IChatContext {
    selectedChat: IChats
    setSelectedChat: any
    user: IUserChat
    setUser: (item: IUserChat) => void
    notification: INotification[]
    setNotification: (item: INotification[]) => void
    chats: IChats[]
    setChats: (item: IChats[]) => void
}

let socket: Socket;
let selectedChatCompare: IChats;

const ChatContext = createContext<IChatContext >(INITIAL_STATE_MESSAGE);

const ChatProvider: FC<IChatProvider> = ({children}) => {
    const [user, setUser] = useState<IUserChat>(INITIAL_STATE_MESSAGE_USER_CHAT);
    const [chats, setChats] = useState<IChats[]>([]);
    const [selectedChat, setSelectedChat] = useState(INITIAL_STATE_CHATS);
    const [notification, setNotification] = useState<INotification[]>([]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
        if (userInfo) setUser(userInfo)
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
        socket = io("https://messengers.onrender.com");
        socket.emit("setup", userInfo);
    }, []);

    useEffect(() => {
        selectedChatCompare = selectedChat;
    },[selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved: INotification) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                }
            }
        });
    });

    return (
        <ChatContext.Provider
            value={{selectedChat, setSelectedChat, user, setUser, notification, setNotification, chats, setChats,}}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState = () => {
    return useContext(ChatContext) as IChatContext;
};

export default ChatProvider;