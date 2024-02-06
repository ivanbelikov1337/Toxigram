import {Link, useNavigate} from "react-router-dom";
import {INITIAL_USER, useUserContext} from "../../context/authContext/AuthContext.tsx";
import {useEffect} from "react";
import {Button} from "../ui/button.tsx";
import {useSignOutAccount} from "../../lib/reactQuery/queriesAndMutations.ts";
import Cookies from "universal-cookie";

const cookies = new Cookies

const TopBar = () => {

    const navigate = useNavigate();
    const { user,setIsAuthenticated,setUser } = useUserContext();
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const handleClickSignOut = () => {
        signOut();
        cookies.remove("token");
        cookies.remove('userId');
        cookies.remove('email');
        cookies.remove('userName');

        setIsAuthenticated(false)
        setUser(INITIAL_USER)
        navigate("/sign-in")

        window.location.reload();
    }
    
    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess]);
    return (
        <section className="topbar">
            <div className="flex-between py-0.5 px-5">
                <Link to="/" className="flex gap-3 items-center">
                    <img
                        src="/assets/images/logo.png"
                        alt="logo"
                        width={130}
                        height={325}
                    />
                </Link>

                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        className="shad-button_ghost"
                        onClick={handleClickSignOut}>
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                        <img
                            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default TopBar;
