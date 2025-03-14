import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { UpdatedUserDto } from "@/utils/dtos";
import bcrypt from "bcryptjs";
import { updateProfileSchema } from "@/utils/validationSchemas";

interface props {
  params: { id: string };
}

/**
 * @method DELETE
 * @route ~/api/user/profile/:id
 * @desc  delete user
 * @access private
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
    }

    const userFromToken = verifyToken(request);
    if (userFromToken !== null && userFromToken.id === +id) {
      await prisma.user.delete({ where: { id: parseInt(id) } });
      return NextResponse.json(
        { message: "your profile (account) has been deleted" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "only user himself can deleted his profile, forbidden" },
      { status: 403 } //forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/user/profile/:id
 * @desc  get user profile
 * @access private
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "هذا المستخدم غير موجود" }, { status: 404 });
    }

    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== +id) {
      return NextResponse.json(
        { message: "your are not allowed, access denied" },
        { status: 403 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/user/profile/:id
 * @desc  Updated user profile
 * @access private
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return NextResponse.json({ message: "هذا المستخدم غير موجود" }, { status: 404 });
    }

    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== +id) {
      return NextResponse.json(
        { message: "your are not allowed, access denied" },
        { status: 403 }
      );
    }
    const body = (await request.json()) as UpdatedUserDto;
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
      },
    });
    const { password, ...other } = updatedUser;
    return NextResponse.json(other, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
