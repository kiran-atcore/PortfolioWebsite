import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiran Chand S | Software Engineer & Full Stack Developer",
  description: "Portfolio of Kiran Chand S - Full Stack Software Engineer specializing in Next.js, Django REST, Python, AWS, and Applied AI.",
  icons: {
    icon: "/hero-pose-3.jpg",
    shortcut: "/hero-pose-3.jpg",
    apple: "/hero-pose-3.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="p-0">
        {children}
      </body>
    </html>
  );
}

