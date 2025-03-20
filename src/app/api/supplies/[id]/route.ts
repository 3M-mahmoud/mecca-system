import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { UpdatedSuppliesDto } from "@/utils/dtos";
import { updateSupplySchema } from "@/utils/validationSchemas";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/supplies/:id
 * @desc  Get Single supply
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const supply = await prisma.supply.findUnique({
      where: { id: +id },
      include: {
        product: true,
        TraderCustomer: true,
      },
    });
    if (!supply) {
      return NextResponse.json(
        { message: "الوارد غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(supply, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/supplies/:id
 * @desc  update Supply
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const supply = await prisma.supply.findUnique({
      where: { id: +id },
    });

    if (!supply) {
      return NextResponse.json(
        { message: "الوارد غير موجود" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as UpdatedSuppliesDto;
    const validation = updateSupplySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    if (body.productId) {
      const product = await prisma.product.findUnique({
        where: { id: body.productId },
      });
      if (product) {
        if (body.productId === supply.productId) {
          if (body.quantity) {
            await prisma.product.update({
              where: { id: supply.productId },
              data: {
                count: { increment: body.quantity - supply.quantity },
              },
            });
          }
        }
        if (body.productId !== supply.productId) {
          if (supply.productId) {
            await prisma.product.update({
              where: { id: supply.productId },
              data: { count: { decrement: supply.quantity } },
            });
          }
          if (body.quantity) {
            await prisma.product.update({
              where: { id: body.productId },
              data: { count: { increment: body.quantity } },
            });
          }
        }
      }
    } else {
      if (supply.productId) {
        await prisma.product.update({
          where: { id: supply.productId },
          data: {
            count: { decrement: supply.quantity },
          },
        });
      }
    }
    if (body.traderId) {
      const trader = await prisma.traderCustomer.findUnique({
        where: { id: body.traderId },
      });
      if (trader) {
        if (body.traderId === supply.traderCustomerId) {
          if (body.price && body.quantity) {
            await prisma.traderCustomer.update({
              where: { id: supply.traderCustomerId },
              data: {
                balance: {
                  increment:
                    body.price * body.quantity - supply.price * supply.quantity,
                },
              },
            });
          }
        }
        if (body.traderId !== supply.traderCustomerId) {
          if (supply.traderCustomerId) {
            await prisma.traderCustomer.update({
              where: { id: supply.traderCustomerId },
              data: {
                balance: { decrement: supply.price * supply.quantity },
              },
            });
          }
          if (body.price && body.quantity) {
            await prisma.traderCustomer.update({
              where: { id: body.traderId },
              data: { balance: { increment: body.price * body.quantity } },
            });
          }
        }
      }
    }

    const updatedSupply = await prisma.supply.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        description: body.description,
        productId: body.productId,
        price: body.price,
        quantity: body.quantity,
        traderCustomerId: body.traderId,
      },
    });
    return NextResponse.json(updatedSupply, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route ~/api/supplies/:id
 * @desc  delete Supply
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const supply = await prisma.supply.findUnique({
      where: { id: +id },
    });
    if (!supply) {
      return NextResponse.json(
        { message: "الوارد غير موجود" },
        { status: 404 }
      );
    }
    if (supply.productId) {
      await prisma.product.update({
        where: { id: supply.productId },
        data: { count: { decrement: supply.quantity } },
      });
    }
    if (supply.traderCustomerId) {
      await prisma.traderCustomer.update({
        where: { id: supply.traderCustomerId },
        data: { balance: { decrement: supply.price * supply.quantity } },
      });
    }
    const deletedSupply = await prisma.supply.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(
      { message: "نجح حذف الوارد بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
