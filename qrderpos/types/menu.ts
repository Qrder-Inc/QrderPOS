// types/menu.ts
export interface Menu {
  id: string;
  name: string;
  categories: Category[];
}
export interface Category {
    id: string;
    name: string;
    items: MenuItem[];
    description: string;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    modifier_groups: ModifierGroup[] | null;
}

export interface ModifierGroup {
    id: string;
    title: string;
    modifiers: Modifier[] | null;
    is_required: boolean;
    max_selections: number;
    min_selections: number;
}

export interface Modifier {
    id: string;
    name: string;
    price_adjustment: number;
}
export interface OrderItem extends MenuItem {
    quantity: number;
    customPrice?: number;
    notes?: string;
    categoryName?: string;
}

// For order items with selected modifiers
export interface SelectedModifier {
  modifier_group_id: string;
  modifier_ids: string[]; // Array to support multiple selections
}

// Helper function to calculate item price with modifiers
export function calculateItemPrice(
  basePrice: number,
  modifierGroups: ModifierGroup[] | null,
  selectedModifiers: SelectedModifier[]
): number {
  if (!modifierGroups) return basePrice;

  let totalAdjustment = 0;

  selectedModifiers.forEach(({ modifier_group_id, modifier_ids }) => {
    const group = modifierGroups.find(g => g.id === modifier_group_id);
    if (!group || !group.modifiers) return;

    modifier_ids.forEach(modifierId => {
      const modifier = group.modifiers!.find(m => m.id === modifierId);
      if (modifier) {
        totalAdjustment += modifier.price_adjustment;
      }
    });
  });

  return basePrice + totalAdjustment;
}

// Helper function to validate modifier selections
export function validateModifierSelections(
  modifierGroups: ModifierGroup[] | null,
  selectedModifiers: SelectedModifier[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!modifierGroups) {
    return { isValid: true, errors: [] };
  }

  modifierGroups.forEach(group => {
    const selection = selectedModifiers.find(s => s.modifier_group_id === group.id);
    const selectedCount = selection?.modifier_ids.length || 0;

    if (group.is_required && selectedCount < group.min_selections) {
      errors.push(`${group.title} requires at least ${group.min_selections} selection(s)`);
    }

    if (selectedCount > group.max_selections) {
      errors.push(`${group.title} allows maximum ${group.max_selections} selection(s)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// // Helper to get default modifiers for an item
// export function getDefaultModifiers(item: MenuItem): SelectedModifier[] {
//   if (!item.modifier_groups) return [];

//   return item.modifier_groups
//     .map(group => {
//       if (!group.modifiers) return null;

//       // Find default modifiers
//       const defaultModifiers = group.modifiers
//         .filter(m => m.is_default)
//         .map(m => m.id);

//       // If no defaults and group is required, select first option up to min_selections
//       if (defaultModifiers.length === 0 && group.is_required) {
//         const firstOptions = group.modifiers
//           .slice(0, group.min_selections)
//           .map(m => m.id);
        
//         if (firstOptions.length > 0) {
//           return {
//             modifier_group_id: group.id,
//             modifier_ids: firstOptions
//           };
//         }
//       }

//       if (defaultModifiers.length > 0) {
//         return {
//           modifier_group_id: group.id,
//           modifier_ids: defaultModifiers
//         };
//       }

//       return null;
//     })
//     .filter((s): s is SelectedModifier => s !== null);
// }