'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { useUser } from "@/app/context/UserContext";
import { ModalProvider } from "@/app/context/ModalContext";
import GlobalModals from "@/app/components/GlobalModals";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="w-full min-h-full flex-1 flex flex-col items-center justify-center">
        <ModalProvider>
          {children}
          <GlobalModals />
        </ModalProvider>
      </main>
    </>
  );
}
