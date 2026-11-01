import { Suspense } from "react";
import SettingsPage from "@/components/Dashboard/Settings-Page/settings-page";
import { Reveal } from "@/components/ui/reveal";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Reveal>
        <SettingsPage />
      </Reveal>
    </Suspense>
  );
}
