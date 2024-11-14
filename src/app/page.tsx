"use client";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
export default function Home() {
  const { user } = useUser();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="/fintech.svg" alt="Next.js logo" width={180} height={38} priority />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Get started creating your account.</li>
          <li className="mb-2">Login with your credentials.</li>
          <li>Enable MFA.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {user ? (
            <Link className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" href="/dashboard">
              Dashboard
            </Link>
          ) : (
            <>
              <Link className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" href="/signup">
                Sign up
              </Link>
              <Link className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44" href="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
