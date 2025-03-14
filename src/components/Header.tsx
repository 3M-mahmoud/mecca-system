import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { cookies } from "next/headers";
const Header = async () => {
  const getCookie = await cookies();
  const token = getCookie.get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);

  return (
    <header className="bg-white shadow-md fixed left-0 top-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* اللوجو على اليسار */}
        <div className="text-xl font-bold text-[#0084dd]">
          <Link href={"/"}>
            <Image
              src={"/images/logo1.png"}
              alt="Logo"
              width={70}
              height={10}
              className="object-contain"
            />
          </Link>
        </div>

        <Navbar payload={payload} />
      </div>
    </header>
  );
};

export default Header;
