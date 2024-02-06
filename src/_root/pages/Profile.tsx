import {Link, Outlet, Route, Routes, useLocation, useParams,} from "react-router-dom";
import {useUserContext} from "../../context/authContext/AuthContext.tsx";
import Loader from "../../components/shared/Loader.tsx";
import {Button} from "../../components/ui/button.tsx";
import GridPostList from "../../components/shared/GridPostList.tsx";
import {LikedPosts} from "./index.ts";
import {useGetUserById} from "../../lib/reactQuery/queriesAndMutations.ts";
import {useEffect, useState} from "react";
import Following from "./Following.tsx";
import Followers from "./Followers.tsx";
import {followingUser, unFollowingUser, updateCurrentIdUserMd} from "../../lib/appwrite/api.ts";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";
import {Spinner,useToast} from "@chakra-ui/react";
import {accessChat, fetchChats} from "../../lib/mongoDB/api.ts";


interface StabBlockProps {
    value: string | number;
    label: string;
}

type followingStatus = false | true | null

const StatBlock = ({value, label}: StabBlockProps) => (
    <div className="flex-center gap-2">
        <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
        <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
);

const Profile = () => {
    const {user} = useUserContext();
    const {pathname} = useLocation();
    const {id} = useParams();
    const toast = useToast();
    const {chats, setChats, setSelectedChat} = ChatState()
    const {data: currentUser} = useGetUserById(user.id);
    const {data: otherUser} = useGetUserById(id || "");

    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState<boolean>(false)
    const [arrayFollowing, setArrayFollowing] = useState<string[]>([])
    const [isFollowing, setIsFollowing] = useState<followingStatus>(null)


    useEffect(() => {
        const idUserFromMd = JSON.parse(localStorage.getItem("userInfo")!);
        fetchChats(setChats, idUserFromMd.token,toast)
        if (!currentUser) return
        if (!currentUser.idMd) updateCurrentIdUserMd(currentUser.$id!, idUserFromMd._id)
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) setArrayFollowing(currentUser.following)
        if (arrayFollowing?.includes(id!)) setIsFollowing(true)
    }, [currentUser, arrayFollowing, id]);

    const filteredData = chats.filter((item) => {
        if (item.users.length) {
            for (const prop in item.users) {
                if (item.users[prop]['name'] === otherUser?.name) {
                    return true
                }
            }
        }
        return false
    })

    useEffect(() => {
        const userToken = JSON.parse(localStorage.getItem("userInfo")!);
        if  (!filteredData.length) return
        if  (chats.includes(filteredData[0])) return;
        otherUser?.idMd && accessChat(userToken.token, otherUser?.idMd, chats, setChats, toast,setLoadingChat,setSelectedChat)
    }, [otherUser?.idMd,filteredData.length,chats])

    if (!otherUser || !currentUser || !chats)
        return (
            <div className="flex-center w-full h-full">
                <Loader/>
            </div>
        );

    const handleClickFollowingAdnUnf = async (status: boolean) => {
        if (status) {
            setLoading(true)
            const isUpdate = await followingUser(currentUser.$id, arrayFollowing!, id!, otherUser.followers)
            if (isUpdate) {
                setLoading(false)
                setIsFollowing(status)
            } else {
                setLoading(false)
                setIsFollowing(false)
            }

        } else {
            setLoading(true)
            const isUpdate = await unFollowingUser(currentUser.$id, arrayFollowing!, id!, otherUser.followers)
            if (isUpdate) {
                setLoading(false)
                setIsFollowing(status)
            }
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
                    <img
                        src={
                            otherUser.imageUrl || "/assets/icons/profile-placeholder.svg"
                        }
                        alt="profile"
                        className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
                    />
                    <div className="flex flex-col flex-1 justify-between md:mt-2">
                        <div className="flex flex-col w-full">
                            <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                                {otherUser.name}
                            </h1>
                            <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                                @{otherUser.username}
                            </p>
                        </div>

                        <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                            <StatBlock value={otherUser.posts.length} label="Posts"/>
                            <Link to={`/profile/${id}/followers`}>
                                <StatBlock value={otherUser.followers.length} label="Followers"/>
                            </Link>
                            <Link to={`/profile/${id}/following`}>
                                <StatBlock value={otherUser.following === null ? 0 : otherUser.following.length}
                                           label="Following"/>
                            </Link>
                        </div>
                        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                            {otherUser.bio}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <div className={`${otherUser.$id !== currentUser.$id && "hidden"}`}>
                            <Link
                                to={`/update-profile/${otherUser.$id}`}
                                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                                    currentUser.id !== otherUser.$id && "hidden"
                                }`}>
                                <img
                                    src={"/assets/icons/edit.svg"}
                                    alt="edit"
                                    width={20}
                                    height={20}
                                />
                                <p className="flex whitespace-nowrap small-medium">
                                    Edit Profile
                                </p>
                            </Link>
                        </div>
                        <div className={`${currentUser.$id === id && "hidden"}`}>
                            {isFollowing ?
                                <Button disabled={loading} onClick={() => handleClickFollowingAdnUnf(false)}
                                        type="button" size="sm"
                                        className="shad-button_primary_unfollow  px-8">
                                    {loading ? <Loader/> : <span>Unfollow</span>}
                                </Button> :
                                <Button disabled={loading} onClick={() => handleClickFollowingAdnUnf(true)}
                                        type="button" size="sm"
                                        className="shad-button_primary z-[100] px-8">
                                    {loading ? <Loader/> : <span>Follow</span>}
                                </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex max-w-5xl w-full">
                <Link
                    to={`/profile/${id}`}
                    className={`profile-tab rounded-l-lg ${
                        pathname === `/profile/${id}` && "!bg-dark-3"}`}>
                    <img
                        src={"/assets/icons/posts.svg"}
                        alt="posts"
                        width={20}
                        height={20}
                    />
                    Posts
                </Link>
                {otherUser.$id === currentUser.$id && (
                    <Link
                        to={`/profile/${id}/liked-posts`}
                        className={`profile-tab rounded-r-lg ${
                            pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
                        }`}>
                        <img
                            src={"/assets/icons/like.svg"}
                            alt="like"
                            width={20}
                            height={20}
                        />
                        Liked Posts
                    </Link>)
                }
                {otherUser.$id !== currentUser.$id && (
                    <>
                        {chats.length && !loadingChat ?
                            <Link to={`/message/${filteredData[0]["_id"]}`}
                                  className={`profile-tab rounded-r-lg ${
                                      pathname === `/profile/${id}` && "!bg-dark-3"}`}
                                  onClick={() => setSelectedChat(filteredData[0])}
                            >
                                <img
                                    src={"/assets/icons/message.svg"}
                                    alt="message"
                                    width={20}
                                    height={20}
                                />
                                Message
                            </Link> : <Spinner className="ml-[10%]" w={60} h={60}/>
                        }
                    </>
                )
                }
            </div>


            <Routes>
                <Route index element={<GridPostList posts={otherUser.posts} showUser={false}/>}/>
                {otherUser.$id === currentUser.$id && (<Route path="/liked-posts" element={<LikedPosts/>}/>)}
                <Route path="/following" element={<Following id={id!}/>}/>
                <Route path="/followers" element={<Followers id={id!}/>}/>
            </Routes>
            <Outlet/>
        </div>
    );
};

export default Profile;