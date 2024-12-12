"use client";

import { AgentBackground } from "@/components/agent/background";
import { CardContainer } from "@/components/agent/card-container";
import { Nav } from "@/components/agent/nav";

const Page = () => {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen flex items-center justify-center p-4 pt-20 backdrop-blur-3xl">
        <AgentBackground />
        <div className="relative z-10 w-full max-w-md">
          <CardContainer />
        </div>
      </main>
    </>
  );
};

export default Page;
