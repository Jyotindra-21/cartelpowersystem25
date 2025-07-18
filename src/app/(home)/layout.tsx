"use client"
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";
export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
<<<<<<< HEAD
=======

>>>>>>> 55ff9e80e78b1734cecc5d93a70cbc211e1c8f7f
    return (
        <div className="flex flex-col min-h-screen">
            <header className="h-[80px] fixed inset-y-0 w-full z-50 bg-gradient-to-l from-primary to-primary/80">
                <Navbar />
            </header>
            <main className="flex-1 pt-[80px]">
                <div className="min-h-[calc(100vh-80px)]">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}