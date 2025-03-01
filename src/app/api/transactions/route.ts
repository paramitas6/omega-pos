import { NextResponse } from 'next/server'
import db from '@/lib/db';

const PRINT_SERVER_URL = process.env.PRINT_SERVER_URL || 'http://localhost:7070';
const PRINT_API_KEY = process.env.PRINT_API_KEY || 'pos-gamja';

// PATCH endpoint for toggling void/unvoid
export async function PATCH(request: Request) {
  try {
    const { id, void: shouldVoid } = await request.json();

    const result = await db.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              item: true
            }
          }
        }
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      const newStatus = shouldVoid ? "VOIDED" : "COMPLETED";
      const prevStatus = transaction.status;

      // Handle inventory adjustments
      if (prevStatus !== newStatus) {
        const adjustment = newStatus === "VOIDED" ? 1 : -1;

        for (const tItem of transaction.items) {
          if (tItem.itemId && tItem.item?.inventory !== null) {
            await prisma.item.update({
              where: { id: tItem.itemId },
              data: { 
                inventory: { 
                  increment: adjustment * tItem.quantity 
                } 
              }
            });
          }
        }
      }

      return prisma.transaction.update({
        where: { id },
        data: { status: newStatus },
        include: {
          items: {
            include: {
              item: true
            }
          }
        }
      });
    });

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Toggle void error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update transaction status" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { items, total, tax, paymentMethod, cashReceived, change } = data;

    const result = await db.$transaction(async (prisma) => {
      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          total,
          tax,
          paymentMethod,
          items: {
            create: items.map((item: { 
              id: string; 
              quantity: number; 
              price: number; 
              title: string; 
              barcode?: string;
              taxIncluded?: boolean;
            }) => {
              const isSpecialItem = item.id.startsWith('custom-') || item.id.startsWith('tax-included-');
              const itemId = parseInt(item.id);
              return {
                quantity: item.quantity,
                price: item.price,
                title: item.title,
                barcode: item.barcode || null,
                taxIncluded: item.taxIncluded || false,
                ...(!isSpecialItem && !isNaN(itemId) ? { 
                  item: { connect: { id: itemId } } 
                } : {})
              };
            }),
          },
        },
        include: { 
          items: { 
            include: { 
              item: true 
            } 
          } 
        }
      });

      // Update inventory for regular items
      for (const tItem of transaction.items) {
        if (tItem.itemId && tItem.item?.inventory !== null) {
          await prisma.item.update({
            where: { id: tItem.itemId },
            data: { inventory: { decrement: tItem.quantity } }
          });
        }
      }

      return transaction;
    });

    // Print receipt (fire and forget)
    const printData = {
      transactionId: result.id,
      items: result.items,
      subtotal: total,
      tax,
      total: total + tax,
      paymentMethod,
      cashReceived: paymentMethod === 'CASH' ? cashReceived : undefined,
      change: paymentMethod === 'CASH' ? change : undefined,
      createdAt: result.createdAt
    };

    fetch(`${PRINT_SERVER_URL}/print/receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PRINT_API_KEY
      },
      body: JSON.stringify(printData),
      signal: AbortSignal.timeout(3000)
    }).catch((printError) => {
      console.error('Print request failed:', printError);
    });

    return NextResponse.json(result);
    
  } catch (error: unknown) {
    console.error('Transaction error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create transaction',
        ...(process.env.NODE_ENV === 'development' && error instanceof Error && { stack: error.stack })
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  const transactions = await db.transaction.findMany({
    include: {
      items: {
        include: {
          item: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(transactions);
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.transaction.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete transaction' }, 
      { status: 500 }
    );
  }
}