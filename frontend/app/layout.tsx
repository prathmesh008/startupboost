import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "StartupBoost | Premium Assets",
    description: "Exclusive benefits for verified founders.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-obsidian text-ivory min-h-screen flex flex-col">
                {children}
            </body>
        </html>
    );
}
