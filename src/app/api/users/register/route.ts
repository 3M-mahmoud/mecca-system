import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { CreateUserDto } from "@/utils/dtos";
import { registerSchema } from "@/utils/validationSchemas";
import { setCookie } from "@/utils/generateToken";

/**
 * @method POST
 * @route ~/api/user/register
 * @desc  Create New User
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserDto;
    // validation
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (user) {
      return NextResponse.json(
        { message: "هذا المستخدم موجود بالفعل" },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashPassword,
      },
      select: {
        username: true,
        id: true,
      },
    });
    const cookie = setCookie({
      id: newUser.id,
      username: newUser.username,
    });
    return NextResponse.json(
      { ...newUser, message: "نجح تسجيل & تسجيل الدخول" },
      { status: 201, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
