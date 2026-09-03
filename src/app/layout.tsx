import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Poet | Portfolio",
  description: "A minimal Urdu poetry portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" dir="rtl" className="h-full">
      <body className="h-full w-full overflow-hidden flex flex-col bg-[var(--background)]" suppressHydrationWarning>
        <div className="flex-1 w-full flex flex-col pb-2 min-h-0">
          {children}
        </div>
      </body>
    </html>
  );
}
