import prisma from "@/utils/db";
import { UpdateProductDto } from "@/utils/dtos";
import { NextRequest, NextResponse } from "next/server";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/products/:id
 * @desc  Get Single Product
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: +id },
      include: {
        withdrawals: {
          orderBy: {
            createdAt: "desc",
          },
        },
        supplies: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!product) {
      return NextResponse.json(
        { message: "المنتج غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/products/:id
 * @desc  update Product
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id: +id } });
    if (!product) {
      return NextResponse.json(
        { message: "المنتج غير موجود" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as UpdateProductDto;
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        category: body.category,
        price: body.price,
        count: body.quantity,
      },
    });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route ~/api/products/:id
 * @desc  delete Product
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id: +id } });
    if (!product) {
      return NextResponse.json(
        { message: "المنتج غير موجود" },
        { status: 404 }
      );
    }
    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(
      { message: "نجح حذف المنتج" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
