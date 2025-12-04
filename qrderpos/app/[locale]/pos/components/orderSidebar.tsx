"use client";

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// import Types
import { OrderType } from '@/types/order';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  customPrice?: number;
  notes?: string;
}

interface OrderSidebarProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (index: number, change: number) => void;
  onRemoveItem: (index: number) => void;
  onClearOrder: () => void;
  onCheckout: () => void;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  orderCode: string;
}

export default function OrderSidebar({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onCheckout,
  orderType,
  onOrderTypeChange,
  orderCode
}: OrderSidebarProps) {
  const [tableNumber, setTableNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  const subtotal = orderItems.reduce((sum, item) => {
    const price = item.customPrice ?? item.price;
    return sum + (price * item.quantity);
  }, 0);

  const serviceFee = orderType === OrderType.DINE_IN ? subtotal * 0.10 : 0; // 10% service fee for dine-in
  const tax = subtotal * 0.13; // 13% tax
  const total = subtotal + serviceFee + tax;

  return (
    <div className="w-full bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            <div>
              <h2 className="text-md font-semibold">Current Order</h2>
              <div className="text-lg font-mono font-semibold text-[#ff8f2e]">{orderCode}</div>
            </div>
          </div>
          {orderItems.length > 0 && (
            <button
              onClick={onClearOrder}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Order Type Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onOrderTypeChange(OrderType.DINE_IN)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              orderType === OrderType.DINE_IN
                ? 'bg-[#ff8f2e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dine In
          </button>
          <button
            onClick={() => onOrderTypeChange(OrderType.TAKEAWAY)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              orderType === OrderType.TAKEAWAY
                ? 'bg-[#ff8f2e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Takeaway
          </button>
          <button
            onClick={() => onOrderTypeChange(OrderType.DELIVERY)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              orderType === OrderType.DELIVERY
                ? 'bg-[#ff8f2e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivery
          </button>
        </div>

        {/* Conditional Inputs Based on Order Type */}
        <div className="space-y-3">
          {orderType === OrderType.DINE_IN && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Table Number</label>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
              >
                <option value="">Select a table</option>

                {/* 
                Example table numbers 1-20
                TODO: CHANGE IT IN THE FUTURE TO CONNECT TO THE DB
                */}
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num.toString()}>Table {num}</option>
                ))}
              </select>
            </div>
          )}

          {orderType === OrderType.TAKEAWAY && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
              />
            </div>
          )}

          {orderType === OrderType.DELIVERY && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter customer name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {orderItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">No items added yet</p>
            <p className="text-gray-400 text-xs mt-1">Start adding items to create an order</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orderItems.map((item, index) => {
              const itemPrice = item.customPrice ?? item.price;
              return (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">${itemPrice.toFixed(2)} each</p>
                      {/* Display Modifiers and Notes */}
                      {item.notes && item.notes !== '{}' && (
                        <div className="mt-1 text-xs text-gray-600">
                          {(() => {
                            try {
                              const orderData = JSON.parse(item.notes);
                              const modifiers = orderData.modifiers || orderData;
                              const notes = orderData.notes || '';
                              const modifierNames: string[] = [];
                              
                              // Mock modifier data to match the IDs
                              const modifierMap: Record<number, { name: string; options: Record<number, string> }> = {
                                1: { name: "Size", options: { 1: "Small", 2: "Medium", 3: "Large" } },
                                2: { name: "Add-ons", options: { 4: "Extra Cheese", 5: "Bacon", 6: "Avocado" } }
                              };

                              if (typeof modifiers === 'object') {
                                Object.entries(modifiers).forEach(([modifierId, optionId]) => {
                                  const modifier = modifierMap[Number(modifierId)];
                                  if (modifier) {
                                    const optionName = modifier.options[Number(optionId)];
                                    if (optionName) {
                                      modifierNames.push(`${modifier.name}: ${optionName}`);
                                    }
                                  }
                                });
                              }

                              return (modifierNames.length > 0 || notes) ? (
                                <div className="space-y-0.5">
                                  {modifierNames.map((name, i) => (
                                    <div key={i}>• {name}</div>
                                  ))}
                                  {notes && (
                                    <div className="text-gray-500 italic mt-1">Note: {notes}</div>
                                  )}
                                </div>
                              ) : null;
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(index, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold">
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - Totals and Actions */}
      {orderItems.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {orderType === OrderType.DINE_IN && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Service (10%)</span>
                <span className="font-medium">${serviceFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tax (13%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={onCheckout}
              className="w-full bg-[#ff8f2e] hover:bg-[#e67e1a]"
            >
              Checkout - ${total.toFixed(2)}
            </Button>
            <Button 
              variant="outline"
              className="w-full"
            >
              Save Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
