'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useDebounce } from '@/hooks/use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/hooks/use-toast';
import { fetchWebsiteInfo } from '@/services/settings.services';
import { getActiveSvgLogo } from '@/services/svglogo.services';
import { IWebsiteInfo } from '@/schemas/settingsSchema';
import { ISvgLogo } from '@/schemas/logoSchema';
import LogoReveal from '@/components/custom/LogoReveal';
import Image from 'next/image';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [websiteInfo, setwebsiteInfo] = useState<IWebsiteInfo | null>(null);
  const [svgLogo, setsvgLogo] = useState<ISvgLogo | null>(null);

  const fetchLogo = async () => {
    const [websiteInfo, svgLogo] = await Promise.all([
      fetchWebsiteInfo(),
      getActiveSvgLogo()
    ]);
    setsvgLogo(svgLogo)
    setwebsiteInfo(websiteInfo.data || null)
  }

  useEffect(() => {
    fetchLogo()
  }, [])

  const debouncedUsername = useDebounce(username, 300);



  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success!',
        description: response.data.message,
      });

      // Pass email as query parameter to verification page
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.';

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker overflow-hidden">

      <Link href="/" className='absolute left-5 top-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-2'>
        Back Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl z-10"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <LogoSection svgLogo={svgLogo || null} websiteInfo={websiteInfo || null} />
          </div>
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join Our Community
          </motion.h2>
          <p className="text-gray-800">Create your account to start the journey</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-10"
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                      placeholder="cooluser123"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {isCheckingUsername ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      ) : usernameMessage ? (
                        usernameMessage === 'Username is unique' ? (
                          <Check className="h-5 w-5 text-green-800" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      ) : null}
                    </div>
                  </div>
                  {usernameMessage && (
                    <p
                      className={`text-sm ${usernameMessage === 'Username is unique'
                        ? 'text-green-700'
                        : 'text-red-700'
                        }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

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
                  <p className="text-black text-sm mt-1">We&apos;ll send you a verification code</p>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
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

            <Button
              className="w-full group relative overflow-hidden"
              type="submit"
              disabled={isSubmitting || isCheckingUsername}
            >
              <AnimatePresence>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isSubmitting ? 0 : 0.2 }}
                    />
                    <span className="relative flex items-center justify-center">
                      Create Account
                    </span>
                  </>
                )}
              </AnimatePresence>
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">
              Already have an account?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-gray-700 border-gray-700 text-white hover:bg-primary hover:text-white"
          asChild
        >
          <Link href="/sign-in">
            Sign In
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

interface ILogoSectionProps {
  websiteInfo?: IWebsiteInfo | null;
  svgLogo?: ISvgLogo | null;
}

const LogoSection = ({ websiteInfo, svgLogo }: ILogoSectionProps) => (
  <motion.div
    className="drop-shadow-[1px_1px_2px_white] rounded-tl-2xl rounded-bl-2xl"
    initial={{ filter: '0 0' }}
    animate={{ filter: '0 100%' }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }}
  >
    {websiteInfo?.isSvg ? (
      <LogoReveal
        size={svgLogo?.svg?.size || 150}
        initialData={{
          viewBox: svgLogo?.svg.viewBox || "",
          paths: JSON.parse(svgLogo?.svg.paths || "[]"),
          animation: svgLogo?.svg.animation
        }}
      />
    ) : (
      <>
        {websiteInfo?.logo ? (
          <Image
            unoptimized
            src={websiteInfo.logo}
            alt="logo-image"
            width={150}
            height={200}
          />
        ) : (
          <h6 className='uppercase text-3xl'>
            {websiteInfo?.metaTitle?.split(' ')?.[0] || ""}
          </h6>
        )}
      </>
    )}
  </motion.div>
);