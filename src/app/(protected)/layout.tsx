import Header from "../components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="w-full min-h-full flex-1 flex flex-col items-center justify-center">
          {children}
      </main>
    </>
  );
}
