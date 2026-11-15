import { UseTrustedWalletsSupported } from "@/lib/services/trusted-wallets.service";
import { DEFAULT_COOLING_OFF_HOURS } from "@/lib/trusted-wallets";

/** Cooling-off length from the backend, or the guide's 24 hours until it answers. */
export const useTrustedWalletsSupportedHours = () =>
  UseTrustedWalletsSupported().data?.coolingOffHours ??
  DEFAULT_COOLING_OFF_HOURS;
