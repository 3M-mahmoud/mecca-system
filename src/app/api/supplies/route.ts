import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreateSuppliesDto } from "@/utils/dtos";
import { createSuppliesSchema } from "@/utils/validationSchemas";
import { Supply } from "@prisma/client";

/**
 * @method GET
 * @route ~/api/supplies
 * @desc  Get All Supplies
 * @access public
 */

export async function GET(request: NextRequest) {
  const supplies = await prisma.supply.findMany({
    include: {
      TraderCustomer: true,
    },
  });
  return NextResponse.json(supplies, { status: 200 });
}

/**
 * @method POST
 * @route ~/api/supplies
 * @desc  Create New Supply
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    // استخراج البيانات من الطلب
    const body = (await request.json()) as CreateSuppliesDto;
    const product = body.productId
      ? await prisma.product.findUnique({
          where: { id: body.productId },
        })
      : null;
    const trader = body.traderId
      ? await prisma.traderCustomer.findUnique({
          where: { id: body.traderId },
        })
      : null;

    // التحقق من صحة البيانات باستخدام Zod
    const validation = createSuppliesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    if (body.productId) {
      await prisma.product.update({
        where: { id: body.productId },
        data: { count: { increment: body.quantity } },
      });
    }

    if (body.traderId) {
      if (!trader) {
        return NextResponse.json(
          { message: "التاجر غير موجود" },
          { status: 404 }
        );
      }

      if (product) {
        await prisma.traderCustomer.update({
          where: { id: body.traderId },
          data: { balance: { increment: product.price * body.quantity } },
        });
      } else {
        await prisma.traderCustomer.update({
          where: { id: body.traderId },
          data: { balance: { increment: body.price } },
        });
      }
    }
    const newSupply: Supply = await prisma.supply.create({
      data: {
        quantity: body.quantity,
        description: body.description,
        traderCustomerId: trader?.id,
        price: body.price,
        productId: body.productId,
        name: body.name,
      },
    });
    return NextResponse.json(newSupply, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطأ داخلي، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}
