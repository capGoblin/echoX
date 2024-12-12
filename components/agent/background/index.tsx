"use client";

import { BackgroundBase } from "./background-base";
import { BackgroundEffects } from "./background-effects";
import { BackgroundOverlay } from "./background-overlay";

export function AgentBackground() {
  return (
    <>
      <BackgroundBase />
      <BackgroundEffects />
      <BackgroundOverlay />
    </>
  );
}
