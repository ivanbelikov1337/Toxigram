import {FC} from "react";
import {Navigate, Outlet} from "react-router-dom"
interface IAuthLayout {

}

const AuthLayout: FC<IAuthLayout> = () => {
    const isAuth = false

    return (
        <>
            {isAuth ? (
                <Navigate to="/"/>
            ) : (
                <>
                    <section className="flex flex-1 justify-center items-center flex-col py-10">
                        <Outlet/>
                    </section>

                    <img
                        src="/assets/images/side.jpg"
                        alt="logo"
                        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
                    />
                </>
            )}
        </>
    )
}

export default AuthLayout;