import Navigation from "@/components/Nav";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import ScrollToTop from "@/components/ScrollToTop";
import { WebSiteJsonLd } from "@/components/JsonLd";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <WebSiteJsonLd />
            <VisitTracker />
            <Navigation />
            <main id="main" tabIndex={-1} className="grow">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </>
    );
}
