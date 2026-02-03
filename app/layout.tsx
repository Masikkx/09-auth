import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "NoteHub",
    description: "A platform to share your notes with the world.",
    openGraph: {
      title: "NoteHub",
      description: "NoteHub - A platform to share your notes with the world.",
      url: "https://08-zustand-eight-pied.vercel.app",
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
  };
}

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
