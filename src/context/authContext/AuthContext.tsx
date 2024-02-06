import {FC, useContext, createContext, useEffect, useState, ReactNode} from "react";
import {IUser} from "../../types";
import {useNavigate} from "react-router-dom";
import {getCurrentUser} from "../../lib/appwrite/api.ts";

interface IAuthContext {
    children: ReactNode
}
export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
    idMd: "",
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
};

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);


const AuthProvider: FC<IAuthContext> = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const currentAccount = await getCurrentUser();
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                });
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");

        if (
            cookieFallback === "[]" || cookieFallback === null
            // cookieFallback === undefined
        ) {
            navigate("/sign-in");
        }

        checkAuthUser();
    }, []);



    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext);