"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Pencil, Check, X, ImageIcon, User2, VenusAndMars, Mail, Phone, AtSign, ShieldUser } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { IUserFormValue, userFormSchema } from "@/schemas/userSchema";
import ImageUploadCommon from "@/components/custom/ImageUploadCommon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchUser, updateUserProfile } from "@/services/user.services";
import { signOut, useSession } from "next-auth/react";
import { User } from "../_components/types";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();
    const { data: session } = useSession();
    const user: User = session?.user;
    const router = useRouter();
    const queryClient = useQueryClient();

    // Fetch user data with React Query
    const { data: userData, isLoading: isFetching } = useQuery({
        queryKey: ['user', user?._id],
        queryFn: () => fetchUser({ id: user?._id }),
        enabled: !!user?._id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Update user mutation
    const { mutate: updateUser, isPending: isUpdating } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            setIsEditing(false);

            if (variables.email !== userData?.data?.email) {
                toast({
                    title: "Verify your email",
                    description: "We've sent a verification link to your new email address",
                });
                signOut({ redirect: false }).then(() => {
                    router.replace(`/verify/${response.data?.username}`);
                });
            }
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            });
        }
    });

    const form = useForm<IUserFormValue>({
        resolver: zodResolver(userFormSchema),
        defaultValues: userData?.data || {
            username: "",
            name: "",
            email: "",
            position: "",
            phone: "",
            gender: "other",
            banner: "",
            image: ""
        }
    });

    // Reset form when data is loaded
    useEffect(() => {
        if (userData?.data) {
            form.reset(userData.data);
        }
    }, [userData, form]);

    const onSubmit = (data: IUserFormValue) => {
        updateUser(data);
    };

    // Loading skeleton
    if (isFetching) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
                {/* Banner Skeleton */}
                <Skeleton className="h-48 w-full rounded-t-lg" />

                <div className="px-8 pb-8">
                    {/* Avatar Skeleton */}
                    <div className="flex flex-col items-center -mt-20">
                        <Skeleton className="h-36 w-36 rounded-full border-4 border-white dark:border-gray-800" />
                    </div>

                    {/* Profile content skeleton */}
                    <div className="mt-16 space-y-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-9 w-24" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
            {/* Banner Section */}
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
                                    <ImageUploadCommon
                                        value={field.value}
                                        onChange={(url) => {
                                            field.onChange(url);
                                            form.setValue("banner", url);
                                        }}
                                        uploadService="minio"
                                        folder="users/banners"
                                        name="banner"
                                    />
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
                <div className={`flex flex-col items-center ${isEditing ? "mt-4" : "-mt-20"}`}>
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
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-100 transition-opacity cursor-pointer">
                                            <div className="bg-white/80 p-2 rounded-full">
                                                <ImageIcon className="h-5 w-5 text-gray-800" />
                                            </div>
                                            <div className="absolute inset-0 h-36 w-36 rounded-full z-20 cursor-pointer">
                                                <ImageUploadCommon
                                                    value={field.value}
                                                    onChange={(url) => form.setValue("image", url)}
                                                    uploadService="minio"
                                                    folder="users/profiles"
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
                <div className="mt-16 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                        {isEditing ? (
                            <div className="flex gap-3">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isUpdating}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={isUpdating}
                                    className="gap-2"
                                >
                                    {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        )}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
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
                                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
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

                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <ShieldUser className="h-4 w-4 text-blue-500" />
                                                Position
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!isEditing && user?.role !== "admin"}
                                                    className={!isEditing ? "border-none bg-transparent p-0 text-gray-900 dark:text-white font-medium" : ""}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}