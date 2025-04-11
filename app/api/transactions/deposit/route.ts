import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyJwtToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyJwtToken(token);
    const body = await request.json();
    const { amount, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido para depósito' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        balance: { increment: amount },
        sentTransactions: {
          create: {
            type: 'DEPOSIT',
            amount,
            description: description || 'Depósito',
          }
        }
      },
      include: {
        sentTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return NextResponse.json({
      balance: user.balance,
      transaction: user.sentTransactions[0]
    });

  } catch (error) {
    console.error('Erro ao processar depósito:', error);
    return NextResponse.json(
      { error: 'Erro ao processar depósito' },
      { status: 500 }
    );
  }
}
