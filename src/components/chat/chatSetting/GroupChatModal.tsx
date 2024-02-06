import {FC, ReactNode, useState} from "react";
import {
    Box, Button,
    FormControl, Input,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import axios from "axios";
import {ChatState} from "../../../context/chatContext/ChatProvider.tsx";
import {IUserChat, User} from "../../../types";
import UserListItem from "../useAvatar/UserListItem.tsx";
import UserBadgeItem from "../useAvatar/UserBadgeItem.tsx";


interface IGroupChatModal {
    children : ReactNode
}


const GroupChatModal: FC<IGroupChatModal> = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState<string>("");
    const [selectedUsers, setSelectedUsers] = useState<IUserChat[]>([]);
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleGroup = (userToAdd:IUserChat) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query:string) => {
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
        }
    };


    const handleDelete = (delUser: User) => {
        setSelectedUsers(selectedUsers.filter(({_id}:{_id:string}) => _id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `https://messengers.onrender.com/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map(({_id}:{_id:string}) => _id)),
                },
                config
            );
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error: unknown) {
            toast({
                title: "Failed to Create the Chat!",
                // description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((user:User) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user:IUserChat) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit} colorScheme="blue">
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal;