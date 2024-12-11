"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { useLogin } from "@/hooks/useLogin";

export function Nav() {
  const { handleLogin } = useLogin();

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
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Features
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            How it Works
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Docs
          </Button>
          <ModeToggle />
          <Button
            className="glow-effect bg-blue-600 hover:bg-blue-500"
            onClick={handleLogin}
          >
            Launch App
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
