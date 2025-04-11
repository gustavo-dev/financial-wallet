import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJwtToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const payload = await verifyJwtToken(token);
    const body = await request.json();
    const { amount, toEmail, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido para transferência' },
        { status: 400 }
      );
    }

    if (!toEmail) {
      return NextResponse.json(
        { error: 'E-mail do destinatário é obrigatório' },
        { status: 400 }
      );
    }

    const destinationUser = await prisma.user.findUnique({
      where: { email: toEmail }
    });

    if (!destinationUser) {
      return NextResponse.json(
        { error: 'Usuário destinatário não encontrado' },
        { status: 404 }
      );
    }

    if (destinationUser.id === payload.id) {
      return NextResponse.json(
        { error: 'Não é possível transferir para si mesmo' },
        { status: 400 }
      );
    }

    const sourceUser = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!sourceUser || sourceUser.balance < amount) {
      return NextResponse.json(
        { error: 'Saldo insuficiente' },
        { status: 400 }
      );
    }

    const [updatedSourceUser] = await prisma.$transaction([
      // Debita do usuário origem
      prisma.user.update({
        where: { id: payload.id },
        data: {
          balance: { decrement: amount },
          sentTransactions: {
            create: {
              type: 'TRANSFER_OUT',
              amount: -amount,
              description: description || 'Transferência enviada',
              toUserId: destinationUser.id
            }
          }
        }
      }),
      // Credita no usuário destino
      prisma.user.update({
        where: { id: destinationUser.id },
        data: {
          balance: { increment: amount },
          receivedTransactions: {
            create: {
              type: 'TRANSFER_IN',
              amount,
              description: description || 'Transferência recebida',
              fromUserId: payload.id
            }
          }
        }
      })
    ]);

    return NextResponse.json({
      balance: updatedSourceUser.balance,
      message: 'Transferência realizada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao processar transferência:', error);
    return NextResponse.json(
      { error: 'Erro ao processar transferência' },
      { status: 500 }
    );
  }
}