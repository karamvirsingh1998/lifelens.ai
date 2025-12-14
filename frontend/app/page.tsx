"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to onboarding page
    router.push("/onboarding");
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2d2347] via-[#1e1a2e] to-[#1a1625] flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );
}
