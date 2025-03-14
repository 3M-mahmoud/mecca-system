import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { LoginUserDto } from "@/utils/dtos";
import { loginSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { setCookie } from "@/utils/generateToken";

/**
 * @method POST
 * @route ~/api/users/login
 * @desc  Login User
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDto;

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json(
        { message: "الايميل او الباسورد غير صحيح" },
        { status: 400 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "الايميل او الباسورد غير صحيح" },
        { status: 400 }
      );
    }

    const cookie = setCookie({
      id: user.id,
      username: user.username,
    });

    return NextResponse.json(
      { message: "نجح تسجيل الدخول" },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      {
        status: 500,
      }
    );
  }
}
