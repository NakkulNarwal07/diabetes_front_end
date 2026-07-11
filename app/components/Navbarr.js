"use client";

import Link from "next/link";
import { useState } from "react";

const Navbarr = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/dev", label: "Developer" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <div className="fixed top-6 left-1/2 z-50 w-[min(86vw,320px)] -translate-x-1/2">
      <nav className="rounded-full border border-white/8 bg-white/5 px-2 py-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.18)] backdrop-blur-2xl ring-1 ring-white/5">
        <div className="flex items-center justify-between gap-1">
          <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setOpen(!open)}
            className="ml-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-white/75 transition hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            <span className="text-sm leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>

        {open && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-black/15 p-1.5 md:hidden">
            <ul className="flex flex-col gap-1">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-xs text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbarr;