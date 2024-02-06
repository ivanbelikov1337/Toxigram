import {bottombarLinks} from "../../constants";
import {Link, useLocation} from "react-router-dom";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";

const BottomBar = () => {
    const {pathname} = useLocation();
    const {notification} = ChatState()
    return (
        <section className="bottom-bar">
            {bottombarLinks.map((link) => {
                const isActive = pathname === link.route;
                return (
                    <Link
                        key={`bottombar-${link.label}`}
                        to={link.route}
                        className={`${
                            isActive && "rounded-[10px] bg-primary-500 "
                        } flex-center flex-col gap-1 p-2 relative transition`}>
                        <img
                            src={link.imgURL}
                            alt={link.label}
                            width={16}
                            height={16}
                            className={`${isActive && "invert-white"}`}
                        />

                        <p className="tiny-medium text-light-2">{link.label}</p>
                        {link.label === "Message" && notification.length > 0 && (
                            <span className="w-[1rem] h-[1rem]  bg-primary-600 absolute right-0 top-0 rounded-full text-center text-[0.7rem]">
                                                {notification.length}
                            </span>
                        )}
                    </Link>
                );
            })}
        </section>
    )
}

export default BottomBar;
