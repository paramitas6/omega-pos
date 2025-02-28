"use client";

import { useState } from 'react';

export default function AddItem() {
  const [barcode, setBarcode] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a full app, process the image upload (e.g., using FormData)
    const formData = { barcode, title, note, price, inventory };
    if (image) {
console.log("image there")
    }
  
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert('Item created!');
      // Optionally reset form fields here
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Barcode" 
          value={barcode} 
          onChange={(e) => setBarcode(e.target.value)} 
          className="w-full p-2 border rounded" 
          required
        />
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full p-2 border rounded" 
          required
        />
        <textarea 
          placeholder="Note" 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          className="w-full p-2 border rounded"
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Price" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          className="w-full p-2 border rounded" 
          required
        />
        <input 
          type="number" 
          placeholder="Inventory" 
          value={inventory} 
          onChange={(e) => setInventory(e.target.value)} 
          className="w-full p-2 border rounded" 
          required
        />
        <input 
          type="file" 
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }} 
          className="w-full"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Add Item
        </button>
      </form>
    </div>
  );
}
