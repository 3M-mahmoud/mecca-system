import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreateRemainingDto } from "@/utils/dtos";
import { createTraderSchema } from "@/utils/validationSchemas";
import { TraderCustomer } from "@prisma/client";

/**
 * @method GET
 * @route ~/api/remaining
 * @desc  Get All Remaining
 * @access public
 */

export async function GET(request: NextRequest) {
  const RemainingCustomer = await prisma.remainingCustomer.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  return NextResponse.json(RemainingCustomer, { status: 200 });
}

/**
 * @method POST
 * @route ~/api/remaining
 * @desc  Create New Remaining
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const remainingCustomer = await prisma.remainingCustomer.findMany();
    const body = (await request.json()) as CreateRemainingDto;
    // validation
    const validation = createTraderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const Founded = remainingCustomer.find(
      (remaining) => remaining.name === body.name
    );
    if (Founded) {
      return NextResponse.json(
        { message: "عميل البواقي موجود بالفعل" },
        { status: 400 }
      );
    }
    const newRemaining: TraderCustomer = await prisma.remainingCustomer.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        balance: body.balance,
      },
    });
    return NextResponse.json(newRemaining, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
