import { NextResponse } from 'next/server'
import db from '@/lib/db';

const PRINT_SERVER_URL = process.env.PRINT_SERVER_URL || 'http://localhost:7070';
const PRINT_API_KEY = process.env.PRINT_API_KEY || 'pos-gamja';

// PATCH endpoint for toggling void/unvoid
export async function PATCH(request: Request) {
  try {
    const { id, void: shouldVoid } = await request.json();
    // Find the transaction
    const transaction = await db.transaction.findUnique({
      where: { id }
    });
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    
    // Update the status based on the flag:
    // If shouldVoid is true, set to "VOIDED"; otherwise, reset to "COMPLETED" (or your desired default)
    const updatedTransaction = await db.transaction.update({
      where: { id },
      data: {
        status: shouldVoid ? "VOIDED" : "COMPLETED"
      },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedTransaction);
    
  } catch (error) {
    console.error("Toggle void error:", error);
    return NextResponse.json({ error: "Failed to update transaction status" }, { status: 500 });
  }
}

// POST, GET, and DELETE remain unchanged

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { items, total, tax, paymentMethod, cashReceived, change } = data;
    
    const transaction = await db.transaction.create({
      data: {
        total,
        tax,
        paymentMethod,
        items: {
          create: items.map((item: { id: string; quantity: number; price: number; title: string; barcode?: string }) => {
            const isSpecialItem = item.id.startsWith('custom-') || item.id.startsWith('tax-included-');
            const itemId = parseInt(item.id);
            return {
              quantity: item.quantity,
              price: item.price,
              title: item.title,
              barcode: item.barcode || null,
              ...(!isSpecialItem && !isNaN(itemId) ? { 
                item: { connect: { id: itemId } } 
              } : {})
            };
          }),
        },
      },
      include: { items: true }
    });

    const printData = {
      transactionId: transaction.id,
      items: transaction.items,
      subtotal: total,
      tax,
      total: total + tax,
      paymentMethod,
      cashReceived: paymentMethod === 'CASH' ? cashReceived : undefined,
      change: paymentMethod === 'CASH' ? change : undefined,
      createdAt: transaction.createdAt
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

    return NextResponse.json(transaction);
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Transaction error:', error.message);
    } else {
      console.error('Transaction error:', error);
    }
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
  })
  return NextResponse.json(transactions)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await db.transaction.delete({
    where: { id }
  })
  return NextResponse.json({ success: true })
}
