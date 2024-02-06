import  {FC} from "react";
import LeftSideBar from "../components/shared/LeftSideBar.tsx";
import {Outlet} from "react-router-dom";
import TopBar from "../components/shared/TopBar.tsx";
import BottomBar from "../components/shared/BottomBar.tsx";

interface IRootLayout {

}

const RootLayout: FC<IRootLayout> = () => {
    return (
        <section className="w-full md:flex">
            <TopBar/>
            <LeftSideBar/>

            <section className="flex flex-1 h-full">
                <Outlet/>
            </section>

            <BottomBar/>
        </section>
    )
}

export default RootLayout;