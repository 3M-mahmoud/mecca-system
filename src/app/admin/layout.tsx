import SideBar from "@/components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-24 bg-[#f1f5f9]">
      <div className="flex min-h-screen">
        <SideBar />
        <div className="content w-full overflow-hidden">
          <h3>{children}</h3>
        </div>
      </div>
    </div>
  );
}
