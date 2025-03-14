import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreateTraderDto } from "@/utils/dtos";
import { createTraderSchema } from "@/utils/validationSchemas";
import { TraderCustomer } from "@prisma/client";

/**
 * @method GET
 * @route ~/api/traders
 * @desc  Get All Traders
 * @access public
 */

export async function GET(request: NextRequest) {
  const TradersCustomer = await prisma.traderCustomer.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  return NextResponse.json(TradersCustomer, { status: 200 });
}

/**
 * @method POST
 * @route ~/api/traders
 * @desc  Create New Trader
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const tradersCustomer = await prisma.traderCustomer.findMany();
    const body = (await request.json()) as CreateTraderDto;
    // validation
    const validation = createTraderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const Founded = tradersCustomer.find((trader) => trader.name === body.name);
    if (Founded) {
      return NextResponse.json(
        { message: "التاجر موجود بالفعل" },
        { status: 400 }
      );
    }
    const newTrader: TraderCustomer = await prisma.traderCustomer.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        balance: body.balance,
      },
    });
    return NextResponse.json(newTrader, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
