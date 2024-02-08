import {FC, useEffect, useState} from "react";
import {Avatar, Button, Stack, useToast} from "@chakra-ui/react";
import {IChats, IUserChat} from "../../types";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";
import {getSender, getSenderFull} from "../../utility/config.ts";
import {Link} from "react-router-dom";
import {fetchChats} from "../../lib/mongoDB/api.ts";


interface IMyChats {
    fetchAgain: boolean
}


const MyChats: FC<IMyChats> = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState<IUserChat>()

    const {notification, setSelectedChat, user, chats, setChats} = ChatState()

    const toast = useToast();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
        setLoggedUser(userInfo)
        fetchChats(setChats, userInfo.token, toast)

        // eslint-disable-next-line
    }, [fetchAgain, notification]);


    return (
        <section className="flex flex-col align-middle w-full p-6">
            <div className="pb-5 px-3 text-[20px] font-bold flex justify-between align-middle">
                <p>Message</p>
                {/*<GroupChatModal>*/}
                {/*    */}
                {/*</GroupChatModal>*/}
                <Button
                    display="flex"
                    fontSize={{base: "17px", md: "10px", lg: "17px"}}
                    rightIcon={<img src="../../../public/assets/icons/edit.svg" alt=""/>}
                >
                    <p className="tracking-tighter-[2rem]">New Group Chat</p>
                </Button>
            </div>
            <div className="overflow-y-hidden flex-col flex w-full h-full p3">
                {chats.length && user ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat: IChats) => {
                            const resetChatsWithNotification = notification.filter((item) => {
                                return item.sender.name === getSenderFull(user, chat.users).name
                            })

                            return (
                                <Link to={`/message/${chat._id}`} key={chat._id}>
                                    <div
                                        className="flex bg-dark-4 rounded-full h-[5rem]  px-2  cursor-pointer "
                                        onClick={() => setSelectedChat(chat)}
                                    >
                                        <div className="flex justify-between w-full items-center ">
                                            <div className="flex gap-3">
                                                <Avatar className="w-[4rem] h-[4rem] se:w-[3rem] se:h-[3rem]" borderRadius={100}
                                                        src={getSenderFull(user, chat.users).pic}/>
                                                <p className="items-center text-lg font-bold flex">
                                                    {!chat.isGroupChat ? getSender(loggedUser!, chat.users) : chat.chatName}
                                                </p>
                                            </div>
                                            <div className="text-lg">
                                                {chat.latestMessage && (
                                                    <div className="flex gap-3">
                                                        <>
                                                            {resetChatsWithNotification.length ? (
                                                                resetChatsWithNotification[0].content.substring(0, 10) + "..."
                                                            ) : (
                                                                <span>
                                                                    {chat.latestMessage.content.length > 50
                                                                    ? chat.latestMessage.content.substring(0, 10) + "..."
                                                                    : chat.latestMessage.content}
                                                                </span>)
                                                            }
                                                        </>

                                                        {resetChatsWithNotification.length > 0 && (
                                                            <span className="w-[1.6rem] h-[1.6rem] bg-primary-600 rounded-full flex justify-center text-[1rem]">
                                                                {resetChatsWithNotification.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}

                    </Stack>
                ) : (
                    <p className="grid place-content-center mt-[20%] h-full w-full">
                        You have no chats
                    </p>
                )}
            </div>
        </section>
    )
}

export default MyChats;