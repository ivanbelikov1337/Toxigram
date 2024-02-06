import {FC} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form.tsx";
import {Input} from "../ui/input.tsx";
import {Button} from "../ui/button.tsx";
import { Models } from "appwrite";
import {useNavigate} from "react-router-dom";
import {useToast} from "../ui/use-toast.ts";
import {useUserContext} from "../../context/authContext/AuthContext.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {PostValidation} from "../../lib/validation";
import {useCreatePost, useUpdatePost} from "../../lib/reactQuery/queriesAndMutations.ts";
import Loader from "../shared/Loader.tsx";
import {Textarea} from "../ui/textarea.tsx";
import FileUpLoader from "../shared/FileUpLoader.tsx";


interface IPostForm {
    post?: Models.Document;
    action: "Create" | "Update";
}




const PostForm: FC<IPostForm> = ({ post, action }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useUserContext();
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post.location : "",
            tags: post ? post.tags.join(",") : "",
        },
    });
    // Query
    const { mutateAsync: createPost, isPending: isLoadingCreate } =
        useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
        useUpdatePost();

    // Handler
    const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
        // ACTION = UPDATE
        if (post && action === "Update") {
            const updatedPost = await updatePost({
                ...value,
                postId: post.$id,
                imageId: post.imageId,
                imageUrl: post.imageUrl,
            });

            if (!updatedPost) {
                toast({
                    title: `${action} post failed. Please try again.`,
                });
            }
            return navigate(`/posts/${post.$id}`);
        }

        // ACTION = CREATE
        const newPost = await createPost({
            ...value,
            userId: user.id,
        });

        if (!newPost) {
            toast({
                title: `${action} post failed. Please try again.`,
            });
        }
        navigate("/");
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-9 w-full  max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="shad-textarea custom-scrollbar"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Photos</FormLabel>
                            <FormControl>
                                <FileUpLoader
                                    fieldChange={field.onChange}
                                    mediaUrl={post?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Location</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">
                                Add Tags (separated by comma " , ")
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Art, Expression, Learn"
                                    type="text"
                                    className="shad-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 items-center justify-end">
                    <Button
                        type="button"
                        className="shad-button_dark_4"
                        onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingCreate || isLoadingUpdate}>
                        {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                        {action} Post
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm;