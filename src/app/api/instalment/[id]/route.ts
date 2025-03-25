import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { updatedInstalmentDto } from "@/utils/dtos";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/instalment/:id
 * @desc  Get Single Instalment
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const instalment = await prisma.installment.findUnique({
      where: { id: +id },
      include: {
        customer: true,
      },
    });
    if (!instalment) {
      return NextResponse.json(
        { message: "القسط غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(instalment, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/instalment/:id
 * @desc  update Instalment
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const instalment = await prisma.installment.findUnique({
      where: { id: +id },
    });
    if (!instalment) {
      return NextResponse.json(
        { message: "القسط غير موجود" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as updatedInstalmentDto;
    console.log(body);
    if (body.isPaid) {
      if (body.amount) {
        await prisma.installmentCustomer.update({
          where: { id: instalment.customerId },
          data: { balance: { decrement: body.amount } },
        });
      } else {
        await prisma.installmentCustomer.update({
          where: { id: instalment.customerId },
          data: { balance: { decrement: instalment.amount } },
        });
      }
    }
    const updatedInstalment = await prisma.installment.update({
      where: { id: parseInt(id) },
      data: {
        amount: body.amount,
        dueDate: new Date(body.dueDate || instalment.dueDate),
        isPaid: body.isPaid,
      },
    });
    return NextResponse.json(updatedInstalment, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route ~/api/instalment/:id
 * @desc  delete Instalment
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const instalment = await prisma.installment.findUnique({
      where: { id: +id },
    });
    if (!instalment) {
      return NextResponse.json(
        { message: "القسط غير موجود" },
        { status: 404 }
      );
    }
    await prisma.installmentCustomer.update({
      where: { id: instalment.customerId },
      data: { balance: { decrement: instalment.amount } },
    });
    await prisma.installment.delete({
      where: { id: +id },
    });
    return NextResponse.json(
      { message: "نجح حذف القسط" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
