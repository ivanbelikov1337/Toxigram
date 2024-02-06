import {FC} from "react";
import { Tooltip} from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {INotification} from "../../types";
import {isLastMessage, isSameSender, isSameSenderMargin, isSameUser} from "../../utility/config.ts";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";

interface IScrollableChat {
    messages: INotification[]
}

const ScrollableChat: FC<IScrollableChat> = ({messages}) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((message:INotification, index:number) =>   (
                        <div className="flex gap-2" key={index}>
                            {(isSameSender(messages, message, index, user._id) ||
                                isLastMessage(messages, index, user._id)) && (
                                <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                                    <img

                                        className="w-[2rem] h-[2rem] rounded-full cursor-pointer"
                                        alt={message.sender.name}
                                        src={message.sender.pic}
                                    />
                                </Tooltip>
                            )}
                            <span
                                style={{
                                    backgroundColor: `${
                                        message.sender._id === user._id ? "#00b4ff" : "#a4a4a4"
                                    }`,
                                    marginLeft: isSameSenderMargin(messages, message, index, user._id),
                                    marginTop: isSameUser(messages, message, index) ? 3 : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                }}>
                            {message.content}
                         </span>
                        </div>)
                )}
        </ScrollableFeed>
    )
}

export default ScrollableChat;