import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Tooltip,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import { IUserChat} from "../../types";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";
import UserListItem from "./useAvatar/UserListItem.tsx";
import ChatLoading from "./chatSetting/ChatLoading.tsx";
import {Input} from "../ui/input.tsx";
import {FaDeleteLeft} from "react-icons/fa6";
import Loader from "../shared/Loader.tsx";
import {accessChat, searchUserByNameOrEmail, updateUserIdInMD} from "../../lib/mongoDB/api.ts";


const SideDrawer = () => {
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<IUserChat[]>([]);

    const {chats, setChats, user: userChat, setSelectedChat} = ChatState();

    const toast = useToast();
    const {isOpen, onOpen, onClose} = useDisclosure();


    useEffect(() => {
        if (!userChat._id) return

        updateUserIdInMD(userChat)

    }, [userChat])

    return (
        <>
            <div className="flex w-full items-center justify-between h-[4rem] px-5 border-b-[1px] border-b-primary-500">
                <Tooltip hasArrow placement="bottom-end">
                    <Button className="flex gap-3" variant="ghost" onClick={onOpen}>
                        <img
                            src="/assets/icons/search.svg"
                            className="cursor-pointer w-5"
                            alt="search"
                        />
                        <p>Search User</p>
                    </Button>
                </Tooltip>
            </div>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay/>
                <DrawerContent
                    onKeyDown={(e) => searchUserByNameOrEmail(setSearchResult, toast, setLoading, search, userChat.token, e)}>
                    <DrawerHeader className="bg-dark-4 w-full text-center pt-12">Search Users</DrawerHeader>
                    <DrawerBody className="bg-dark-4 w-full h-full">
                        <Box className="flex gap-1 px-4 relative  rounded-lg bg-dark-4">
                            <FaDeleteLeft
                                className="absolute top-[-1.5rem] cursor-pointer right-1 w-[2rem] h-[2rem]"
                                onClick={onClose}
                                color="#877EFF"
                            />
                            <img
                                src="/assets/icons/search.svg"
                                className="cursor-pointer"
                                width={30}
                                height={30}
                                alt="search"
                                onClick={() => searchUserByNameOrEmail(setSearchResult, toast, setLoading, search, userChat.token, {key: "Enter"})}
                            />
                            <Input
                                placeholder="Search by name or email"
                                className="user-message-search text-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Box>
                        {loading ? (
                            <ChatLoading/>
                        ) : (
                            searchResult?.map((user: IUserChat) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(userChat.token, user._id, chats, setChats, toast, setLoadingChat, setSelectedChat, onClose)}
                                />
                            ))
                        )}
                        {loadingChat && <Loader/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;