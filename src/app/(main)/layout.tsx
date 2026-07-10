import Navigation from "@/components/Nav";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <VisitTracker />
            <Navigation />
            <main className="grow">{children}</main>
            <Footer />
        </>
    );
}
