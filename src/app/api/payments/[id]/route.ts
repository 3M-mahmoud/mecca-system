import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { UpdatePaymentDto } from "@/utils/dtos";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/payments/:id
 * @desc  Get Single Payment
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const payment = await prisma.payment.findUnique({
      where: { id: +id },
      include: {
        trader: true,
        remaining: true,
      },
    });
    if (!payment) {
      return NextResponse.json(
        { message: "المدفوعات غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/payments/:id
 * @desc  update Payment
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;

    // البحث عن عملية السحب القديمة
    const existingPayment = await prisma.payment.findUnique({
      where: { id: +id },
    });
    if (!existingPayment) {
      return NextResponse.json(
        { message: "المدفوعات غير موجود" },
        { status: 404 }
      );
    }

    // قراءة البيانات والتحقق من صحتها
    const body = (await request.json()) as UpdatePaymentDto;

    // تحديث رصيد التاجر
    if (body.traderId) {
      if (body.traderId === existingPayment.traderId) {
        if (body.amount) {
          await prisma.traderCustomer.update({
            where: { id: body.traderId },
            data: {
              balance: { increment: body.amount - existingPayment.amount },
            },
          });
        }
      }
      if (body.traderId !== existingPayment.traderId) {
        if (body.amount) {
          await prisma.traderCustomer.update({
            where: { id: body.traderId },
            data: {
              balance: { increment: body.amount },
            },
          });
        }
      }
    }
    // تحديث رصيد عميل البواقي
    if (body.remainingId) {
      if (body.remainingId === existingPayment.remainingId) {
        if (body.amount) {
          await prisma.remainingCustomer.update({
            where: { id: body.remainingId },
            data: {
              balance: { increment: body.amount - existingPayment.amount },
            },
          });
        }
      }
      if (body.remainingId !== existingPayment.remainingId) {
        if (body.amount) {
          await prisma.remainingCustomer.update({
            where: { id: body.remainingId },
            data: {
              balance: { increment: body.amount },
            },
          });
        }
      }
    }

    // تحديث البيانات
    const updatedPayment = await prisma.payment.update({
      where: { id: +id },
      data: {
        amount: body.amount,
        description: body.description,
        traderId: body.traderId,
        remainingId: body.remainingId,
      },
    });

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route ~/api/payments/:id
 * @desc  delete Payment
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const payment = await prisma.payment.findUnique({
      where: { id: +id },
    });
    if (!payment) {
      return NextResponse.json(
        { message: "المدفوعات غير موجود" },
        { status: 404 }
      );
    }
    if (payment.traderId) {
      await prisma.traderCustomer.update({
        where: { id: payment.traderId },
        data: { balance: { decrement: payment.amount } },
      });
    }
    if (payment.remainingId) {
      await prisma.remainingCustomer.update({
        where: { id: payment.remainingId },
        data: { balance: { decrement: payment.amount } },
      });
    }
    const deletedPayment = await prisma.payment.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "نجح حذف المدفوعات" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
