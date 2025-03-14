import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreateInstalmentDto } from "@/utils/dtos";
import { createInstalmentSchema } from "@/utils/validationSchemas";

/**
 * @method GET
 * @route ~/api/instalment
 * @desc  Get All Instalment
 * @access public
 */

export async function GET(request: NextRequest) {
  const instalment = await prisma.installment.findMany();
  return NextResponse.json(instalment, { status: 200 });
}

/**
 * @method POST
 * @route ~/api/instalment
 * @desc  Create New Instalment
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateInstalmentDto;
    // validation
    const validation = createInstalmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const { months, total, monthPayment, customerId } = body;
    const lastInstallment = total - monthPayment * (months - 1);

    const installments = Array.from({ length: months }, (_, i) => ({
      customerId: customerId,
      amount: i === months - 1 ? lastInstallment * -1 : monthPayment * -1,
      dueDate: new Date(
        new Date(body.dueDate).setMonth(new Date(body.dueDate).getMonth() + i)
      ),
    }));
    await prisma.installmentCustomer.update({
      where: { id: customerId },
      data: { balance: total * -1 },
    });

    const instalment = await prisma.installment.createMany({
      data: installments,
    });

    return NextResponse.json({ message: "نجح إنشاء القسط" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
