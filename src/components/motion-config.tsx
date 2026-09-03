"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * One switch for every Framer animation on the site: a visitor who has asked
 * their system for less motion gets the state changes without the movement.
 * The CSS animations honour the same preference in globals.css.
 */
export function SiteMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
