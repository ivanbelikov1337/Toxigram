import {FC, MouseEventHandler} from "react";
import {Badge} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons";
import {User} from "../../../types";

interface IUserBadgeItem {
    user:User
    handleFunction?: MouseEventHandler<HTMLDivElement>
    admin?: string
}

const UserBadgeItem: FC<IUserBadgeItem> = ({user, handleFunction, admin}) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            {admin === user._id && <span> (Admin)</span>}
            <CloseIcon pl={1} />
        </Badge>
    )
}

export default UserBadgeItem;