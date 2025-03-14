import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
/**
 * @method GET
 * @route ~/api/user/logout
 * @desc  Logout User
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    (await cookies()).delete("jwtToken");
    return NextResponse.json({ message: "نجح تسجيل الخروج" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
