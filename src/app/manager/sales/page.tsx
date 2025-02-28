"use client"

import { useState, useEffect } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Printer, Ban } from "lucide-react"

interface TransactionItem {
  id: number
  quantity: number
  price: number
  title: string
  barcode?: string
  item?: {
    id: number
    title: string
  }
}

interface Transaction {
  id: number
  createdAt: Date
  total: number
  tax: number
  paymentMethod: string
  status: "COMPLETED" | "VOIDED" | "PENDING"
  receiptId?: string
  items: TransactionItem[]
}

const PRINT_SERVER_URL = process.env.NEXT_PUBLIC_PRINT_SERVER_URL || 'http://localhost:7070';
const PRINT_API_KEY = process.env.NEXT_PUBLIC_PRINT_API_KEY || 'pos-gamja';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Toggle void/unvoid
  const handleToggleVoid = async (transaction: Transaction) => {
    const isVoided = transaction.status === "VOIDED";
    const confirmMessage = isVoided
      ? "This will unvoid the transaction. Continue?"
      : "This will void the transaction and restore inventory. Continue?";
    if (confirm(confirmMessage)) {
      try {
        await fetch('/api/transactions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: transaction.id, void: !isVoided })
        });
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error('Toggle void failed:', error);
        alert('Failed to update transaction status');
      }
    }
  };

  const handleReprint = async (transaction: Transaction) => {
    try {
      const printData = {
        transactionId: transaction.id,
        items: transaction.items,
        subtotal: transaction.total - transaction.tax,
        tax: transaction.tax,
        total: transaction.total,
        paymentMethod: transaction.paymentMethod,
        createdAt: transaction.createdAt
      };

      const response = await fetch(`${PRINT_SERVER_URL}/print/receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": PRINT_API_KEY
        },
        body: JSON.stringify(printData)
      });

      if (!response.ok) throw new Error('Print failed');
      alert('Receipt reprint triggered successfully!');
    } catch (error) {
      console.error('Reprint error:', error);
      alert('Failed to trigger reprint');
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleReprint(transaction)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Printer className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => handleToggleVoid(transaction)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Ban className={`w-5 h-5 ${transaction.status === "VOIDED" ? "text-green-500" : "text-red-500"}`} />
            </button>
          </div>
        )
      }
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => `$${row.getValue<number>("total").toFixed(2)}`
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => (
        <Badge className="text-sm bg-blue-100 text-blue-800">
          {row.getValue("paymentMethod")}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <Badge 
            className={status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                      status === "VOIDED" ? "bg-red-100 text-red-800" : 
                      "bg-slate-100 text-slate-800"}
          >
            {status as string}
          </Badge>
        )
      }
    },
    {
      id: "items",
      header: "Items",
      cell: ({ row }) => (
        <div className="space-y-1">
          {row.original.items.map(item => (
            <div key={item.id} className="text-sm text-slate-600">
              {item.quantity}x {item.title}
              <span className="text-slate-400 ml-2">(${item.price.toFixed(2)})</span>
            </div>
          ))}
        </div>
      )
    }
  ]

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data))
  }, [])

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Transaction History</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id}
                        className="px-6 py-4 text-left text-slate-600 font-semibold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => {
                    const transaction = row.original;
                    return (
                      <tr 
                        key={row.id}
                        className={
                          transaction.status === "VOIDED"
                            ? "bg-red-50 hover:bg-red-100 transition-colors"
                            : "hover:bg-slate-50 transition-colors"
                        }
                      >
                        {row.getVisibleCells().map(cell => (
                          <td 
                            key={cell.id}
                            className="px-6 py-4 text-sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="p-12 text-center text-slate-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
