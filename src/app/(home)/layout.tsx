import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="flex flex-col min-h-screen">
            <div className="h-[80px] fixed inset-y-0 w-full z-50 bg-gradient-to-l from-primary to-primary/80    ">
                <Navbar />
            </div>
            <main className="flex-1 pt-[80px] overflow-hidden">
                <div className="min-h-[calc(100vh-80px)] overflow-y-scroll">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}