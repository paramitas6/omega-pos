"use client";

import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  barcode?: string;
  taxIncluded?: boolean;
}

export default function CustomerDisplay() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [prevCartLength, setPrevCartLength] = useState(0);
    const [highlightNewItem, setHighlightNewItem] = useState(false);
    const [customerTotal, setCustomerTotal] = useState(0);
    const taxRate = 0.13;

  // Connect to the WebSocket server
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:7071/api/ws");
    ws.onopen = () =>
      console.log("WebSocket connected (Customer Display)");
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "cartUpdate") {
          setCart(message.payload);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    ws.onerror = (err) =>
      console.error("WebSocket error (Customer Display):", err);
    return () => {
      ws.close();
    };
  }, []);

  // Calculate totals safely
  const calculateTotals = () => {
    try {
      const validCart = Array.isArray(cart) ? cart : [];
      
      // Calculate regular and tax-included totals
      const { subtotal, taxableSubtotal } = validCart.reduce((acc, item) => {
        const price = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 0;
        const total = price * quantity;
        
        return {
          subtotal: acc.subtotal + total,
          taxableSubtotal: item.taxIncluded 
            ? acc.taxableSubtotal 
            : acc.taxableSubtotal + total
        };
      }, { subtotal: 0, taxableSubtotal: 0 });

      const tax = taxableSubtotal * taxRate;
      const total = subtotal + tax;

      return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2))
      };
    } catch (error) {
      console.error("Error calculating totals:", error);
      return { subtotal: 0, tax: 0, total: 0 };
    }
  };

  const { subtotal, tax, total } = calculateTotals();


  useEffect(() => {
    try {
      const currentCartLength = Array.isArray(cart) ? cart.length : 0;
      if (currentCartLength > prevCartLength) {
        setHighlightNewItem(true);
        setTimeout(() => setHighlightNewItem(false), 1000);
      }
      setPrevCartLength(currentCartLength);
      setCustomerTotal(Number(total));
    } catch (error) {
      console.error("Error in cart animation effect:", error);
    }
  }, [cart, total, prevCartLength]);

  const renderCartItems = () => {
    if (!Array.isArray(cart)) return null;
    return cart.map((item, index) => {
      const safeItem = {
        id: item?.id || `unknown-${index}`,
        title: item?.title || "Unknown Item",
        price: Number(item?.price) || 0,
        quantity: Number(item?.quantity) || 0,
        barcode: item?.barcode,
        taxIncluded: item?.taxIncluded || false
      };

      return (
        <div
          key={safeItem.id + index}
          className="flex justify-between items-center bg-gray-800 p-6 rounded-lg"
        >
          <div className="flex-1">
            <h3 className="text-3xl font-semibold">
              {safeItem.title}
              {safeItem.taxIncluded && (
                <span className="ml-2 text-sm text-gray-400">
                  (Tax Included)
                </span>
              )}
            </h3>
            {safeItem.barcode && (
              <p className="text-gray-400 text-xl mt-1">
                SKU: {safeItem.barcode}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl">x{safeItem.quantity}</p>
            <p className="text-3xl text-green-400 font-bold">
              ${(safeItem.price * safeItem.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-screen bg-gray-900 text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-8">
        Brothers Convenience 🍬 
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        <div
          className={`space-y-4 transition-opacity duration-500 ${
            highlightNewItem ? "animate-pulse-fast" : ""
          }`}
        >
          {cart?.length ? (
            renderCartItems()
          ) : (
            <div className="text-center py-12 text-2xl text-gray-500">
              No items in cart
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 pt-6 mt-8">
          <div className="flex justify-between text-3xl mb-4">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-3xl mb-4">
            <span>Tax (13%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-4xl font-bold text-green-400">
            <span>Total:</span>
            <span>${customerTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}