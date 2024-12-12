"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { useLogin } from "@/hooks/useLogin";
import { useStore } from "@/store/useStore";
import { AddressDisplay } from "@/components/ui/address-display";

export function Nav() {
  const { handleLogin } = useLogin();
  const { signer } = useStore();
  const address = signer?.[0] || "";

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <motion.div
          className="text-2xl font-bold text-gradient"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          echoX
        </motion.div>

        <div className="flex items-center gap-6">
          {address ? (
            <AddressDisplay address={address} />
          ) : (
            <Button onClick={handleLogin}>Connect Wallet</Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
