"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import CatChase from "@/components/CatChase";
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  barcode?: string;
  taxIncluded?: boolean;
}

interface Item {
  id: number;
  barcode: string;
  title: string;
  price: number;
  inventory?: number;
  quickItem: boolean;
  taxIncluded: boolean;
  imageUrl?: string;
}

const TransactionSchema = z
  .object({
    items: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          price: z.number().positive(),
          taxIncluded: z.boolean().optional(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1),
    total: z.number().positive(),
    tax: z.number().nonnegative(),
    paymentMethod: z.enum(["CASH", "CARD"]),
    paid: z.boolean(),
    cashReceived: z.number().nonnegative().optional(),
    change: z.number().nonnegative().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "CASH") {
        return data.cashReceived !== undefined && data.change !== undefined;
      }
      return true;
    },
    {
      message: "Cash payment requires received amount and change",
      path: ["cashReceived"],
    }
  );

export default function Cashier() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcode, setBarcode] = useState("");
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [openCustomItem, setOpenCustomItem] = useState(false);

  const [quickAddItems, setQuickAddItems] = useState<Item[]>([]);
  const [showCashPopup, setShowCashPopup] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [cashChange, setCashChange] = useState(0);
  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    taxIncluded: false,
  });

  const taxRate = 0.13;

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:7071/api/ws");
    wsRef.current = ws;
    ws.onopen = () => console.log("WebSocket connected (Cashier)");
    ws.onerror = (err) => console.error("WebSocket error (Cashier):", err);
    ws.onclose = () => console.log("WebSocket closed (Cashier)");
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "cartUpdate", payload: cart }));
    }
  }, [cart]);

  useEffect(() => {
    const loadQuickItems = async () => {
      try {
        const res = await fetch("/api/quick-items");
        if (res.ok) setQuickAddItems(await res.json());
      } catch (error) {
        console.error("Error loading quick add items", error);
        toast.error("Failed to load quick add items");
      }
    };
    loadQuickItems();
  }, []);

  // Fetch suggestions based on barcode input
  useEffect(() => {
    if (barcode.trim() === "") {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/items?search=${barcode}`);
        if (res.ok) {
          const data: Item[] = await res.json();
          setSuggestions(data);
          // If there's an exact match, auto-add to cart
          const exactMatch = data.find((item) => item.barcode === barcode);
          if (exactMatch) {
            addItemToCart(exactMatch);
            setBarcode("");
            setSuggestions([]);
          }
        }
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    };

    const timeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeout);
  }, [barcode]);

  // Add item to cart (increases quantity if already present)
  const addItemToCart = (item: Item) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((i) => i.id === item.id.toString());
      if (index > -1) {
        const newCart = [...prevCart];
        newCart[index].quantity += 1;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            id: item.id.toString(),
            title: item.title,
            price: item.price,
            quantity: 1,
            barcode: item.barcode,
            taxIncluded: item.taxIncluded,
          },
        ];
      }
    });
  };

  const handleOpenCashDrawer = async () => {
    try {
      const response = await fetch("http://localhost:7070/open/cash-drawer", {
        method: "POST",
        headers: {
          "x-api-key": "pos-gamja", // Match your server API key
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to open drawer");
      toast.success("Cash drawer opened");
    } catch (error) {
      console.error("Cash drawer error:", error);
      toast.error("Failed to open cash drawer");
    }
  };

  // Handler for adding quick add items
  // Handler for adding quick add items
  const handleQuickAdd = (item: Item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id.toString());
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id.toString()
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        );
      } else {
        return [
          ...prevCart,
          {
            id: item.id.toString(),
            title: item.title,
            price: item.price,
            quantity: 1,
            barcode: item.barcode,
            taxIncluded: item.taxIncluded, // Add this line
          },
        ];
      }
    });
  };

  const removeItemFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Handler for adding a custom (flex-priced) item
  const handleAddCustomItem = () => {
    if (!newItem.title || !newItem.price) {
      toast.error("Please fill in both title and price");
      return;
    }

    const price = parseFloat(newItem.price);
    if (isNaN(price) || price < 0) {
      toast.error("Invalid price - must be a positive number");
      return;
    }

    const customItem: CartItem = {
      id: `custom-${Date.now()}`,
      title: newItem.title,
      price: price,
      quantity: 1,
      taxIncluded: newItem.taxIncluded,
    };

    setCart((prev) => [...prev, customItem]);
    setNewItem({ title: "", price: "", taxIncluded: false });
    setOpenCustomItem(false);
    toast.success("Item added to cart");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxableTotal = cart.reduce(
    (sum, item) => (item.taxIncluded ? sum : sum + item.price * item.quantity),
    0
  );
  const tax = taxableTotal * taxRate;
  const grandTotal = subtotal + tax;
  // Handler for completing payment
  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error("Cannot complete payment with an empty cart");
      return;
    }

    if (grandTotal <= 0) {
      toast.error("Invalid total amount. Please add valid items to cart");
      return;
    }

    if (paymentMethod === "CASH") {
      setShowCashPopup(true);
      return;
    }

    await processPayment();
  };

  const processPayment = async () => {
    const transactionData = {
      items: cart,
      total: subtotal,
      tax,
      paymentMethod,
      paid: true,
      ...(paymentMethod === "CASH" && {
        cashReceived: parseFloat(cashReceived),
        change: cashChange,
      }),
    };

    const validation = TransactionSchema.safeParse(transactionData);
    if (!validation.success) {
      toast.error(
        "Invalid transaction data: " +
          JSON.stringify(validation.error.errors, null, 2)
      );
      return;
    }

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      const text = await res.text();
      if (!text) throw new Error("Empty response from server");
      const data = JSON.parse(text);

      if (!res.ok) throw new Error(data.error || "Payment failed");

      toast.success("Transaction recorded!", {
        duration: 5000,
        style: { backgroundColor: "#5ef9ad" },
      });
      setCart([]);
      setShowCashPopup(false);
      setCashReceived("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Payment error: ${error.message}`);
        console.error("Payment Error:", error);
      } else {
        toast.error("Payment error");
        console.error("Payment Error:", error);
      }
    }
  };

  const handleCashConfirmation = () => {
    const received = parseFloat(cashReceived);
    if (isNaN(received)) {
      toast.error("Please enter a valid number for cash received");
      return;
    }

    if (received < grandTotal) {
      toast.error("Amount received cannot be less than total amount");
      return;
    }

    setCashChange(received - grandTotal);
    processPayment();
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">
          Brothers Point of Sale
        </h1>

        {/* Barcode Input */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scan barcode or search item..."
            className="w-full p-4 text-4xl border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-300 bg-white"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className="p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-0 border-slate-100"
                  onClick={() => {
                    addItemToCart(item);
                    setBarcode("");
                    setSuggestions([]);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">{item.title}</span>
                    <span className="text-sm text-slate-500">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  {item.barcode && (
                    <div className="text-xs text-slate-400 mt-1">
                      {item.barcode}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mb-6 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          {cart.length === 0 ? (
            <div className="text-slate-400 h-full flex items-center justify-center">
              Cart is empty
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg group"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-slate-700">{item.title}</h3>
                  {item.barcode && (
                    <div className="text-xs text-slate-400">{item.barcode}</div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-slate-600">x{item.quantity}</div>
                  <div className="w-24 text-right font-medium text-blue-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals and Payment */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600 text-3xl">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (13% HST):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 text-5xl pt-3">
              <span>Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value)}
          >
            <div className="flex items-center justify-between gap-4">
              <Image
                src="/cat/cat3.png" // Ensure this image exists in your public folder
                alt="Decorative cat"
                width={100}
                height={100}
                className="absolute bottom-2 left-48 w-32 z-20  object-cover  hover:rotate-6 transition-transform"
              />
              <div className="flex gap-4">
                <label htmlFor="cash" className="flex items-center gap-2">
                  <RadioGroupItem value="CASH" id="cash" />
                  <span>Cash</span>
                </label>
                <label htmlFor="card" className="flex items-center gap-2">
                  <RadioGroupItem value="CARD" id="card" />
                  <span>Card</span>
                </label>
              </div>
              <button
                onClick={handlePayment}
                className="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Complete Payment - ${grandTotal.toFixed(2)}
              </button>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Cash Payment Popover */}
      <Popover open={showCashPopup} onOpenChange={setShowCashPopup}>
 
        <PopoverContent className="fixed z-50 transform translate-x-40 translate-y-40 w-96 bg-white p-8 rounded-xl shadow-lg text-2xl">

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cash Payment</h3>
            <div className="space-y-2">
              <Label htmlFor="cashReceived">Amount Received</Label>
              <Input
                id="cashReceived"
                type="number"
                value={cashReceived}
                onChange={(e) => {
                  setCashReceived(e.target.value);
                  const received = parseFloat(e.target.value);
                  setCashChange(isNaN(received) ? 0 : received - grandTotal);
                }}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Due:</span>
                <span className="font-medium">${grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Change Due:</span>
                <span className="font-medium text-green-600">
                  ${cashChange.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCashPopup(false);
                  setCashReceived("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCashConfirmation}
                disabled={cashChange < 0}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Quick Add Sidebar */}

      <div className="flex flex-col w-[40%] border-l border-slate-200 p-6 bg-white">
        <h2 className="text-2xl text-center font-semibold text-slate-800 mb-6">
          Quick Add
        </h2>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {quickAddItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleQuickAdd(item)}
                className="group relative p-2 h-40 flex flex-col items-center justify-between rounded-lg bg-green-50 hover:bg-green-100 transition-colors border-2 border-green-100 overflow-hidden"
              >
                {/* Image container */}
                {item.imageUrl && (
                  <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Text content */}
                <div
                  className={`flex-1 flex flex-col justify-center ${
                    item.imageUrl ? "pt-1" : ""
                  }`}
                >
                  <div className="font-medium text-lg text-green-800 line-clamp-2">
                    {item.title}
                  </div>
                  <div className="text-xl text-green-600 font-semibold">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Popover open={openCustomItem} onOpenChange={setOpenCustomItem}>
            <PopoverTrigger asChild>
              <button className="w-full p-6 text-center rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors border-2 border-purple-100">
                <div className="font-medium text-2xl text-purple-800">
                  Add Custom Item
                </div>
                <div className="text-lg text-purple-600">
                  Flexible pricing/tax options
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] space-y-6 p-8">
              <h3 className="font-bold text-3xl mb-6 text-purple-800">
                Add Custom Item
              </h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="title" className="text-2xl">
                    Item Title
                  </Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter item name"
                    className="text-2xl p-6 h-16 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="price" className="text-2xl">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="text-2xl p-6 h-16 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <Checkbox
                    id="taxIncluded"
                    checked={newItem.taxIncluded}
                    onCheckedChange={(checked) =>
                      setNewItem((prev) => ({
                        ...prev,
                        taxIncluded: !!checked,
                      }))
                    }
                    className="w-8 h-8"
                  />
                  <Label htmlFor="taxIncluded" className="text-2xl">
                    Price includes tax
                  </Label>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setOpenCustomItem(false)}
                    className="text-xl px-8 py-6 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCustomItem}
                    className="text-xl px-8 py-6 rounded-xl bg-purple-600 hover:bg-purple-700"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Add Cash Drawer Button Here */}
          <button
            onClick={handleOpenCashDrawer}
            className="w-full p-4 text-center rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border-2 border-blue-100"
          >
            <div className="font-medium text-xl text-blue-800">
              Open Cash Drawer
            </div>
            <div className="text-sm text-blue-600">Manual drawer release</div>
          </button>
        </div>
      </div>
      <CatChase
        imageSrc="/cat/cat5.png"
        size={128}
        stalkSpeed={0.05}
        fleeSpeed={0.3}
      />
    </div>
  );
}
