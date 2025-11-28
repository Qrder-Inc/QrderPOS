"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    customPrice?: number;
    notes?: string;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    subtotal: number;
    tax: number;
    serviceFee: number;
    orderItems: OrderItem[];
    restaurantName: string;
    orderCode: string;
    orderType: string;
    onConfirmPayment: (paymentType: string, amountPaid: number) => void;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    total,
    subtotal,
    tax,
    serviceFee,
    orderItems,
    restaurantName,
    orderCode,
    orderType,
    onConfirmPayment
}: CheckoutModalProps) {
    const [paymentType, setPaymentType] = useState<string>("cash");
    const [amountPaid, setAmountPaid] = useState<string>(total.toFixed(2));

    if (!isOpen) return null;

    const amountPaidNum = parseFloat(amountPaid) || 0;
    const change = amountPaidNum - total;

    const handleConfirm = () => {
        if (amountPaidNum >= total) {
            onConfirmPayment(paymentType, amountPaidNum);
            onClose();
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const paymentTypes = [
        { id: "cash", label: "Cash" },
        { id: "card", label: "Credit/Debit Card" },
        { id: "mobile", label: "Mobile Payment" },
        { id: "other", label: "Other" }
    ];

    return (
        <>
            {/* Print-only receipt */}
            <div className="hidden print:block print:p-8">
                <style jsx global>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print-receipt, .print-receipt * {
                            visibility: visible;
                        }
                        .print-receipt {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}</style>
                <div className="print-receipt max-w-md mx-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">{restaurantName}</h1>
                        <p className="text-sm text-gray-600">Receipt</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</p>
                        <p className="text-sm font-mono font-semibold mt-2">Order: {orderCode}</p>
                        <p className="text-sm text-gray-600">Type: {orderType}</p>
                    </div>

                    <div className="border-t-2 border-b-2 border-dashed border-gray-300 py-4 mb-4">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="pb-2">Item</th>
                                    <th className="pb-2 text-center">Qty</th>
                                    <th className="pb-2 text-right">Price</th>
                                    <th className="pb-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item, index) => {
                                    const itemPrice = item.customPrice ?? item.price;
                                    return (
                                        <tr key={index} className="text-sm">
                                            <td className="py-1">
                                                {item.name}
                                                {item.notes && item.notes !== '{}' && (
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {(() => {
                                                            try {
                                                                const orderData = JSON.parse(item.notes);
                                                                const modifiers = orderData.modifiers || {};
                                                                const notes = orderData.notes || '';
                                                                const modifierNames: string[] = [];
                                                                
                                                                const modifierMap: Record<number, { name: string; options: Record<number, string> }> = {
                                                                    1: { name: "Size", options: { 1: "Small", 2: "Medium", 3: "Large" } },
                                                                    2: { name: "Add-ons", options: { 4: "Extra Cheese", 5: "Bacon", 6: "Avocado" } }
                                                                };

                                                                Object.entries(modifiers).forEach(([modifierId, optionId]) => {
                                                                    const modifier = modifierMap[Number(modifierId)];
                                                                    if (modifier) {
                                                                        const optionName = modifier.options[Number(optionId)];
                                                                        if (optionName) {
                                                                            modifierNames.push(`${modifier.name}: ${optionName}`);
                                                                        }
                                                                    }
                                                                });

                                                                return (
                                                                    <>
                                                                        {modifierNames.map((name, i) => (
                                                                            <div key={i}>• {name}</div>
                                                                        ))}
                                                                        {notes && <div className="italic">Note: {notes}</div>}
                                                                    </>
                                                                );
                                                            } catch {
                                                                return null;
                                                            }
                                                        })()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-1 text-center">{item.quantity}</td>
                                            <td className="py-1 text-right">${itemPrice.toFixed(2)}</td>
                                            <td className="py-1 text-right font-medium">${(itemPrice * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {serviceFee > 0 && (
                            <div className="flex justify-between text-sm">
                                <span>Service Fee (10%):</span>
                                <span>${serviceFee.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span>Tax (13%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-300">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-1 mb-4 text-sm">
                        <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-medium capitalize">{paymentType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Amount Paid:</span>
                            <span className="font-medium">${amountPaidNum.toFixed(2)}</span>
                        </div>
                        {change > 0 && (
                            <div className="flex justify-between">
                                <span>Change:</span>
                                <span className="font-medium">${change.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t-2 border-dashed border-gray-300 pt-4 text-center">
                        <p className="text-sm">Thank you for your order!</p>
                        <p className="text-xs text-gray-500 mt-1">Please come again</p>
                    </div>
                </div>
            </div>

            {/* Modal UI */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 print:hidden"
                onClick={onClose}
            >
            <div 
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Checkout</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Total Amount */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                    <div className="text-3xl font-bold text-[#ff8f2e]">${total.toFixed(2)}</div>
                </div>

                {/* Payment Type Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                        {paymentTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setPaymentType(type.id)}
                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    paymentType === type.id
                                        ? 'bg-[#ff8f2e] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount Paid Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount Paid
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
                            placeholder="0.00"
                        />
                    </div>
                    {amountPaidNum < total && (
                        <p className="text-red-500 text-xs mt-1">Amount paid must be at least ${total.toFixed(2)}</p>
                    )}
                </div>

                {/* Change Display */}
                {change > 0 && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-green-800">Change</span>
                            <span className="text-lg font-bold text-green-600">${change.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={amountPaidNum < total}
                            className="flex-1 bg-[#ff8f2e] hover:bg-[#e67e1a] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Confirm Payment
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Print Receipt
                    </Button>
                </div>
            </div>
        </div>
        </>
    );
}
