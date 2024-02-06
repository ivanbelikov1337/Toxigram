export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
};

export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
};

export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
};

export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
};

export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
    idMd?:string
};

export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
};

export interface IUserChat {
    _id: string
    name: string
    idAppwrite: string
    email: string
    isAdmin: boolean
    pic: string
    token: string
}

export interface IChats {
    _id: string
    chatName: string
    isGroupChat: boolean
    groupAdmin?: {
        _id: string
    }
    users: User[]
    createdAt: string
    updatedAt: string
    latestMessage: LatestMessage
}



export interface INotification {
    sender: Sender
    content: string
    chat: IChats
    _id: string
    createdAt: string
    updatedAt: string
}

export interface User {
    _id: string
    name: string
    idAppwrite: string
    email: string
    pic: string
    isAdmin: boolean
}

export interface LatestMessage {
    _id: string
    sender: Sender
    content: string
    chat: string
    createdAt: string
    updatedAt: string
}

export interface Sender {
    _id: string
    name: string
    email: string
    pic: string
}
