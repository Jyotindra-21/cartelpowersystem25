'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema';

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/forgot-password', data);
      
      toast({
        title: 'Success!',
        description: response.data.message,
      });
      
      setIsEmailSent(true);
    } catch (error) {
      console.error('Error in forgot password:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || 'There was a problem sending the reset email. Please try again.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker overflow-hidden">
      <Link href="/sign-in" className='absolute left-5 top-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-2 flex items-center gap-2'>
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl z-10"
      >
        <div className="text-center">
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Reset Your Password
          </motion.h2>
          <p className="text-gray-300">
            {isEmailSent 
              ? 'Check your email for a password reset link' 
              : 'Enter your email to receive a password reset link'
            }
          </p>
        </div>

        {!isEmailSent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10"
                        placeholder="you@example.com"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full group relative overflow-hidden"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isSubmitting ? 0 : 0.2 }}
                    />
                    <span className="relative">Send Reset Link</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-300">
              We've sent a password reset link to your email. Please check your inbox and follow the instructions.
            </p>
            <Button
              variant="outline"
              className="w-full bg-gray-700 border-gray-700 text-white hover:bg-primary hover:text-white"
              onClick={() => setIsEmailSent(false)}
            >
              Try Another Email
            </Button>
          </div>
        )}

         <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">
              Remember your password?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-gray-700 border-gray-700 text-white hover:bg-primary hover:text-white"
          asChild
        >
          <Link href="/sign-in">
            Sign in
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}