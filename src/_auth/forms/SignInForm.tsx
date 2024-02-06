import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../../components/ui/form"
import {useToast} from "../../components/ui/use-toast.ts"
import {Input} from "../../components/ui/input.tsx"
import {Button} from "../../components/ui/button.tsx"
import {useForm} from "react-hook-form";
import {signInValidation} from "../../lib/validation";
import {z} from "zod";
import Loader from "../../components/shared/Loader.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useSignInAccount} from "../../lib/reactQuery/queriesAndMutations.ts";
import {useUserContext} from "../../context/authContext/AuthContext.tsx";
import {ChatState} from "../../context/chatContext/ChatProvider.tsx";
import axios from "axios";


const SignInForm = () => {
    const {checkAuthUser, isLoading: isUserLoading} = useUserContext()
    const navigate = useNavigate()
    const {setUser} = ChatState()

    const {toast} = useToast()


    // 1. Define your form.
    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // Queries
    const {mutateAsync: signInAccount} = useSignInAccount();

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signInValidation>) {
        const {email, password} = values
        const session = await signInAccount({
            email: email,
            password: password,
        });

        if (!session) return toast({title: "Something went wrong. Please login your new account",})

        const isLoggedId = await checkAuthUser()

        //login messengers
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const {data} = await axios.post(
                "https://messengers.onrender.com/api/user/login",
                {email, password},
                config
            );

            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));

            if (isLoggedId) {
                form.reset()

                navigate("/")
            } else {
                return toast({title: "Sign up failed. Please try again.",})
            }

        } catch (error: unknown) {
            console.log(error)
        }
    }

    return (
        <Form {...form}>
            <div className="flex-col">
                <figure className="w-[140px] ml-[2.2rem]">
                    <img src="/assets/images/logo.png" className="text-white" alt="logo"/>
                </figure>
                <h2 className="h3-bold mb:h2-bold pt-5 sm:pt-5">Log in your account</h2>
                <p className="text-light-3  mt-2 text-[0.7rem]">
                    Welcome back!, Please enter your details
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-3 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isUserLoading ? (
                            <div className="flex-center gap-2">
                                <Loader/> Loading...
                            </div>
                        ) : "Sing in"}
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Dont have an account?
                        <Link
                            to="/sign-up"
                            className="text-primary-500 text-small-semibold ml-1">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignInForm;