"use client";
import Image from "next/image";

const icons = [
    { src: "/icons/react.svg", alt: "React" },
    { src: "/icons/nextjs.svg", alt: "Next.js" },
    { src: "/icons/tailwind.svg", alt: "Tailwind CSS" },
    { src: "/icons/node.svg", alt: "Node.js" },
    { src: "/icons/js.svg", alt: "JavaScript" },
    { src: "/icons/ts.svg", alt: "TypeScript" },
    { src: "/icons/git.svg", alt: "Git" },
];

export default function StackScroll() {
    return (
        <div className="overflow-hidden w-[40%] bg-[#06031B]">
            <div className="flex animate-marquee gap-8">
                {/* First set */}
                {icons.map((icon, i) => (
                    <Image
                        key={`set1-${i}`}
                        src={icon.src}
                        alt={icon.alt}
                        width={50}
                        height={50}
                        className="flex-shrink-0"
                    />
                ))}
                {/* Second set (duplicate for seamless looping) */}
                {icons.map((icon, i) => (
                    <Image
                        key={`set2-${i}`}
                        src={icon.src}
                        alt={icon.alt}
                        width={50}
                        height={50}
                        className="flex-shrink-0"
                    />
                ))}
            </div>
        </div>
    );
}
