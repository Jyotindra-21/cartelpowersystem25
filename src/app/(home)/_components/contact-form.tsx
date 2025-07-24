"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactFormSchema, IContactForm, IContactFormCreateSchema } from "@/schemas/contactSchema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { saveContact } from "@/services/contact.services";
import { IApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";

export function ContactForm() {
    const form = useForm<IContactFormCreateSchema>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        }
    });
    const {
        formState: { isSubmitting, isValid }
    } = form;

    const onSubmit = async (values: IContactFormCreateSchema) => {
        try {
            // Replace with your actual submission logic
            const response: IApiResponse<IContactForm> = await saveContact(
                values
            );

            if (!response.success) throw new Error("Submission failed");
            
            toast({ title: "Success", description: "Thank you for contact us!" })
            form.reset();
        } catch (error) {
            console.error("Submission error:", error);
            toast({ title: "Failed", description: "Something Went Wrong!", variant: "destructive" })
        }
    };

    return (
        <Card className="p-8 shadow-xl border-0 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-5 -z-10"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Send className="h-6 w-6 text-blue-600 mr-3" />
                Send Us a Message
            </h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="focus:ring-2 focus:ring-blue-500 border-gray-300 h-12"
                                            disabled={isSubmitting}
                                            placeholder="John"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="focus:ring-2 focus:ring-blue-500 border-gray-300 h-12"
                                            disabled={isSubmitting}
                                            placeholder="Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        className="focus:ring-2 focus:ring-blue-500 border-gray-300 h-12"
                                        disabled={isSubmitting}
                                        placeholder="example@gmail.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Phone</FormLabel>
                                <FormControl>
                                    <Input
                                        className="focus:ring-2 focus:ring-blue-500 border-gray-300 h-12"
                                        disabled={isSubmitting}
                                        placeholder="8780074795"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="focus:ring-2 focus:ring-blue-500 border-gray-300 min-h-32"
                                        disabled={isSubmitting}
                                        placeholder="Your message..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={!isValid || isSubmitting}
                        className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-lg font-medium"
                        type="submit"
                    >
                        {isSubmitting ? "Sending..." : (
                            <>
                                <Send className="h-5 w-5 mr-2" />
                                Send Message
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </Card>
    );
}