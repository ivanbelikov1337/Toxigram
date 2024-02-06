import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../../components/ui/form"
import {useToast} from "../../components/ui/use-toast.ts"
import {Input} from "../../components/ui/input.tsx"
import {Button} from "../../components/ui/button.tsx"
import {useForm} from "react-hook-form";
import {signUpValidation} from "../../lib/validation";
import {z} from "zod";
import Loader from "../../components/shared/Loader.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useCreateUserAccount, useSignInAccount} from "../../lib/reactQuery/queriesAndMutations.ts";
import {useUserContext} from "../../context/authContext/AuthContext.tsx";
import axios from "axios";



interface INewUser {
    imageUrl: string
}

const SignUpForm =  () => {
    const {toast} = useToast()
    const {checkAuthUser} = useUserContext()
    const navigate = useNavigate()



    // 1. Define your form.
    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
    })

    // Queries
    const {mutateAsync: createUserAccount, isPending: isCreatingAccount} = useCreateUserAccount();
    const {mutateAsync: signInAccount} = useSignInAccount();

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signUpValidation>) {
        const {email, password,name} = values

        const newUser = await createUserAccount(values) as INewUser
        if (!newUser) toast({title: "Sign up failed. Please try again.",});


        try {

            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const {data} = await axios.post(
                "https://messengers.onrender.com/api/user",
                {
                    name,
                    email,
                    password,
                    idAppwrite: " ",
                    pic: newUser.imageUrl,
                },
                config
            );

            localStorage.setItem("userInfo", JSON.stringify(data));


            const session = await signInAccount({
                email: email,
                password: password,
            });

            if (!session) return toast({title: "Something went wrong. Please login your new account",});


            const isLoggedId = await checkAuthUser()

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
                <h2 className="h3-bold mb:h2-bold pt-5 sm:pt-5">Creat a new account</h2>
                <p className="text-light-3  mt-2 text-[0.7rem]">
                    To use SI GRAM, Please enter your details
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-3 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
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
                        {isCreatingAccount ? (
                            <div className="flex-center gap-2">
                                <Loader/> Loading...
                            </div>
                        ) : "Sing up"}
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link
                            to="/sign-in"
                            className="text-primary-500 text-small-semibold ml-1">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignUpForm;