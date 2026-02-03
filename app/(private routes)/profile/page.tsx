import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "Your profile on NoteHub.",
  openGraph: {
    title: "Profile | NoteHub",
    description: "Your profile on NoteHub.",
    url: "https://08-zustand-eight-pied.vercel.app/profile",
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

export default async function ProfilePage() {
  const user = await getMe().catch(() => null);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar ?? "/file.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? "your_username"}</p>
          <p>Email: {user?.email ?? "your_email@example.com"}</p>
        </div>
      </div>
    </main>
  );
}
