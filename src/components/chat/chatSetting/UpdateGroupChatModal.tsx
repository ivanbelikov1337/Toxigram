import {FC, useState} from "react";
import {
    Box,
    Button, FormControl,
    IconButton, Input,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Spinner,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import axios from "axios";
import {ViewIcon} from "@chakra-ui/icons";
import {ChatState} from "../../../context/chatContext/ChatProvider.tsx";
import {IUserChat, User} from "../../../types";
import UserBadgeItem from "../useAvatar/UserBadgeItem.tsx";
import UserListItem from "../useAvatar/UserListItem.tsx";

interface IUpdateGroupChatModal {
    fetchMessages: () => void
    fetchAgain: boolean
    setFetchAgain: (item: boolean) => void
}

const UpdateGroupChatModal: FC<IUpdateGroupChatModal> = ({fetchMessages, fetchAgain, setFetchAgain}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const toast = useToast();

    const [renameLoading, setRenameLoading] = useState<boolean>(false);
    const [groupChatName, setGroupChatName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState<string>("");

    const handleSearch = async (query: string) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`https://messengers.onrender.com/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error: unknown) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `https://messengers.onrender.com/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            // setSelectedChat("");
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error: unknown) {
            toast({
                title: "Error Occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1:IUserChat) => {
        if (selectedChat.users.find((u:User) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin?._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `https://messengers.onrender.com/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error:unknown) {
            toast({
                title: "Error Occurred!",
                // description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (id: string) => {
        if (selectedChat.groupAdmin?._id !== user._id && id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `https://messengers.onrender.com/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: id,
                },
                config
            );

            id === user._id ? setSelectedChat(null) : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error:unknown) {
            toast({
                title: "Error Occurred!",
                // description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <IconButton aria-label="Button" disabled={false} icon={<ViewIcon />} onClick={onOpen} />

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>

                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((user:User) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    admin={selectedChat.groupAdmin?._id}
                                    handleFunction={() => handleRemove(user._id)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user: IUserChat) => (
                                <UserListItem
                                    user={user}
                                    key={user._id}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemove(user._id)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal;