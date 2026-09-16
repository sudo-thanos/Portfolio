/**
 * 404 Page
 */

import { SquigglyLine } from "@/components/SquigglyLine";
import Image from "next/image";

export default function NotFound() {
    return (
        <>
            <section className="w-[90%] max-w-240 pt-32 text-[1.5rem] mx-auto">
                <h2 className="text-[2.5rem] font-bold">Page Not Found</h2>

                <p className="mt-2 text-[1.5rem]">
                    {"Sorry, the page you are looking for doesn't exist :("}
                </p>

                <SquigglyLine />

                <Image
                    src="/images/404.png"
                    width={1024}
                    height={1024}
                    alt="Not found"
                    className="w-[70%]"
                />
            </section>
        </>
    );
}
