import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreateInstallmentDto } from "@/utils/dtos";
import { createInstallmentSchema } from "@/utils/validationSchemas";
import { InstallmentCustomer } from "@prisma/client";

/**
 * @method GET
 * @route ~/api/installments
 * @desc  Get All Installments
 * @access public
 */

export async function GET(request: NextRequest) {
  const TradersCustomer = await prisma.installmentCustomer.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      installments: true,
      withdrawals: true,
    },
  });
  return NextResponse.json(TradersCustomer, { status: 200 });
}

/**
 * @method POST
 * @route ~/api/installments
 * @desc  Create New Installment
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const installmentCustomer = await prisma.installmentCustomer.findMany();
    const body = (await request.json()) as CreateInstallmentDto;
    // validation
    const validation = createInstallmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const Founded = installmentCustomer.find(
      (installment) => installment.name === body.name
    );
    if (Founded) {
      return NextResponse.json(
        { message: "عميل الاقساط موجود بالفعل" },
        { status: 400 }
      );
    }
    const newInstallment: InstallmentCustomer =
      await prisma.installmentCustomer.create({
        data: {
          name: body.name,
          balance: body.balance,
          phone: body.phone,
        },
      });

    return NextResponse.json(
      { message: "نجح اضافة عميل الاقساط" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
