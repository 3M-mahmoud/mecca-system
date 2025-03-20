import SideBar from "@/components/SideBar";
import { Suspense } from "react";

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
          <h3>
            <Suspense fallback={<div>جارِ التحميل...</div>}>
              {children}
            </Suspense>
          </h3>
        </div>
      </div>
    </div>
  );
}
