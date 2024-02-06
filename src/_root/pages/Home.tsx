import Loader from "../../components/shared/Loader.tsx";
import {Models} from "appwrite";
import {useGetRecentPosts, useGetUsers} from "../../lib/reactQuery/queriesAndMutations.ts";
import PostCard from "../../components/shared/PostCard.tsx";
import UserCard from "../../components/shared/UserCard.tsx";
import {useUserContext} from "../../context/authContext/AuthContext.tsx";


const Home = () => {

    const {
        data: posts,
        isLoading: isPostLoading,
        isError: isErrorPosts,
    } = useGetRecentPosts();
    const {
        data: creators,
        isLoading: isUserLoading,
        isError: isErrorCreators,
    } = useGetUsers(10);
    const {user: currentUser} = useUserContext();
    const fixArrayCreators = creators?.documents.filter((arg) => arg.$id !== currentUser.id)



    if (isErrorPosts || isErrorCreators) {
        return (
            <div className="flex flex-1">
                <div className="home-container">
                    <p className="body-medium text-light-1">Something bad happened</p>
                </div>
                <div className="home-creators">
                    <p className="body-medium text-light-1">Something bad happened</p>
                </div>
            </div>
        );
    }



    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    {isPostLoading && !posts ? (
                        <Loader/>
                    ) : (
                        <ul className="flex flex-col flex-1 gap-9 w-full ">
                            {posts?.documents.map((post: Models.Document) => (
                                <li key={post.$id} className="flex justify-center w-full">
                                    <PostCard post={post}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="home-creators">
                <h3 className="h3-bold text-light-1">Top Creators</h3>
                {isUserLoading && !fixArrayCreators ? (
                    <Loader/>
                ) : (
                    <ul className="grid 2xl:grid-cols-2 gap-6">
                        {fixArrayCreators?.map((creator) => (
                            <li key={creator?.$id}>
                                <UserCard user={creator} currentUser={currentUser.id}/>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Home;