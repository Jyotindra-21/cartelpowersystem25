import { fetchWebsiteInfo } from "@/services/settings.services";
import Footer from "./_components/footer";
import { ScrollHeader } from "./_components/scroll-header";
import { getActiveSvgLogo } from "@/services/svglogo.services";
// import ChatWidget from "@/components/custom/ChatWidget";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [websiteInfo, svgLogo] = await Promise.all([
        fetchWebsiteInfo(),
        getActiveSvgLogo()
    ]);
    return (
        <div className="flex flex-col min-h-screen">
            {/* <header className="h-[80px] fixed inset-y-0 w-full z-50 bg-gradient-to-l from-primary to-primary/80">
                <Navbar />
            </header> */}
            {/* <header className="h-[60px] fixed top-0 left-0 right-0 w-full md:w-[80%]  mx-auto mt-2 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 rounded-full">
                <Navbar />
            </header> */}
            {/* <header className="h-[60px] fixed top-0 left-1/2 transform -translate-x-1/2 w-full md:w-[85%] mx-auto md:mt-2 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20 md:rounded-full liquid-glass">
                <Navbar />
            </header> */}
            <ScrollHeader svgLogo={svgLogo} websiteInfo={websiteInfo.data} />
            {/* <header id="switcher" className="h-[60px] fixed top-0 left-1/2 transform -translate-x-1/2 w-full md:w-[85%] mx-auto md:mt-2 z-50  border-b border-white/20 md:rounded-full liquid-glass">
                <Navbar />
            </header> */}
            <main className="flex-1 pt-[60px]">
                <div className="min-h-[calc(100vh-80px)]">
                    {children}
                    {/* <ChatWidget /> */}
                </div>
            </main>
            <Footer />
        </div>
    );
}