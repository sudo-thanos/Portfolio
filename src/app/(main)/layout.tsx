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
            <main className="grow">{children}</main>
            <Footer />
        </>
    );
}
