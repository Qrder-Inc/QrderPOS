"use client";

import { Button } from "@/components/ui/button";
import { MenuItem, ModifierGroup } from "@/types/menu";

interface ModifierModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MenuItem | null;
    modifiers: ModifierGroup[];
    selectedModifiers: Record<string, string[]>;
    onModifierChange: (modifierId: string, optionId: string) => void;
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

    // Calculate total price with modifiers
    const calculateTotalPrice = () => {
        let total = item.price;
        
        modifiers.forEach(group => {
            const selectedModifierIds = selectedModifiers[group.id] || [];
            if (selectedModifierIds.length > 0 && group.modifiers) {
                selectedModifierIds.forEach(modifierId => {
                    const selectedModifier = group.modifiers!.find(m => m.id === modifierId);
                    if (selectedModifier) {
                        total += selectedModifier.price_adjustment;
                    }
                });
            }
        });
        
        return total;
    };

    // Check if all required modifier groups have valid selections
    const canAddToOrder = () => {
        return modifiers.every(group => {
            const selectedCount = (selectedModifiers[group.id] || []).length;
            
            // Check minimum selections
            if (selectedCount < group.min_selections) {
                return false;
            }
            
            return true;
        });
    };

    // Handle modifier selection/deselection
    const handleModifierToggle = (groupId: string, modifierId: string, maxSelections: number) => {
        const currentSelections = selectedModifiers[groupId] || [];
        
        if (currentSelections.includes(modifierId)) {
            // Deselect
            onModifierChange(groupId, modifierId);
        } else {
            // For radio buttons (max_selections = 1), replace the current selection
            if (maxSelections === 1 && currentSelections.length > 0) {
                // First deselect the current selection
                onModifierChange(groupId, currentSelections[0]);
            }
            // Select the new option (if under max or replacing for radio)
            if (currentSelections.length < maxSelections || maxSelections === 1) {
                onModifierChange(groupId, modifierId);
            }
        }
    };

    // Get validation message for a group
    const getGroupValidationMessage = (group: ModifierGroup) => {
        const selectedCount = (selectedModifiers[group.id] || []).length;
        
        if (selectedCount < group.min_selections) {
            return `Please select at least ${group.min_selections} option${group.min_selections > 1 ? 's' : ''}`;
        }
        
        return null;
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Item Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <p className="text-lg font-semibold text-[#ff8f2e]">₡{item.price.toFixed(2)}</p>
                </div>

                {/* Modifier Groups */}
                {modifiers && modifiers.length > 0 && (
                    <div className="space-y-6 mb-6">
                        {modifiers.map((group) => {
                            const selectedCount = (selectedModifiers[group.id] || []).length;
                            const validationMessage = getGroupValidationMessage(group);
                            const isSingleSelection = group.max_selections === 1;
                            
                            return (
                                <div key={group.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-base">{group.title}</h3>
                                        <div className="flex items-center gap-2">
                                            {group.is_required && (
                                                <span className="text-xs text-red-500 font-medium">Required</span>
                                            )}
                                            <span className="text-xs text-gray-500">
                                                ({selectedCount}/{group.max_selections})
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Selection Info */}
                                    <p className="text-xs text-gray-500 mb-2">
                                        {group.min_selections === group.max_selections 
                                            ? `Select exactly ${group.min_selections}` 
                                            : `Select ${group.min_selections} to ${group.max_selections}`}
                                    </p>

                                    {/* Validation Message */}
                                    {validationMessage && (
                                        <p className="text-xs text-red-500 mb-2 font-medium">
                                            {validationMessage}
                                        </p>
                                    )}

                                    {/* Modifier Options */}
                                    {group.modifiers && group.modifiers.length > 0 ? (
                                        <div className="space-y-2">
                                            {group.modifiers.map((modifier) => {
                                                const isSelected = (selectedModifiers[group.id] || []).includes(modifier.id);
                                                // For radio buttons (single selection), don't disable other options
                                                const isMaxReached = !isSingleSelection && selectedCount >= group.max_selections && !isSelected;
                                                
                                                return (
                                                    <label
                                                        key={modifier.id}
                                                        className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                                                            isSelected
                                                                ? 'border-[#ff8f2e] bg-orange-50'
                                                                : isMaxReached
                                                                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                                                : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type={isSingleSelection ? "radio" : "checkbox"}
                                                                name={isSingleSelection ? `modifier-${group.id}` : undefined}
                                                                checked={isSelected}
                                                                disabled={isMaxReached}
                                                                onChange={() => handleModifierToggle(group.id, modifier.id, group.max_selections)}
                                                                className="w-4 h-4 text-[#ff8f2e] focus:ring-[#ff8f2e]"
                                                            />
                                                            <span className="text-sm font-medium">{modifier.name}</span>
                                                        </div>
                                                        {modifier.price_adjustment !== 0 && (
                                                            <span className={`text-sm font-semibold ${
                                                                modifier.price_adjustment > 0 ? 'text-[#ff8f2e]' : 'text-green-600'
                                                            }`}>
                                                                {modifier.price_adjustment > 0 ? '+' : ''}
                                                                ₡{Math.abs(modifier.price_adjustment).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No options available</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Special Instructions */}
                <div className="mb-6">
                    <h3 className="font-medium mb-2">Special Instructions</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="Add any special instructions or notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8f2e] resize-none"
                        rows={3}
                    />
                </div>

                {/* Total Price Display */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Price</span>
                        <span className="text-xl font-bold text-[#ff8f2e]">
                            ₡{calculateTotalPrice().toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
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
                        disabled={!canAddToOrder()}
                        className="flex-1 bg-[#ff8f2e] hover:bg-[#e67e1a] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Add to Order
                    </Button>
                </div>

                {/* Validation Message */}
                {!canAddToOrder() && (
                    <p className="text-xs text-red-500 text-center mt-2">
                        Please complete all required selections
                    </p>
                )}
            </div>
        </div>
    );
}