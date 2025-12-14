"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";

import { useTranslations } from "next-intl";

import { OrderItem } from "@/types/menu";
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

  // const t = useTranslations("pos");

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

  // Helper function to render modifiers for receipt
  const renderReceiptModifiers = (item: OrderItem) => {
    if (!item.notes || item.notes === '{}') return null;

    try {
      const orderData = JSON.parse(item.notes);
      const modifiers = orderData.modifiers || {};
      const notes = orderData.notes || '';
      const modifierDisplay: string[] = [];

      // Get all modifier groups from the item
      if (item.modifier_groups) {
        item.modifier_groups.forEach(group => {
          const selectedModifierIds = modifiers[group.id];
          if (selectedModifierIds && Array.isArray(selectedModifierIds) && selectedModifierIds.length > 0 && group.modifiers) {
            // Map each selected modifier ID to its name and price
            const selectedModifierNames = selectedModifierIds
              .map(modifierId => {
                const modifier = group.modifiers!.find(m => m.id === modifierId);
                if (modifier) {
                  const priceText = modifier.price_adjustment !== 0 
                    ? ` (+₡${modifier.price_adjustment.toFixed(2)})`
                    : '';
                  return `${modifier.name}${priceText}`;
                }
                return null;
              })
              .filter(name => name !== null);
            
            if (selectedModifierNames.length > 0) {
              modifierDisplay.push(`${group.title}: ${selectedModifierNames.join(', ')}`);
            }
          }
        });
      }

      return (
        <>
          {modifierDisplay.map((text, i) => (
            <div key={i}>• {text}</div>
          ))}
          {notes && <div style={{ fontStyle: "italic" }}>Note: {notes}</div>}
        </>
      );
    } catch {
      return null;
    }
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
                    <div style={{ fontWeight: 600 }}>{item.name}</div>

                    {item.notes && item.notes !== "{}" && (
                      <div className="text-base print-small mt-1" style={{ color: "#555" }}>
                        {renderReceiptModifiers(item)}
                      </div>
                    )}
                  </td>

                  <td style={{ textAlign: "center", verticalAlign: "top", paddingTop: 6, paddingBottom: 6 }}>
                    {item.quantity}
                  </td>

                  <td style={{ textAlign: "right", verticalAlign: "top", paddingTop: 6, paddingBottom: 6 }}>
                    ₡{itemPrice.toFixed(2)}
                  </td>

                  <td style={{ textAlign: "right", verticalAlign: "top", paddingTop: 6, paddingBottom: 6, fontWeight: 600 }}>
                    ₡{(itemPrice * item.quantity).toFixed(2)}
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
            <span>₡{subtotal.toFixed(2)}</span>
          </div>

          {serviceFee > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Service Fee (10%):</span>
              <span>₡{serviceFee.toFixed(2)}</span>
            </div>
          )}

          {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tax (13%):</span>
            <span>₡{tax.toFixed(2)}</span>
          </div> */}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontWeight: 700, fontSize: "14px" }}>
            <span>Total:</span>
            <span>₡{localTotal.toFixed(2)}</span>
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
            <span>₡{amountPaidNum.toFixed(2)}</span>
          </div>
          {change > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
              <span>Change:</span>
              <span>₡{change.toFixed(2)}</span>
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
          className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Checkout</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-sm text-gray-700">Order Summary</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {orderItems.map((item, index) => {
                const itemPrice = item.customPrice ?? item.price;
                return (
                  <div key={index} className="flex justify-between items-start text-sm pb-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.categoryName && (
                        <div className="text-xs text-gray-400">{item.categoryName}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        ₡{itemPrice.toFixed(2)} × {item.quantity}
                      </div>
                      {/* Display modifiers */}
                      {item.notes && item.notes !== '{}' && (
                        <div className="text-xs text-gray-600 mt-1">
                          {(() => {
                            try {
                              const orderData = JSON.parse(item.notes);
                              const modifiers = orderData.modifiers || {};
                              const notes = orderData.notes || '';
                              const modifierDisplay: string[] = [];

                              if (item.modifier_groups) {
                                item.modifier_groups.forEach(group => {
                                  const selectedModifierId = modifiers[group.id];
                                  if (selectedModifierId && group.modifiers) {
                                    const selectedModifier = group.modifiers.find(m => m.id === selectedModifierId);
                                    if (selectedModifier) {
                                      modifierDisplay.push(`${group.title}: ${selectedModifier.name}`);
                                    }
                                  }
                                });
                              }

                              return (
                                <>
                                  {modifierDisplay.map((text, i) => (
                                    <div key={i}>• {text}</div>
                                  ))}
                                  {notes && <div className="italic text-gray-500">Note: {notes}</div>}
                                </>
                              );
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    <div className="font-semibold ml-4">
                      ₡{(itemPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₡{subtotal.toFixed(2)}</span>
              </div>
              {serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee (10%):</span>
                  <span className="font-medium">₡{serviceFee.toFixed(2)}</span>
                </div>
              )}
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Tax (13%):</span>
                <span className="font-medium">₡{tax.toFixed(2)}</span>
              </div> */}
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-3xl font-bold text-[#ff8f2e]">₡{localTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPaymentType(type.id)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    paymentType === type.id ? "bg-[#ff8f2e] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  type="button"
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Paid input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₡</span>
              <input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
                placeholder="0.00"
              />
            </div>
            {amountPaidNum <= localTotal && (
              <p className="text-red-500 text-xs mt-1">
                Amount paid must be at least ₡{localTotal.toFixed(2)}
              </p>
            )}
          </div>

          {/* Change */}
          {change > 0 && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-800">Change</span>
                <span className="text-lg font-bold text-green-600">₡{change.toFixed(2)}</span>
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