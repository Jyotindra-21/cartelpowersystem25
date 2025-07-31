"use client"
import { Calendar } from "@/components/ui/calendar"
import { motion } from "framer-motion"
import {
  User,
  ArrowRight,
  Clock,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  LineChart,
  PieChart,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { fetchDashboard } from "@/services/dashboard.services"
import { useEffect, useState } from "react"
import { toast } from "@/components/hooks/use-toast"
import { DynamicIcon } from "@/components/custom/DynamicIcon"
import Link from "next/link"
import { WeekEvents } from "../events/_components/WeekEvents"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const [events, setEvents] = useState<any[]>([]);
  const COLORS = ['#00C49F', '#FFBB28', '#0088FE'];
  // Using useQuery to fetch dashboard data
  const { data: dashboardData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    refetchOnWindowFocus: true,
  })

  if (isError) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    })
  }


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEvents = localStorage.getItem('events');
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        const now = new Date();

        // Filter out expired events
        const activeEvents = parsedEvents.filter((event: any) => {
          return new Date(event.date) > now;
        });

        setEvents(activeEvents);
      }
    }
  }, []);



  // Simple Card Skeleton
  const CardSkeleton = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white/80 rounded-2xl p-6 border border-gray-200 ${className}`}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );

  return (
    <div className="min-h-screen p-4 bg-neutral-100 rounded-xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Welcome back! What&apos;s happening here.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Last Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              {dashboardData?.success && dashboardData?.data && dashboardData?.data.metrics.map((metric, index) => (
                <Link
                  key={index}
                  href={metric.href || '#'}
                  passHref
                >
                  <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${metric?.gradientColor} backdrop-blur-lg border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all overflow-hidden cursor-pointer`}>
                    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:50px_52px] [mask-image:radial-gradient(ellipse_60%_67%_at_50%_60%,#000_70%,transparent_100%)]">
                    </div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <p className="text-md font-medium text-gray-800">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                        <p className={`text-sm mt-1 ${metric.trend === 'up' ? 'text-emerald-600' : 'text-amber-700'}`}>
                          {metric.change}
                        </p>
                      </div>
                      <div className="rounded-lg backdrop-blur-sm text-indigo-600">
                        <DynamicIcon iconName={metric.icon} className={`h-8 w-8 ${metric?.textColor}`} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 mb-8 lg:grid-cols-2">
          {/* User Chart */}
          <Card className="rounded-2xl border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
            <CardHeader>
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </>
              ) : (
                <>
                  <CardTitle>User Overview</CardTitle>
                  <CardDescription>Monthly new user for the current year</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px]">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData?.data && dashboardData?.data.userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="user"
                        stroke="#8884d8"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Status Chart */}
          <Card className="rounded-2xl border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
            <CardHeader>
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </>
              ) : (
                <>
                  <CardTitle>Contact Status</CardTitle>
                  <CardDescription>Distribution of contact by status</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px]">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData?.data && dashboardData?.data.contactStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData?.success && dashboardData?.data && dashboardData?.data.contactStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Three Column Layout */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Calendar Widget */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 bg-white/80 backdrop-blur-lg border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-6">
              {isLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
              )}
              {isLoading ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {isLoading ? (
              <CardSkeleton className="h-[300px]" />
            ) : (
              <Calendar
                mode="single"
                className="rounded-lg border-none"
                classNames={{
                  day: "hover:bg-indigo-100/50 rounded-full",
                  day_selected: "bg-indigo-600 text-white",
                  day_today: "bg-gray-200/50",
                  head_cell: "text-gray-500 text-sm font-normal",
                  nav_button: "text-gray-500 hover:bg-gray-100/50 rounded-lg",
                }}
              />
            )}
          </motion.div>

          {/* Upcoming Events Widget */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl p-6 bg-white/80 backdrop-blur-lg border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-6">
              {isLoading ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                <h2 className="text-xl font-semibold text-gray-800">This Week's Events</h2>
              )}
              {isLoading ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <Link href="/admin/events" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            {isLoading ? (
              <CardSkeleton className="h-[200px]" />
            ) : (
              <WeekEvents initialEvents={events} />
            )}
          </motion.div>

          {/* Team Widget */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl p-6 bg-white/80 backdrop-blur-lg border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
          >
            {isLoading ? (
              <Skeleton className="h-6 w-24 mb-6" />
            ) : (
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Team</h2>
            )}

            {isLoading ? (
              <CardSkeleton className="h-[200px]" />
            ) : (
              <>
                <div className="space-y-4">
                  {dashboardData?.success && dashboardData?.data && dashboardData?.data?.teamMembers.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Avatar className="h-8 w-8 bg-yellow-700 border-2 border-gray-200 rounded-full">
                          <AvatarImage src={member?.image || ""} alt="User" />
                          <AvatarFallback className='bg-transparent' >{member?.name?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{member.name}</p>
                        <p className="text-sm text-gray-500 ">{member.position}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link href="/admin/users" className="w-full mt-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-300 hover:text-indigo-500 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <User className="h-4 w-4" /> Invite Team Member
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}