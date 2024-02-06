import {FC, MouseEventHandler} from "react";
import { Box, Text} from "@chakra-ui/react";
import {IUserChat} from "../../../types";
import  avatar from "/assets/icons/defoultAvatar.svg"
interface IUserListItem {
    handleFunction: MouseEventHandler<HTMLDivElement>
    user: IUserChat
}

const UserListItem: FC<IUserListItem> = ({handleFunction ,user}) => {

    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            className="bg-dark-4"
            _hover={{
                background: "#877EFF",
                color: "white",
            }}
            w="16.8rem"
            display="flex"
            gap="5px"
            overflow="hidden"
            h="4rem"
            alignItems="center"
            color="white"
            px={3}
            py={2}
            mb={2}
        >
            <img
                className="rounded-full cursor-pointer w-[2rem] mr-2"
                alt={user.name}
                src={user.pic.length > 1 ? user.pic : avatar }
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="small">
                    <b>Email : </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    )
}

export default UserListItem;