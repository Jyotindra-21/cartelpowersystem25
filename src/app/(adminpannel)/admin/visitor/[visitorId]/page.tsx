'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDuration, formatPageName } from "@/lib/helper";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from "recharts";
import { Calendar, Clock, Laptop, LoaderCircle, MapPin, Smartphone } from "lucide-react";
import { use, useEffect, useState } from "react";
import { getVisitorById } from "@/services/visitor.services";
import { IVisitor } from "@/types/commonTypes";
import { toast } from "@/components/hooks/use-toast";

interface PageProps {
    params: Promise<{
        visitorId: string;
    }>;
}

interface TimeSpentData {
    name: string;
    duration: number;
    formattedDuration: string;
}

interface NavigationItem {
    step: number;
    page: string;
    firstTime: string;
    lastTime: string;
    visitCount: number;
    totalDuration: number;
    formattedDuration: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function VisitorAnalyticsPage({ params }: PageProps) {
    const { visitorId } = use(params);
    const [visitorData, setVisitorData] = useState<IVisitor | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchVisitorData = async () => {
            try {
                const response = await getVisitorById(visitorId);
                if (!response.success) {
                    throw new Error('Failed to fetch visitor data');
                }
                setVisitorData(response.data);
            } catch (err) {
                toast({ title: "Error", description: `${err instanceof Error ? err.message : 'Unknown error'}`, variant: "destructive" })
            } finally {
                setIsLoading(false);
            }
        };

        fetchVisitorData();
    }, [visitorId]);

    // Parse date string to Date object
    const parseDateString = (dateString: string): Date => {
        return new Date(dateString);
    };

    // Calculate time spent on each page
    const calculateTimeSpent = (): TimeSpentData[] => {
        if (!visitorData?.sessions?.[0]?.pages) return [];
        const pages = visitorData.sessions[0].pages;
        const timeSpent: TimeSpentData[] = [];
        const pageMap = new Map<string, number>();
        for (let i = 0; i < pages.length - 1; i++) {
            const currentTime = parseDateString(pages[i].timestamp).getTime();
            const nextTime = parseDateString(pages[i + 1].timestamp).getTime();
            const diff = (nextTime - currentTime) / 1000;
            const pageName = formatPageName(pages[i].url);

            pageMap.set(pageName, (pageMap.get(pageName) || 0) + diff);
        }
        pageMap.forEach((duration, name) => {
            timeSpent.push({
                name,
                duration,
                formattedDuration: formatDuration(duration),
            });
        });

        // Add last page if not included
        const lastPageName = formatPageName(pages[pages.length - 1].url);
        if (!pageMap.has(lastPageName)) {
            timeSpent.push({
                name: lastPageName,
                duration: 0,
                formattedDuration: '0s'
            });
        }

        return timeSpent.sort((a, b) => b.duration - a.duration);
    };

    // Generate navigation sequence
    const generateNavigationSequence = (): NavigationItem[] => {
        if (!visitorData?.sessions?.[0]?.pages) return [];

        return visitorData.sessions[0].pages.reduce((acc: any, page: any) => {
            const pageName = formatPageName(page.url);
            const pageTime = parseDateString(page.timestamp);
            const timeString = pageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const existingIndex = acc.findIndex((item: any) => item.page === pageName);

            if (existingIndex >= 0) {
                const existing = acc[existingIndex];
                existing.lastTime = timeString;
                existing.visitCount += 1;
                existing.totalDuration = (pageTime.getTime() - parseDateString(existing.firstTime).getTime()) / 1000;
                existing.formattedDuration = formatDuration(existing.totalDuration);
            } else {
                acc.push({
                    step: acc.length + 1,
                    page: pageName,
                    firstTime: page.timestamp,
                    lastTime: timeString,
                    visitCount: 1,
                    totalDuration: 0,
                    formattedDuration: '0s'
                });
            }

            return acc;
        }, [] as NavigationItem[]);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 bg-black/50 pointer-events-none">
                <LoaderCircle className={`animate-spin h-10 w-10 lg:ml-44`} />
            </div>
        )
    }
    if (!visitorData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 bg-black/50 pointer-events-none">
                No visitor data found
            </div>
        )
    }

    const timeSpentData = calculateTimeSpent();
    const totalSessionTime = timeSpentData.reduce((sum, page) => sum + page.duration, 0);
    const navigationSequence = generateNavigationSequence();

    // Prepare chart data
    const barChartData = timeSpentData.map(item => ({
        name: item.name,
        value: Math.round(item.duration),
        label: item.formattedDuration,
        count: visitorData.sessions?.[0]?.pages.filter((p: any) =>
            formatPageName(p.url) === item.name
        ).length || 1
    }));

    const pieChartData = timeSpentData
        .filter(item => item.duration > 0)
        .map(item => ({
            name: item.name,
            value: Math.round(item.duration),
            formatted: item.formattedDuration,
            count: visitorData.sessions?.[0]?.pages.filter((p: any) =>
                formatPageName(p.url) === item.name
            ).length || 1
        }));

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Visitor Analytics</h1>
                <p className="text-muted-foreground">
                    Session details for visitor {visitorData?.visitorId?.slice(0, 8)}...
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Visitor Time</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex flex-row items-center justify-between pb-2">
                                <span className="text-sm font-medium">First Visit</span>
                                <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="text-lg font-bold">
                                {new Date(visitorData.firstVisit).toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {new Date(visitorData.firstVisit).toLocaleTimeString()}
                            </p>
                        </div>

                        <div>
                            <div className="flex flex-row items-center justify-between pb-2">
                                <span className="text-sm font-medium">Last Visit</span>
                                <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="text-lg font-bold">
                                {new Date(visitorData.lastVisit).toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {new Date(visitorData.lastVisit).toLocaleTimeString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Visitor & Device</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex flex-row items-center justify-between pb-2">
                                <span className="text-sm font-medium">Visitor</span>
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                        {visitorData?.device?.isBot ? '🤖' : '👤'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-lg font-bold">
                                {visitorData?.device?.isBot ? 'Bot' : 'Anonymous'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {visitorData?.device?.type} user
                            </p>
                        </div>

                        <div>
                            <div className="flex flex-row items-center justify-between pb-2">
                                <span className="text-sm font-medium">Device</span>
                                <Laptop className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="text-lg font-bold">
                                {visitorData?.device?.os?.name} {visitorData?.device?.os?.version}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {visitorData?.device?.browser?.name} {visitorData?.device?.browser?.version}
                            </p>
                        </div>
                    </CardContent>
                </Card>


                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatDuration(totalSessionTime)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {visitorData?.visitCount} page views
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Location</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {visitorData?.location?.ll?.every((coord: any) => coord === null)
                                ? 'Unknown'
                                : `${visitorData?.location?.ll[0]}, ${visitorData?.location?.ll[1]}`}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            IP: {visitorData?.ipAddress}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Time Spent per Page</CardTitle>
                        <CardDescription>Duration in seconds</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tickFormatter={(value) => value}
                                />
                                <Tooltip
                                    formatter={(value) => [`${value} seconds`, "Duration"]}
                                    labelFormatter={(label) => `Page: ${label}`}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    name="Duration"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Time Distribution</CardTitle>
                        <CardDescription>Percentage of total session</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        formatDuration(Number(value)),
                                        props.payload.name
                                    ]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation Path */}
            <Card>
                <CardHeader>
                    <CardTitle>Navigation Path</CardTitle>
                    <CardDescription>User journey through your site</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {navigationSequence.map((nav, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted">
                                        {nav.step}
                                    </div>
                                    {index < navigationSequence.length - 1 && (
                                        <div className="h-10 w-0.5 bg-border" />
                                    )}
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{nav.page}</p>
                                        {nav.visitCount > 1 && (
                                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                                {nav.visitCount} visits
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {nav.visitCount > 1 ? (
                                            <>
                                                First: {parseDateString(nav.firstTime).toLocaleTimeString()} • Last: {nav.lastTime}
                                            </>
                                        ) : (
                                            parseDateString(nav.firstTime).toLocaleTimeString()
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {nav.visitCount > 1 ? (
                                            `Total time: ${nav.formattedDuration}`
                                        ) : (
                                            `Time spent: ${nav.formattedDuration}`
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}