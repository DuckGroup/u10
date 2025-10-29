"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { adminNavItems } from "../constants/adminNavItems";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const linkClasses = (isActive: boolean) =>
    [
      "flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
      isActive
        ? "bg-stone-700 text-white"
        : "text-stone-600 hover:bg-stone-200 hover:text-stone-800 hover:scale-[1.02]",
    ].join(" ");

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-stone-50 border-b border-stone-200 md:hidden fixed top-0 left-0 right-0 z-50">

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md border border-stone-300 hover:bg-stone-100 transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full bg-stone-50 w-64 p-6 border-r border-stone-200 shadow-sm transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
      >
        <div className="mt-20 mb-6 flex justify-center">
          <Image
            src="/elana_logo.svg"
            alt="Elana logo"
            width={140}
            height={70}
          />
        </div>

        <nav className="flex flex-col gap-4 w-full">
          {adminNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={linkClasses(isActive)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
        ></div>
      )}
    </>
  );
};
