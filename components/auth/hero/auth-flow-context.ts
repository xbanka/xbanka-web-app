"use client";

import { createContext, useContext } from "react";

/**
 * The phone auth flow: the Welcome screen, then the sign-in or sign-up form
 * opening under the (smaller) hero on the same page. Forms use this to switch
 * between each other and back to Welcome without navigating. Null outside
 * the flow (wide screens, or a form shown on its own).
 */
export type AuthFlow = {
  toWelcome: () => void;
  toLogin: () => void;
  toSignup: () => void;
};

export const AuthFlowContext = createContext<AuthFlow | null>(null);
export const useAuthFlow = () => useContext(AuthFlowContext);
