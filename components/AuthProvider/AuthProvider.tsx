"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_ROUTES = ["/profile", "/notes"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const isPrivate = PRIVATE_ROUTES.some((p) => pathname.startsWith(p));
      setIsChecking(true);
      try {
        const user = await checkSession();

        if (!active) return;

        if (user) {
          setUser(user);
          setIsChecking(false);
          return;
        }

        clearIsAuthenticated();
        if (isPrivate) {
          await logout().catch(() => {});
          setIsChecking(false);
          router.replace("/sign-in");
        } else {
          setIsChecking(false);
        }
      } catch {
        if (!active) return;
        clearIsAuthenticated();
        setIsChecking(false);
        if (isPrivate) router.replace("/sign-in");
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  const isPrivate = PRIVATE_ROUTES.some((p) => pathname.startsWith(p));

  if (isChecking) return <p>Loading...</p>;
  if (isPrivate && !isAuthenticated) return null;

  return <>{children}</>;
}
