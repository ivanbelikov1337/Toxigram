import {FC, useEffect, useState} from "react";
import {useGetUserById} from "../../lib/reactQuery/queriesAndMutations.ts";
import {Link} from "react-router-dom";
import {Button} from "../ui/button.tsx";
import Loader from "./Loader.tsx";
import {followingUser, unFollowingUser} from "../../lib/appwrite/api.ts";
import {Models} from "appwrite";

interface IShowUserFollow {
    id: string
    currentUser: Models.Document
}

type followingStatus = false | true
const ShowUserFollow: FC<IShowUserFollow> = ({id, currentUser}) => {
    const {data: otherUser} = useGetUserById(id)

    const [isFollowing, setIsFollowing] = useState<followingStatus>(false)
    const [loading, setLoading] = useState(false)
    const [arrayFollowing, setArrayFollowing] = useState<string[]>([])


    useEffect(() => {
        if (currentUser) setArrayFollowing(currentUser.following)
        if (arrayFollowing?.includes(id)) setIsFollowing(true)
    }, [currentUser, arrayFollowing, id]);

    if (!otherUser) {
        return (
            <div className="flex-center w-full h-full">
                <Loader/>
            </div>
        )
    }

    const handleClickFollowingAdnUnf = async (status: boolean) => {
        if (status) {
            setLoading(true)
            const isUpdate = await followingUser(currentUser.$id, arrayFollowing!, id, otherUser.followers)
            if (isUpdate) {
                setLoading(false)
                setIsFollowing(status)
            } else {
                setLoading(false)
                setIsFollowing(false)
            }

        } else {
            setLoading(true)
            const isUpdate = await unFollowingUser(currentUser.$id, arrayFollowing!, id, otherUser.followers)
            if (isUpdate) {
                setLoading(false)
                setIsFollowing(status)
            }
        }
    }


    return (
        <section className="user-card">
            <Link to={`/profile/${otherUser.$id}`} className="user-card_link">
                <img
                    src={otherUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="creator"
                    className="rounded-full w-14 h-14"
                />

                <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-light-1 text-center line-clamp-1">
                        {otherUser.name}
                    </p>
                    <p className="small-regular text-light-3 text-center line-clamp-1">
                        @{otherUser.username}
                    </p>
                </div>

            </Link>
            {isFollowing ?
                <Button disabled={loading} onClick={() => handleClickFollowingAdnUnf(false)} type="button" size="sm"
                        className="shad-button_primary_unfollow  px-5">
                    {loading ? <Loader/> : <span>Unfollow</span>}
                </Button> :
                <Button disabled={loading} onClick={() => handleClickFollowingAdnUnf(true)} type="button" size="sm"
                        className="shad-button_primary z-[100] px-5">
                    {loading ? <Loader/> : <span>Follow</span>}
                </Button>
            }
        </section>
    )
}

export default ShowUserFollow;