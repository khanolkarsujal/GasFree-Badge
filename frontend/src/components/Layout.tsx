import React from "react";
import { Navbar } from "./site/Navbar";
import { Footer } from "./site/Footer";

interface LayoutProps {
  children: React.ReactNode;
  wallet: any;
  collection: any;
}

export function Layout({ children, wallet, collection }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-indigo-500/30 selection:text-indigo-100 overflow-x-hidden flex flex-col">
      <Navbar
        wallet={wallet}
        collection={collection}
        platform={null}
        platformAuth={null}
        setPlatformTick={() => {}}
      />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
