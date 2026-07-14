import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@/index.css";
import { AppShell } from "@/components/app-shell/app-shell";
import { DemoStateProvider } from "@/providers/demo-state-provider";

export const metadata: Metadata = {
  title: "Agent Office",
  description: "See and collaborate with the AI agents deployed across your organization.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="noise-bg">
        <DemoStateProvider>
          <AppShell>{children}</AppShell>
        </DemoStateProvider>
      </body>
    </html>
  );
}
