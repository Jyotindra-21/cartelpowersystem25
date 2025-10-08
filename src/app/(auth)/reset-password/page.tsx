'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { resetPasswordSchema } from '@/schemas/forgotPasswordSchema';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token || '',
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsCheckingToken(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(`/api/validate-reset-token?token=${token}`);
        if (response.data.success) {
          setIsValidToken(true);
          form.setValue('token', token);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsValidToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    validateToken();
  }, [token, form]);

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/reset-password', data);
      
      toast({
        title: 'Success!',
        description: response.data.message,
      });

      // Redirect to sign-in after successful reset
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || 'There was a problem resetting your password. Please try again.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker">
        <div className="text-center text-white max-w-md p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Invalid Reset Link</h2>
          <p className="mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="text-primary-400 hover:text-primary-300 underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

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
            Create New Password
          </motion.h2>
          <p className="text-gray-300">Enter your new password below</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">New Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Confirm New Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
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
                  <span className="relative">Reset Password</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}