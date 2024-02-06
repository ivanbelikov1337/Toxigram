import {Route, Routes} from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm.tsx";
import SignUpForm from "./_auth/forms/SignUpForm.tsx";
import {
    AllUsers,
    CreatePost,
    EditPost,
    Explore,
    Home,
    PostDetails,
    SingleChat,
    Profile,
    Saved,
    UpdateProfile
} from "./_root/pages";
import "./index.css"
import AuthLayout from "./_auth/AuthLayout.tsx";
import RootLayout from "./_root/RootLayout.tsx";
import {Toaster} from "./components/ui/toaster.tsx"
import Message from "./_root/pages/Message.tsx";
import {useState} from "react";




const App = () => {
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <main className="flex h-screen">
            <Routes>
                {/*public*/}
                <Route element={<AuthLayout/>}>
                    <Route path="/sign-in" element={<SignInForm/>}/>
                    <Route path="/sign-up" element={<SignUpForm/>}/>
                </Route>

                {/*private*/}
                <Route element={<RootLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/saved" element={<Saved/>}/>
                    <Route path="/explore" element={<Explore/>}/>
                    <Route path="/all-users" element={<AllUsers/>}/>
                    <Route path="/posts/:id" element={<PostDetails/>}/>
                    <Route path="/profile/:id/*" element={<Profile/>}/>
                    <Route path="/create-post" element={<CreatePost/>}/>
                    <Route path="/update-post/:id" element={<EditPost/>}/>
                    <Route path="/update-profile/:id" element={<UpdateProfile/>}/>
                    <Route path="/message" element={<Message fetchAgain={fetchAgain}/>}/>
                    <Route path="/message/:id" element={<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}/>
                </Route>
            </Routes>

            <Toaster/>
        </main>
    )
}

export default App
