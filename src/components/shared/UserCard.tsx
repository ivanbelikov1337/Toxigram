import {Models} from "appwrite";
import {Link} from "react-router-dom";

import {Button} from "../ui/button";
import {FC, useState} from "react";
import {followingUser} from "../../lib/appwrite/api.ts";
import {useUserContext} from "../../context/AuthContext.tsx";

interface UserCardProps {
    user: Models.Document;
}

type followingStatus = false | true | null
const UserCard: FC<UserCardProps> = ({ user }) => {
    const { user: currentUser } = useUserContext();
    const [isFollowing, setIsFollowing] = useState<followingStatus>(null)


    const handleClickFollowing = async (status: boolean) => {
        const isUpdate = await followingUser(user.$id, [currentUser.id])
        console.log(isUpdate)
        setIsFollowing(status)
    }



    return (
        <section className="user-card">
            <Link to={`/profile/${user.$id}`} className="user-card_link">
                <img
                    src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="creator"
                    className="rounded-full w-14 h-14"
                />

                <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-light-1 text-center line-clamp-1">
                        {user.name}
                    </p>
                    <p className="small-regular text-light-3 text-center line-clamp-1">
                        @{user.username}
                    </p>
                </div>

            </Link>
            {isFollowing ?
                <Button onClick={() => handleClickFollowing(false)}  type="button" size="sm"
                        className="shad-button_primary_unfollow  px-5">
                    Unfollow
                </Button> :
                <Button onClick={() => handleClickFollowing(true)}  type="button" size="sm"
                        className="shad-button_primary z-[100] px-5">
                    Follow
                </Button>
            }
        </section>

    );
};

export default UserCard;