"use client"
import { Card } from '@/components/ui/card'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bolt, Mail, Phone, MapPin, Send, Check, ChevronRight } from 'lucide-react';
import { motion } from "framer-motion"
import Link from 'next/link';
import { useToast } from '@/components/hooks/use-toast';

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First Name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number should be at least 10 digits.",
  }).max(10, {
    message: "Phone number should not exceed 10 digits.",
  }),
  message: z.string().min(1, {
    message: "Message is required.",
  }).max(500, {
    message: "Message should not exceed 500 characters.",
  }),
});

const Contact = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    }
  })

  const { toast } = useToast()

  const { isSubmitting, isValid } = form.formState;

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast({ description: "Message Sent Successfully!", action: "success" })
      router.refresh()
      form.reset()
    } catch (error) {
      toast({ description: "Something Went wrong!", action: "Error", variant: "destructive" })

    }
  }

  return (
    <section className="relative  bg-gradient-to-b from-blue-50 to-white">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div> */}
      {/* Modern Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24"
      >

        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:50px_52px] [mask-image:radial-gradient(ellipse_41%_45%_at_39%_56%,#000_35%,transparent_100%)]">
        </div>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div
              variants={slideUp}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <span className="flex items-center text-sm font-medium">
                <Bolt className="h-4 w-4 mr-2" /> Get in Touch
              </span>
            </motion.div>

            <motion.h1
              variants={slideUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >Contact <span className="text-yellow-300">Our Team</span>
            </motion.h1>

            <motion.p
              variants={slideUp}
              className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl"
            >
              Have questions about our ARD solutions? Reach out to our experts today.
            </motion.p>

            <motion.div
              variants={slideUp}
              className="flex flex-wrap gap-4"
            >
              <Link href="/product" className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold rounded-lg transition-all flex items-center z-10">
                Explore Products <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>

      </motion.section>
      <div className="container py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 shadow-xl border-0 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-5 -z-10"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Send className="h-6 w-6 text-blue-600 mr-3" />
              Send Us a Message
            </h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
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

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-1">Email</h4>
                    <p className="text-lg text-gray-800">info@cartelpower.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-1">Phone</h4>
                    <p className="text-lg text-gray-800">+91 8780074795</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-1">Address</h4>
                    <p className="text-lg text-gray-800">123 Industrial Area, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Contact Us */}
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Why Contact Cartel?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">24/7 technical support for ARD systems</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Expert consultation on lift safety solutions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Quick response within 1 business day</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Contact