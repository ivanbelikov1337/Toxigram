import {Models} from "appwrite";
import {Link} from "react-router-dom";

import {Button} from "../ui/button";
import {FC, useEffect, useState} from "react";
import {followingUser, unFollowingUser,} from "../../lib/appwrite/api.ts";
import Loader from "./Loader.tsx";
import {useGetUserById} from "../../lib/reactQuery/queriesAndMutations.ts";

interface UserCardProps {
    user: Models.Document;
    currentUser: string;
}

type followingStatus = false | true
const UserCard: FC<UserCardProps> = ({ user,currentUser }) => {
    const {data:currentUserItems} = useGetUserById(currentUser)
    const [isFollowing, setIsFollowing] = useState<followingStatus>(false)
    const [loading, setLoading] = useState(false)
    const [arrayFollowing, setArrayFollowing] = useState<string[]>([])



    useEffect(() => {
        if (currentUserItems) setArrayFollowing(currentUserItems?.following)
        if (arrayFollowing?.includes(user.$id)) setIsFollowing(true)
    }, [currentUserItems,arrayFollowing,user.$id]);



    const handleClickFollowingAdnUnf = async (status: boolean) => {
        if (status) {
            setLoading(true)
            const isUpdate = await followingUser(currentUser, arrayFollowing!, user.$id,user.followers)
            if (isUpdate) {
                setLoading(false)
                setIsFollowing(status)
            } else {
                setLoading(false)
                setIsFollowing(false)
            }

        } else {
            setLoading(true)
            const isUpdate = await unFollowingUser(currentUser, arrayFollowing!, user.$id,user.followers)
            if (isUpdate) {
                setLoading(false)
                setIsFollowing(status)
            }
        }
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
                <Button disabled={loading} onClick={() => handleClickFollowingAdnUnf(false)}  type="button" size="sm"
                        className="shad-button_primary_unfollow  px-5">
                    {loading ? <Loader/>: <span>Unfollow</span>}
                </Button> :
                <Button disabled={loading} onClick={() => handleClickFollowingAdnUnf(true)}  type="button" size="sm"
                        className="shad-button_primary z-[100] px-5">
                    {loading ? <Loader/>: <span>Follow</span>}
                </Button>
            }
        </section>

    );
};

export default UserCard;