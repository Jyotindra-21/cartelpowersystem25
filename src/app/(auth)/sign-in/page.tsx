'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { fetchWebsiteInfo } from '@/services/settings.services';
import { getActiveSvgLogo } from '@/services/svglogo.services';
import { IWebsiteInfo } from '@/schemas/settingsSchema';
import { ISvgLogo } from '@/schemas/logoSchema';
import Image from 'next/image';
import LogoReveal from '@/components/custom/LogoReveal';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
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

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        setShake(true);
        setTimeout(() => setShake(false), 500);

        toast({
          title: 'Access Denied',
          description: result.error === 'CredentialsSignin'
            ? 'Incorrect credentials. Please try again.'
            : result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result?.url) {
        toast({
          title: 'Welcome Back!',
          description: 'You have successfully signed in.',
        });

        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } finally {
      setIsLoading(false);
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
          <div className="flex justify-center mb-2">
            <LogoSection svgLogo={svgLogo || null} websiteInfo={websiteInfo || null} />
          </div>
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h2>
          <p className="text-black-400">Sign in to access your personalized dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email or Username</FormLabel>
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
            </motion.div>

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

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full group relative overflow-hidden"
              type="submit"
              disabled={isLoading}
            >
              <AnimatePresence>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isLoading ? 0 : 0.2 }}
                    />
                    <span className="relative flex items-center justify-center">
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Sign In
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
            <span className="px-2 bg-gray-800 text-gray-400">
              New to our platform?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-gray-700 border-gray-700 text-white hover:bg-primary hover:text-white"
          asChild
        >
          <Link href="/sign-up">
            Create an account
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