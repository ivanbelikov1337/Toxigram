import axios from "axios";
import {IChats, INotification, IUserChat} from "../../types";
import {UseToastOptions} from "@chakra-ui/react";
import {getCurrentUser} from "../appwrite/api.ts";
import {Socket} from "socket.io-client";
import {ChangeEvent} from "react";


export const accessChat = async (
    token: string,
    userId: string,
    chats: IChats[],
    setChats: (item: IChats[]) => void,
    toast: (item: UseToastOptions) => void,
    setLoadingChat: (item: boolean) => void,
    setSelectedChat: (item: IChats) => void,
    onClose?: () => void,
) => {

    try {
        setLoadingChat(true);
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const {data} = await axios.post(`https://messengers.onrender.com/api/chat`, {userId}, config);

        if (!chats.find(({_id}: { _id: string }) => _id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        setLoadingChat(false);
        onClose!();
    } catch (error: unknown) {
        toast({
            title: "Error fetching the chat",
        });
    }
};

export const updateUserIdInMD = async (userChat: IUserChat) => {
    const currentAccount = await getCurrentUser();
    const idAppwrite = JSON.parse(localStorage.getItem("idAppwrite")!)

    if (idAppwrite) return
    if (!userChat.idAppwrite.trim().length) {
        console.log("here")
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userChat.token}`
            },
        };

        const {data} = await axios.put(
            "https://messengers.onrender.com/api/user/update",
            {
                _id: userChat?._id,
                idAppwrite: currentAccount?.$id,
            },
            config
        );
        localStorage.setItem("idAppwrite", JSON.stringify(data.idAppwrite));
        return data
    }
    return "rejected"
}

interface KeyboardEvent {
    key: string;
}

export const searchUserByNameOrEmail = async (
    setSearchResult: (item: IUserChat[]) => void,
    toast: (item: UseToastOptions) => void,
    setLoading: (item: boolean) => void,
    search: string,
    token: string,
    event?: KeyboardEvent
) => {
    if (!search) {
        toast({title: "Please Enter something in search"});
        return;
    }
    if (event?.key === "Enter") {
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const {data} = await axios.get(`https://messengers.onrender.com/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error: unknown) {
            toast({title: "Error Occurred!",});
        }
    }
};

export const fetchChats = async (
    setChats: (item: IChats[]) => void,
    token: string,
    toast: (item: UseToastOptions) => void,
) => {

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const {data} = await axios.get("https://messengers.onrender.com/api/chat", config);
        const fixChats = data.filter((item: IChats) => item.users.length > 1)

        setChats(fixChats);
    } catch (error: unknown) {
        toast({title: "Error Occurred!",});
    }
};

export const fetchMessages = async (
    id: string,
    toast: any,
    socket: Socket,
    selectedChat: IChats,
    setLoading: (item: boolean) => void,
    setMessages: (item: INotification[]) => void,
) => {
    if (!selectedChat) return

    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        setLoading(true);

        const {data} = await axios.get(
            `https://messengers.onrender.com/api/message/${id}`,
            config
        );

        setMessages(data);
        setLoading(false);

        socket.emit("join chat", id);
    } catch (error: unknown) {
        console.log(error)
        toast({
            title: "Error Occurred!",
            duration: 5000,
        });
    }
};

export const typingHandler = (
    socket: Socket,
    typing: boolean,
    selectedChat: IChats,
    socketConnected: boolean,
    setTyping: (item: boolean) => void,
    setNewMessage: (item: string) => void,
    event: ChangeEvent<HTMLInputElement>,
) => {
    setNewMessage(event.target.value);
    if (!socketConnected) return;

    if (!typing) {

        setTyping(true);
        socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }
    }, timerLength);
};
interface KeyboardEvent {
    key: string;
}

export const sendMessage = async (
    socket: Socket,
    newMessage: string,
    selectedChat:IChats,
    messages:INotification[],
    setNewMessage: (item: string) => void,
    toast: any,
    setMessages: (item: INotification[]) => void,
    event?: KeyboardEvent,
) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    if (event?.key === "Enter" && newMessage) {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            setNewMessage("");
            const {data} = await axios.post(
                "https://messengers.onrender.com/api/message",
                {
                    content: newMessage,
                    chatId: selectedChat,
                },
                config
            );
            socket.emit("new message", data);
            setMessages([...messages, data]);
        } catch (error: unknown) {
            toast({
                title: "Error Occurred!",
                duration: 5000,
            });
        }
    }
};