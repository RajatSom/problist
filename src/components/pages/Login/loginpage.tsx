"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from "axios";
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});
export function Login() {
    const router = useRouter();
    const [isloading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Login_pressed")
        setIsLoading(true);
        setError(false); // Reset error state

        const data = new FormData();
        data.append("userID", values.username);
        data.append("key", values.password);

        try {
            const response = await axios.post(`api/auth/login`, data, {
                withCredentials: true,
            });
            console.log(response)
            if (response.data.valid) {
                router.push("/dashboard");
            } else {
                setError(true);
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    }


    const logofrm = (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormDescription>
                            Your username
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="password" {...field} />
                        </FormControl>
                        <FormDescription>
                            Your password that HARSH boss provided
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit">Submit</Button>
        </form>
    </Form>)
    return (
        <div className="w-full h-[100vh] flex justify-center items-center flex-col">
            <div className="mb-3 text-xl font-semibold">Welcome champion</div>
            <div className="w-96  rounded-lg shadow-lg shadow-gray-700 p-10">{logofrm}</div>
        </div>
    )
}
