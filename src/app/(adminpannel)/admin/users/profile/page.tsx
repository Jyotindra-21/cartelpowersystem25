"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Pencil, Check, X, ImageIcon, User2, VenusAndMars, Mail, LoaderCircle, Phone, AtSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { IUserFormValue, userFormSchema } from "@/schemas/userSchema";
import ImageUpload from "@/components/custom/ImageUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchUser, updateUserProfile } from "@/services/user.services";
import { signOut, useSession } from "next-auth/react";
import { User } from "../_components/types";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [initialValue, setInitialValue] = useState<User | undefined>(undefined);
    const { toast } = useToast();
    const { data: session } = useSession();
    const user: User = session?.user;

    const router = useRouter()
    const fetchCurrentUser = async () => {
        setIsFormLoading(true)
        try {
            const res = await fetchUser({ id: user._id });
            if (!res.success) throw new Error(res.error);
            setInitialValue(res.data)
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to fetch profile data ${error}`,
                variant: "destructive"
            });
        } finally {
            setIsFormLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchCurrentUser()
    }, [user]);

    const form = useForm<IUserFormValue>({
        resolver: zodResolver(userFormSchema),
        defaultValues: initialValue || {
            username: "",
            name: "",
            email: "",
            phone: "",
            gender: "other",
            banner: "",
            image: ""
        }
    });

    useEffect(() => {
        if (initialValue) form.reset(initialValue);
    }, [initialValue, form.reset]);

    const onSubmit = async (data: IUserFormValue) => {
        setIsLoading(true);
        try {
            const response = await updateUserProfile(data)
            if (!response.success) throw new Error("Update failed");

            if (data.email !== initialValue?.email) {
                toast({
                    title: "Verify your email",
                    description: "We've sent a verification link to your new email address",
                });
                await signOut({ redirect: false }); // Sign out without immediate redirect
                setTimeout(() => {
                    router.replace(`/verify/${response.data?.username}`)
                }, 2000);
            }
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            setIsEditing(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isFormLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <LoaderCircle className="animate-spin h-8 w-8" />
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
                {/* Banner Section - Fixed */}
                <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
                    {isEditing ? (
                        <FormField
                            control={form.control}
                            name="banner"
                            render={({ field }) => (
                                <div className="absolute inset-0 w-full h-full">
                                    {field.value ? (
                                        <img
                                            src={field.value}
                                            alt="Banner"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                            <ImageIcon className="h-12 w-12 text-white/80" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 cursor-pointer w-full h-full z-10">
                                        <ImageUpload
                                            value={field.value}
                                            onChange={(url) => {
                                                field.onChange(url);
                                                form.setValue("banner", url);
                                            }}
                                            name="banner"

                                        />
                                    </  div>
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity opacity-0 hover:opacity-100">
                                        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                                            <ImageIcon className="h-6 w-6 text-gray-800" />
                                            <span className="sr-only">Upload banner</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    ) : (
                        form.watch("banner") ? (
                            <img
                                src={form.watch("banner")}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-white/80" />
                            </div>
                        )
                    )}
                </div>

                <div className="px-8 pb-8">
                    {/* Profile header with avatar */}
                    <div className="flex flex-col items-center -mt-20">
                        <div className="relative group">
                            {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <>
                                            <Avatar className="h-36 w-36 border-4 border-white shadow-lg dark:border-gray-800">
                                                <AvatarImage src={field.value} className="object-cover" />
                                                <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-4xl font-medium">
                                                    {form.watch("name")?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <div className="bg-white/80 p-2 rounded-full">
                                                    <ImageIcon className="h-5 w-5 text-gray-800" />
                                                </div>
                                                <div className="absolute inset-0 h-36 w-36 rounded-full z-20 cursor-pointer">
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={(url) => form.setValue("image", url)}
                                                        name="image"

                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                />
                            ) : (
                                <Avatar className="h-36 w-36 border-4 border-white shadow-lg dark:border-gray-800">
                                    <AvatarImage src={form.watch("image")} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-4xl font-medium">
                                        {form.watch("name")?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </div>

                    {/* Profile content */}
                    <div className="mt-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(false)}
                                        disabled={isLoading}
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={form.handleSubmit(onSubmit)}
                                        disabled={isLoading}
                                        className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Form fields remain the same as before */}
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <AtSign className="h-4 w-4 text-blue-500" />
                                                    Username
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEditing}
                                                        className={!isEditing ? "border-none bg-transparent p-0 text-gray-900 dark:text-white font-medium" : ""}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                                    <User2 className="h-4 w-4 text-blue-500" />
                                                    Full Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEditing}
                                                        className={!isEditing ? "border-none bg-transparent p-0 text-gray-900 dark:text-white font-medium" : ""}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Mail className="h-4 w-4 text-blue-500" />
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEditing}
                                                        className={!isEditing ? "border-none bg-transparent p-0 text-gray-900 dark:text-white font-medium" : ""}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                                    <Phone className="h-4 w-4 text-blue-500" />
                                                    Phone
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEditing}
                                                        className={!isEditing ? "border-none bg-transparent p-0 text-gray-900 dark:text-white font-medium" : ""}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => {
                                            // Function to get display text for gender value
                                            const getDisplayText = (value: string) => {
                                                switch (value) {
                                                    case 'male': return 'Male';
                                                    case 'female': return 'Female';
                                                    case 'other': return 'Other';
                                                    default: return 'Select gender';
                                                }
                                            };

                                            return (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <VenusAndMars className="h-4 w-4 text-indigo-500" />
                                                        Gender
                                                    </FormLabel>
                                                    {isEditing ? (
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                                                                    <SelectValue placeholder="Select gender" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="male">Male</SelectItem>
                                                                <SelectItem value="female">Female</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <div className="border-none bg-transparent px-0 h-auto text-md md:text-sm text-gray-500 dark:text-white font-normal">
                                                            {getDisplayText(field.value || "other")}
                                                        </div>
                                                    )}
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}