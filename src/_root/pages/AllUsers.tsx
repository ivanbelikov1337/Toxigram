import {useToast} from "../../components/ui/use-toast.ts";
import {useGetUsers} from "../../lib/reactQuery/queriesAndMutations.ts";
import Loader from "../../components/shared/Loader.tsx";
import UserCard from "../../components/shared/UserCard.tsx";
import {useUserContext} from "../../context/authContext/AuthContext.tsx";

const AllUsers = () => {
    const { toast } = useToast();

    const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
    const {user: currentUser} = useUserContext();
    const fixArrayCreators = creators?.documents.filter((arg) => arg.$id !== currentUser.id)!

    if (isErrorCreators) {
        toast({ title: "Something went wrong." });

        return;
    }


    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                {isLoading && !fixArrayCreators ? (
                    <Loader />
                ) : (
                    <ul className="user-grid">
                        {fixArrayCreators.map((creator) => (
                            <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                                <UserCard user={creator}  currentUser={currentUser.id}/>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AllUsers;