import animationData from "../animations/typing.json"

export const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};



export const INITIAL_STATE_MESSAGE_USER_CHAT = {
    _id: "",
    name: "",
    idAppwrite: "",
    email: "",
    isAdmin: false,
    pic: "",
    token: "",
}
export const INITIAL_STATE_MESSAGE_USER = {
    _id: "",
    name: "",
    idAppwrite: "",
    email: "",
    isAdmin: false,
    pic: "",
}
export const INITIAL_STATE_SENDER = {
    _id: "",
    name: "",
    email: "",
    pic: "",
}
export const INITIAL_STATE_LATEST_MESSAGE = {
    _id: "",
    sender: INITIAL_STATE_SENDER,
    content: "",
    chat: "",
    createdAt: "",
    updatedAt: "",
}
export const INITIAL_STATE_MESSAGE_CHATS = {
    _id: "",
    chatName: "",
    isGroupChat: false,
    groupAdmin: {
        _id: ""
    },
    users: [],
    createdAt: "",
    updatedAt: "",
    latestMessage: INITIAL_STATE_LATEST_MESSAGE,
}

export const INITIAL_STATE_CHATS = {
    _id: "",
    chatName: "",
    isGroupChat: false,
    groupAdmin: {
        _id: ""
    },
    users: [],
    createdAt: "",
    updatedAt: "",
    latestMessage: INITIAL_STATE_LATEST_MESSAGE
}

export const INITIAL_STATE_NOTIFICATION = {
    sender: INITIAL_STATE_SENDER,
    content: "",
    chat: INITIAL_STATE_CHATS,
    _id: "",
    createdAt: "",
    updatedAt: ""
}



export const INITIAL_STATE_MESSAGE = {
    chats:  [],
    user: INITIAL_STATE_MESSAGE_USER_CHAT,
    selectedChat: INITIAL_STATE_CHATS,
    notification: [],
    setUser: () => {},
    setChats: () => {},
    setNotification: () => {},
    setSelectedChat: () => {}
}