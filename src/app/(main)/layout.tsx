import Navigation from "@/components/Nav";
import Footer from "@/components/Footer";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    );
}
