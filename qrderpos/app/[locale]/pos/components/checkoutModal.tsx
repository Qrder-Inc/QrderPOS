"use client";

import { useState, useEffect } from "react";
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
  // Payment state
  const [paymentType, setPaymentType] = useState<string>("cash");
  const [amountPaid, setAmountPaid] = useState<string>(total.toFixed(2));
  const [localTotal, setLocalTotal] = useState<number>(total);

  useEffect(() => {
    // Keep amountPaid synced when total changes (e.g., item removed)
    setLocalTotal(total);
    setAmountPaid(total.toFixed(2));
  }, [total]);

  if (!isOpen) return null;

  const amountPaidNum = parseFloat(amountPaid) || 0;
  const change = amountPaidNum - localTotal;

  const paymentTypes = [
    { id: "cash", label: "Cash" },
    { id: "card", label: "Credit/Debit Card" },
    { id: "mobile", label: "Mobile Payment" },
    { id: "other", label: "Other" }
  ];

  const handleConfirm = () => {
    if (amountPaidNum >= localTotal) {
      onConfirmPayment(paymentType, amountPaidNum);
      onClose();
    }
  };

  const handlePrint = () => {
    // Use print stylesheet in globals.css (print-receipt)
    window.print();
  };

  return (
    <>
      {/* ---------------- PRINT-ONLY RECEIPT ---------------- */}
      <div className="print-receipt hidden print:block">
        <div className="text-center mb-4">
          <h1 className="print-title mb-1">{restaurantName}</h1>
          <div className="print-small">Receipt</div>
          <div className="print-small">{new Date().toLocaleString()}</div>
          <div className="mt-1 font-bold print-small">Order: {orderCode}</div>
          <div className="print-small">Type: {orderType}</div>
        </div>

        <div style={{ borderTop: "1px dashed #ddd", margin: "6px 0" }} />

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr className="print-small">
              <th style={{ textAlign: "left" }}>Item</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>

          <tbody>
            {orderItems.map((item, index) => {
              const itemPrice = item.customPrice ?? item.price;
              return (
                <tr key={index} className="print-small">
                  <td style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <div>{item.name}</div>

                    {item.notes && item.notes !== "{}" && (
                      <div className="text-base print-small mt-1">
                        {(() => {
                          try {
                            const orderData = JSON.parse(item.notes);
                            const modifiers = orderData.modifiers || {};
                            const notes = orderData.notes || "";
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
                                {notes && <div style={{ fontStyle: "italic" }}>Note: {notes}</div>}
                              </>
                            );
                          } catch {
                            // if notes is not JSON, print raw text truncated to a line
                            return <div>• {String(item.notes).substring(0, 100)}</div>;
                          }
                        })()}
                      </div>
                    )}
                  </td>

                  <td style={{ textAlign: "center", verticalAlign: "top", paddingTop: 6, paddingBottom: 6 }}>
                    {item.quantity}
                  </td>

                  <td style={{ textAlign: "right", verticalAlign: "top", paddingTop: 6, paddingBottom: 6 }}>
                    ${itemPrice.toFixed(2)}
                  </td>

                  <td style={{ textAlign: "right", verticalAlign: "top", paddingTop: 6, paddingBottom: 6, fontWeight: 600 }}>
                    ${(itemPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ borderTop: "1px dashed #ddd", margin: "6px 0" }} />

        <div className="print-small" style={{ marginTop: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {serviceFee > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Service Fee:</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontWeight: 700 }}>
            <span>Total:</span>
            <span>${localTotal.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #ddd", margin: "6px 0" }} />

        <div className="print-small">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Payment Method:</span>
            <span style={{ textTransform: "capitalize" }}>{paymentType}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Amount Paid:</span>
            <span>${amountPaidNum.toFixed(2)}</span>
          </div>
          {change > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Change:</span>
              <span>${change.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px dashed #ddd", margin: "6px 0" }} />

        <div className="text-center print-small" style={{ marginTop: 8 }}>
          <div>Thank you for your order!</div>
          <div>Please come again</div>
        </div>
      </div>

      {/* ---------------- MODAL UI (HIDDEN DURING PRINT) ---------------- */}
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Total Amount */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
            <div className="text-3xl font-bold text-[#ff8f2e]">${localTotal.toFixed(2)}</div>
          </div>

          {/* Payment Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentTypes.map((type) => (
                <Button
                  key={type.id}
                  onClick={() => setPaymentType(type.id)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    paymentType === type.id ? "bg-[#ff8f2e] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  type="button"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount Paid input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
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
            {amountPaidNum < localTotal && (
              <p className="text-red-500 text-xs mt-1">
                Amount paid must be at least ${localTotal.toFixed(2)}
              </p>
            )}
          </div>

          {/* Change */}
          {change > 0 && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-800">Change</span>
                <span className="text-lg font-bold text-green-600">${change.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>

              <Button
                onClick={handleConfirm}
                disabled={amountPaidNum < localTotal}
                className="flex-1 bg-[#ff8f2e] hover:bg-[#e67e1a] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Payment
              </Button>
            </div>

            <Button variant="outline" onClick={handlePrint} className="w-full flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
