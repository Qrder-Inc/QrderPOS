"use client";

import { Button } from "@/components/ui/button";

interface ModifierOption {
    id: number;
    name: string;
    priceChange: number;
}

interface Modifier {
    id: number;
    name: string;
    options: ModifierOption[];
}

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
}

interface ModifierModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MenuItem | null;
    modifiers: Modifier[];
    selectedModifiers: Record<number, number>;
    onModifierChange: (modifierId: number, optionId: number) => void;
    notes: string;
    onNotesChange: (notes: string) => void;
    onAddToOrder: () => void;
}

export default function ModifierModal({
    isOpen,
    onClose,
    item,
    modifiers,
    selectedModifiers,
    onModifierChange,
    notes,
    onNotesChange,
    onAddToOrder
}: ModifierModalProps) {
    if (!isOpen || !item) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">{item.name}</h2>
                <p className="text-gray-600 mb-6">Customize your order</p>

                <div className="space-y-4 mb-6">
                    {modifiers.map((modifier) => (
                        <div key={modifier.id}>
                            <h3 className="font-medium mb-2">{modifier.name}</h3>
                            <div className="space-y-2">
                                {modifier.options.map((option) => (
                                    <label
                                        key={option.id}
                                        className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`modifier-${modifier.id}`}
                                                checked={selectedModifiers[modifier.id] === option.id}
                                                onChange={() => onModifierChange(modifier.id, option.id)}
                                                className="w-4 h-4 text-[#ff8f2e] focus:ring-[#ff8f2e]"
                                            />
                                            <span className="text-sm">{option.name}</span>
                                        </div>
                                        {option.priceChange !== 0 && (
                                            <span className="text-sm text-gray-600">
                                                {option.priceChange > 0 ? '+' : ''}${option.priceChange.toFixed(2)}
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Notes Section */}
                    <div>
                        <h3 className="font-medium mb-2">Special Instructions</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Add any special instructions or notes..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e] resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onAddToOrder}
                        className="flex-1 bg-[#ff8f2e] hover:bg-[#e67e1a]"
                    >
                        Add to Order
                    </Button>
                </div>
            </div>
        </div>
    );
}
