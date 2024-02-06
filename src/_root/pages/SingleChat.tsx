import { FC, useEffect, useState} from "react";
import {IChats, INotification} from "../../types";
import io, {Socket} from "socket.io-client";
import {useToast} from "../../components/ui/use-toast.ts";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";
import {getSender, getSenderFull} from "../../utility/config.ts"
import Lottie from "react-lottie"
import {IoMdSend} from "react-icons/io";
import {Avatar, Box, FormControl, IconButton, Input, Spinner, Text,} from "@chakra-ui/react";

import {defaultOptions, INITIAL_STATE_CHATS} from "../../utility";
import {ArrowBackIcon} from "@chakra-ui/icons";
import UpdateGroupChatModal from "../../components/chat/chatSetting/UpdateGroupChatModal.tsx";
import ScrollableChat from "../../components/chat/ScrollableChat.tsx";

import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchMessages, sendMessage, typingHandler} from "../../lib/mongoDB/api.ts";


let socket: Socket;
let selectedChatCompare: IChats;

interface ISingleChat {
    fetchAgain: boolean
    setFetchAgain: (item: boolean) => void
}




const SingleChat: FC<ISingleChat> = ({fetchAgain, setFetchAgain}) => {
    const {id} = useParams();
    const [messages, setMessages] = useState<INotification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>("");
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [typing, setTyping] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const history = useNavigate()
    const {toast} = useToast();
    const {selectedChat, user, notification, setNotification,setSelectedChat} = ChatState();

    useEffect(() => {
        if (!selectedChat._id) history("/message")
        const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
        socket = io("https://messengers.onrender.com");
        socket.emit("setup", userInfo);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages(id!,toast,socket,selectedChat,setLoading,setMessages)
        if (notification.length) {
            const resetNotification = notification.filter((item) => item.sender.name !== getSenderFull(user,selectedChat.users).name)
            setNotification(resetNotification)
        }
        selectedChatCompare = selectedChat;
        return () => setSelectedChat(INITIAL_STATE_CHATS)
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
          socket.on("message recieved", (newMessageRecieved: INotification) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages(([...messages, newMessageRecieved]))
            }
        });
    });


    return (
        <section className="w-full  grid grid-rows-[3.5rem_1fr_3rem]">
            {selectedChat && selectedChat.users.length ? (
                <>
                    <div className=" w-full flex h-[4rem]  align-middle justify-between px-6">
                        <IconButton
                            aria-label="Button"
                            display={{base: "flex", md: "none"}}
                            icon={<ArrowBackIcon fontSize="1.5rem"/>}
                            onClick={() => history(-1)}
                        />
                        {messages &&
                            (!selectedChat.isGroupChat ? (
                                <>
                                    <div className="flex gap-1 ml-[4rem]">
                                        <p className="text-lg grid place-content-center">{getSender(user, selectedChat.users)}</p>
                                        <span className="flex w-[5rem] pt-2">
                                            {isTyping && (
                                                <Lottie options={defaultOptions} height="1.2rem" width="10rem"/>
                                            )}
                                        </span>
                                    </div>
                                    <Link className="flex items-center" to={`/profile/${getSenderFull(user, selectedChat.users).idAppwrite}`}>
                                        <Avatar src={getSenderFull(user, selectedChat.users).pic}
                                                className="w-[2.5rem] h-[2.5rem] mt-1"
                                                borderRadius={100}
                                        />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchMessages={() => fetchMessages(id!,toast,socket,selectedChat,setLoading,setMessages)}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </>
                            ))}
                    </div>
                    <div className="flex flex-col-reverse px-3  w-full overflow-y-auto">
                        {loading ? (
                            <div className="grid place-content-center mb-[30%]">
                                <Spinner w={60} h={60}/>
                            </div>
                        ) : (
                            <div className="message">
                                <ScrollableChat messages={messages}/>
                            </div>
                        )}
                    </div>
                    <FormControl
                        onKeyDown={(e) => sendMessage(socket,newMessage,selectedChat,e,messages,setNewMessage,toast,setMessages)}
                        id="first-name"
                        isRequired
                        className="flex  gap-3 justify-center align-middle rounded-full bg-dark-4 mx-2"
                    >
                        <Input className="message-input"
                               variant="filled"
                               bg="#E0E0E0"
                               placeholder="Enter a message.."
                               value={newMessage}
                               onChange={(e) => typingHandler(socket,typing,selectedChat,socketConnected,setTyping,setNewMessage,e)}
                        />
                        <IoMdSend size="2.7rem" className="pt-[0.5rem]  cursor-pointer"/>
                    </FormControl>
                </>
            ) : (
                // to get socket.io on same page
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </section>
    )
}

export default SingleChat;