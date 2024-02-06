import {FC} from "react";
import {useGetUserById} from "../../lib/reactQuery/queriesAndMutations.ts";
import Loader from "../../components/shared/Loader.tsx";
import ShowUserFollow from "../../components/shared/showUserFollow.tsx";

interface IFollowers {
    id: string
}

const Followers: FC<IFollowers> = ({id}) => {

    const {data: currentUser} = useGetUserById(id);

    if (!currentUser)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );


    return (
        <>
            {currentUser.followers.length === 0 && (
                <p className="text-light-4">You have no one to followers</p>
            )}


            <ul className="user-grid">
                {currentUser.followers.map((id:string) => {
                    return  (
                        <li key={id} className="flex-1 min-w-[200px] w-full  ">
                            <ShowUserFollow id={id} currentUser={currentUser}/>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default Followers;