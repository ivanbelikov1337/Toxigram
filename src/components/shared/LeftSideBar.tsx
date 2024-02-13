import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import {Button} from "../ui/button.tsx";
import {INITIAL_USER, useUserContext} from "../../context/authContext/AuthContext.tsx";
import {useSignOutAccount} from "../../lib/reactQuery/queriesAndMutations.ts";
import Loader from "./Loader.tsx";
import {INavLink} from "../../types";
import {sidebarLinks} from "../../constants";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";


const LeftSideBar = () => {

    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {user, setUser, setIsAuthenticated, isLoading} = useUserContext();
    const { notification} = ChatState()
    const {mutate: signOut} = useSignOutAccount();

    const handleSignOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        signOut();
        setIsAuthenticated(false)
        setUser(INITIAL_USER)
        navigate("/sign-in")
    };
    const obj:any = {}
    const deleteDuplicateObject = notification.filter((item)=> {
        return (!obj[item.chat._id] && (obj[item.chat._id] = 1));
    })

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link to="/" className="flex gap-3 items-center ml-[-1rem]">
                    <img
                        src="/assets/images/logo.png"
                        alt="logo"
                        width={170}
                        height={36}
                    />
                </Link>

                {isLoading || !user.email ? (
                    <div className="h-14">
                        <Loader/>
                    </div>
                ) : (
                    <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                        <img
                            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                            alt="profile"
                            className="h-14 w-14 rounded-full"
                        />
                        <div className="flex flex-col">
                            <p className="body-bold">{user.name}</p>
                            <p className="small-regular text-light-3">@{user.username}</p>
                        </div>
                    </Link>
                )}

                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route;
                        return (
                            <li key={link.label}
                                className={`leftsidebar-link group ${
                                    isActive && "bg-primary-500"
                                }`}>
                                <NavLink
                                    to={link.route}
                                    className="flex gap-4 items-center p-3">
                                    <img
                                        src={link.imgURL}
                                        alt={link.label}
                                        className={`group-hover:invert-white ${
                                            isActive && "invert-white"
                                        }`}
                                    />
                                    {link.label}
                                    {link.label === "Message" && deleteDuplicateObject.length > 0 && (
                                        <span className="w-[1.5rem] h-[1.5rem] ml-[15%] bg-primary-600 rounded-full text-center text-[1.2rem]">
                                                {deleteDuplicateObject.length}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <Button
                variant="ghost"
                className="shad-button_ghost p-3"
                onClick={(e) => handleSignOut(e)}>
                <img src="/assets/icons/logout.svg" alt="logout"/>
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    )
}

export default LeftSideBar;
