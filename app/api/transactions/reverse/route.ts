import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

const reverseSchema = z.object({
  transactionId: z.number().int().positive(),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Validar dados
    const body = await req.json();
    const { transactionId, reason } = reverseSchema.parse(body);

    // Iniciar transação no banco de dados
    const reversal = await prisma.$transaction(async (tx) => {
      // Buscar transação original
      const originalTransaction = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: {
          fromUser: true,
          toUser: true,
        },
      });

      if (!originalTransaction) {
        throw new Error('Transação não encontrada');
      }

      // Verificar se o usuário tem permissão (deve ser o remetente ou destinatário)
      if (originalTransaction.fromUserId !== userId && originalTransaction.toUserId !== userId) {
        throw new Error('Sem permissão para reverter esta transação');
      }

      // Criar transação de reversão
      const reversalTransaction = await tx.transaction.create({
        data: {
          type: 'TRANSFER_IN',
          amount: originalTransaction.amount,
          description: reason || 'Reversão de transação',
          fromUserId: originalTransaction.toUserId,
          toUserId: originalTransaction.fromUserId,
        },
      });

      // Se for uma transferência, reverter os saldos
      if (originalTransaction.type === 'TRANSFER_OUT' || originalTransaction.type === 'TRANSFER_IN') {
        if (originalTransaction.fromUserId) {
          await tx.user.update({
            where: { id: originalTransaction.fromUserId },
            data: {
              balance: {
                increment: originalTransaction.amount
              }
            },
          });
        }

        if (originalTransaction.toUserId) {
          await tx.user.update({
            where: { id: originalTransaction.toUserId },
            data: {
              balance: {
                decrement: originalTransaction.amount
              }
            },
          });
        }
      }

      return reversalTransaction;
    });

    return NextResponse.json({
      message: 'Transação revertida com sucesso',
      reversal
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Erro ao processar reversão:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 