import Loader from "../../components/shared/Loader.tsx";
import {useGetCurrentUser} from "../../lib/reactQuery/queriesAndMutations.ts";
import GridPostList from "../../components/shared/GridPostList.tsx";


const LikedPosts = () => {
    const { data: currentUser } = useGetCurrentUser();


    if (!currentUser)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );

    return (
        <>
            {currentUser.liked.length === 0 && (
                <p className="text-light-4">No liked posts</p>
            )}

            <GridPostList posts={currentUser.liked} showStats={false} />
        </>
    );
};

export default LikedPosts;