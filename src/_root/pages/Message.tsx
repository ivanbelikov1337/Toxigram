import {FC} from "react";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";
import SideDrawer from "../../components/chat/SideDrawer.tsx";
import MyChats from "../../components/chat/MyChats.tsx";


interface IMessage {
    fetchAgain: boolean
}

const Message:FC<IMessage> = ({fetchAgain}) => {
    const {user} = ChatState();

    return (
        <section className="w-full">
            {user && <SideDrawer />}
            <div className="flex justify-between w-full ">
                {user && <MyChats fetchAgain={fetchAgain} />}
            </div>
        </section>
    )
}

export default Message;