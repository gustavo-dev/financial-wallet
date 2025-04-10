import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

const depositSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, description } = depositSchema.parse(body);

    const transaction = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount,
          description,
          toUserId: userId,
        },
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: amount
          }
        },
      });

      return { transaction, user };
    });

    return NextResponse.json({
      message: 'Depósito realizado com sucesso',
      transaction: transaction.transaction,
      newBalance: transaction.user.balance
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Erro ao processar depósito:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 