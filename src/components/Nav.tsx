"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavTypes {
    id: number;
    navItem: string;
    path: string;
}

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems: NavTypes[] = [
        {
            id: 1,
            navItem: "Resume",
            path: "/resume",
        },
        {
            id: 2,
            navItem: "Contact",
            path: "/contact",
        },
        {
            id: 3,
            navItem: "Projects",
            path: "/projects",
        },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="w-[90%] uppercase mx-auto py-4 items-center flex justify-between relative">
                <Link
                    href="/"
                    className="font-bold text-[2.5rem] lg:text-[3rem]  flex gap-2"
                >
                    {/* eslint-disable-next-line */}
                    <span className="text-accent">//</span>
                    <p className="mt-1">DU</p>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((items) => {
                        const { id, navItem, path } = items;
                        return (
                            <Link key={id} href={path}>
                                <p className="font-bold cursor-pointer hover:text-accent transition-colors">
                                    {navItem}
                                </p>
                            </Link>
                        );
                    })}
                    <section className="flex items-center gap-6">
                        <Link href="https://github.com/sudo-thanos">
                            <Image
                                src="/icons/github.svg"
                                width={32}
                                height={32}
                                alt="Social Icon"
                                className="w-6 cursor-pointer hover:opacity-70 transition-opacity"
                            />
                        </Link>
                        <Link href="https://www.linkedin.com/in/udechukwudc/">
                            <Image
                                src="/icons/linkedin.svg"
                                width={32}
                                height={32}
                                alt="Social Icon"
                                className="w-6 cursor-pointer hover:opacity-70 transition-opacity"
                            />
                        </Link>
                    </section>
                </div>

                {/* Hamburger Menu Button */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <div
                        className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                            isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                        }`}
                    />
                    <div
                        className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${
                            isMenuOpen ? "opacity-0" : ""
                        }`}
                    />
                    <div
                        className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${
                            isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                        }`}
                    />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={closeMenu}
            />

            {/* Mobile Menu */}
            <div
                className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#06031b] shadow-lg z-50 transform transition-transform duration-300 ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-6">
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        <div className="w-6 h-0.5 bg-current rotate-45 absolute" />
                        <div className="w-6 h-0.5 bg-current -rotate-45 absolute" />
                    </button>

                    {/* Mobile Navigation Items */}
                    <div className="mt-12 flex flex-col gap-6">
                        {navItems.map((items) => {
                            const { id, navItem, path } = items;
                            return (
                                <Link key={id} href={path} onClick={closeMenu}>
                                    <p className="font-bold cursor-pointer text-lg hover:text-accent transition-colors py-2">
                                        {navItem}
                                    </p>
                                </Link>
                            );
                        })}

                        {/* Mobile Social Icons */}
                        <section className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link href="https://github.com/sudo-thanos">
                                <Image
                                    src="/icons/github.svg"
                                    width={32}
                                    height={32}
                                    alt="Social Icon"
                                    className="w-6 cursor-pointer hover:opacity-70 transition-opacity"
                                />
                            </Link>
                            <Link href="https://www.linkedin.com/in/udechukwudc/">
                                <Image
                                    src="/icons/linkedin.svg"
                                    width={32}
                                    height={32}
                                    alt="Social Icon"
                                    className="w-6 cursor-pointer hover:opacity-70 transition-opacity"
                                />
                            </Link>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
