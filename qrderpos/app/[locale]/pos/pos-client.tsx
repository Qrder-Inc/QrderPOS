"use client";

// Import page components
import ProductCard from "./components/productCard";
import CheckoutModal from "./components/checkoutModal";
import NavSideBar from "./components/leftSidebar";
import OrderSidebar from "./components/orderSidebar";
import ModifierModal from "./components/modifierModal";

// Import external components and icons
import { Search, Wifi, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Other imports
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Restaurant } from "@/types/restaurant";
import { Menu, Category, MenuItem, OrderItem} from "@/types/menu";
import { OrderType } from "@/types/order";

interface POSClientProps {
    restaurantData: Restaurant;
}

export default function POS({ restaurantData }: POSClientProps) {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [sidebarWidth, setSidebarWidth] = useState(384);
    const [isResizing, setIsResizing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(
        restaurantData.restaurant.menus[0] || null
);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showModifierModal, setShowModifierModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});
    const [orderNotes, setOrderNotes] = useState<string>('');
    const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
    const [orderCode] = useState<string>('ORD');
    const sidebarRef = useRef<HTMLDivElement>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const t = useTranslations('pos');

    const handleItemClick = (item: MenuItem, categoryName: string) => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            handleDoubleClick(item, categoryName);
        } else {
            clickTimeoutRef.current = setTimeout(() => {
                handleSingleClick(item);
                clickTimeoutRef.current = null;
            }, 250);
        }
    };

    const handleSingleClick = (item: MenuItem) => {
        setSelectedItem(item);
        setSelectedModifiers({});
        setOrderNotes('');
        setShowModifierModal(true);
    };

    const handleDoubleClick = (item: MenuItem, categoryName: string) => {
        const defaultModifiers: Record<string, string[]> = {};
        if (item.modifier_groups) {
            item.modifier_groups.forEach(group => {
                if (group.modifiers && group.modifiers.length > 0) {
                    // For required groups, select minimum required options
                    const selectCount = Math.min(group.min_selections, group.modifiers.length);
                    defaultModifiers[group.id] = group.modifiers.slice(0, selectCount).map(m => m.id);
                }
            });
        }
        addItemToOrder(item, defaultModifiers, '', categoryName);
    };

    const calculateItemPrice = (item: MenuItem, modifiers: Record<string, string[]>) => {
        let price = item.price;
        
        if (item.modifier_groups) {
            item.modifier_groups.forEach(group => {
                const selectedModifierIds = modifiers[group.id] || [];
                if (selectedModifierIds.length > 0 && group.modifiers) {
                    selectedModifierIds.forEach(modifierId => {
                        const modifier = group.modifiers!.find(m => m.id === modifierId);
                        if (modifier) {
                            price += modifier.price_adjustment;
                        }
                    });
                }
            });
        }
        
        return price;
    };

    const addItemToOrder = (item: MenuItem, modifiers: Record<string, string[]>, notes: string = '', categoryName: string = '') => {
        setOrderItems(prev => {
            const orderData = { modifiers, notes };
            const orderDataString = JSON.stringify(orderData);
            const itemPrice = calculateItemPrice(item, modifiers);
            
            const existingIndex = prev.findIndex(orderItem => 
                orderItem.id === item.id && 
                orderItem.notes === orderDataString
            );
            
            if (existingIndex >= 0) {
                const newItems = [...prev];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + 1
                };
                return newItems;
            }
            
            return [...prev, { 
                ...item, 
                quantity: 1, 
                notes: orderDataString, 
                categoryName,
                customPrice: itemPrice
            }];
        });
    };

    const handleAddWithModifiers = () => {
        if (selectedItem) {
            const category = selectedMenu?.categories.find(cat => 
                cat.items.some(item => item.id === selectedItem.id)
            );
            addItemToOrder(selectedItem, selectedModifiers, orderNotes, category?.name || '');
            setShowModifierModal(false);
            setSelectedItem(null);
            setSelectedModifiers({});
            setOrderNotes('');
        }
    };

    const handleModifierChange = (groupId: string, modifierId: string) => {
        setSelectedModifiers(prev => {
            const currentSelections = prev[groupId] || [];
            const newSelections = { ...prev };
            
            if (currentSelections.includes(modifierId)) {
                // Remove the modifier
                newSelections[groupId] = currentSelections.filter(id => id !== modifierId);
            } else {
                // Add the modifier
                newSelections[groupId] = [...currentSelections, modifierId];
            }
            
            return newSelections;
        });
    };

    const handleUpdateQuantity = (index: number, change: number) => {
        setOrderItems(prev => {
            const newItems = [...prev];
            const newQuantity = newItems[index].quantity + change;
            
            if (newQuantity <= 0) {
                return prev.filter((_, i) => i !== index);
            }
            
            newItems[index] = { ...newItems[index], quantity: newQuantity };
            return newItems;
        });
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleClearOrder = () => {
        setOrderItems([]);
    };

    const handleCheckout = () => {
        setShowCheckoutModal(true);
    };

    const handleConfirmPayment = (paymentType: string, amountPaid: number) => {
        console.log("Payment confirmed", { paymentType, amountPaid, orderItems });
        setOrderItems([]);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth >= 320 && newWidth <= 600) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    // Get all items from selected menu
    const getAllItems = (): { item: MenuItem; categoryName: string }[] => {
        if (!selectedMenu) return [];

        
        const items: { item: MenuItem; categoryName: string }[] = [];
        

        selectedMenu.categories.forEach(category => {
            category.items.forEach(item => {
                items.push({ item, categoryName: category.name });
            });
        });
        return items;
    };

    // Filter items based on selected category
    const filteredItems = getAllItems().filter(({ categoryName }) => {
        if (!selectedCategory) return true;
        return categoryName === selectedCategory.name;
    });

    return (
        <div className="flex h-screen">
            <NavSideBar />

            {/* Restaurant information Area */}
            <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: '#f5f5f5' }}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Image src="/logo.png"  alt={restaurantData.restaurant.name} width={50} height={50} />
                        <h1 className="text-2xl font-bold">{restaurantData.restaurant.name}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder={t('searchItems')}
                                className="w-full max-w-md pl-10" 
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Wifi className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Menu and Category Selection */}
                <div className="mb-6">
                    <div className="mb-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="text-lg font-semibold hover:text-[#ff8f2e] transition-colors flex items-center gap-1 outline-none">
                                {selectedMenu ? selectedMenu.name : "Select Menu"}
                                <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {restaurantData.restaurant.menus.map((menu) => (
                                    <DropdownMenuItem
                                        key={menu.id}
                                        onClick={() => {
                                            setSelectedMenu(menu);
                                            setSelectedCategory(null);
                                        }}
                                    >
                                        {menu.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Category Tabs */}
                    {selectedMenu && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                    selectedCategory === null
                                        ? 'bg-[#ff8f2e] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                All
                            </button>
                            {selectedMenu.categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        selectedCategory?.id === category.id
                                            ? 'bg-[#ff8f2e] text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main content area for menu items */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map(({ item, categoryName }) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item, categoryName)}
                                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                            >
                                <ProductCard
                                    title={item.name}
                                    category={categoryName}
                                    price={item.price}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resize Handle */}
            <div
                onMouseDown={handleMouseDown}
                className={`w-1 bg-gray-200 hover:bg-[#ff8f2e] cursor-col-resize transition-colors ${
                    isResizing ? 'bg-[#ff8f2e]' : ''
                }`}
            />

            {/* Order Sidebar with dynamic width */}
            <div ref={sidebarRef} style={{ width: `${sidebarWidth}px` }}>
                <OrderSidebar
                    orderItems={orderItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearOrder={handleClearOrder}
                    onCheckout={handleCheckout}
                    orderType={orderType}
                    onOrderTypeChange={setOrderType}
                    orderCode={orderCode}
                />
            </div>

            {/* Modifier Modal */}
            <ModifierModal
                isOpen={showModifierModal}
                onClose={() => setShowModifierModal(false)}
                item={selectedItem}
                modifiers={selectedItem?.modifier_groups || []}
                selectedModifiers={selectedModifiers}
                onModifierChange={handleModifierChange}
                notes={orderNotes}
                onNotesChange={setOrderNotes}
                onAddToOrder={handleAddWithModifiers}
            />

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                total={(() => {
                    const subtotal = orderItems.reduce((sum, item) => {
                        const price = item.customPrice ?? item.price;
                        return sum + (price * item.quantity);
                    }, 0);
                    const serviceFee = orderType === OrderType.DINE_IN ? subtotal * 0.10 : 0;
                    const tax = subtotal * 0.13;
                    return subtotal + serviceFee + tax;
                })()}
                subtotal={orderItems.reduce((sum, item) => {
                    const price = item.customPrice ?? item.price;
                    return sum + (price * item.quantity);
                }, 0)}
                serviceFee={(() => {
                    const subtotal = orderItems.reduce((sum, item) => {
                        const price = item.customPrice ?? item.price;
                        return sum + (price * item.quantity);
                    }, 0);
                    return orderType === OrderType.DINE_IN ? subtotal * 0.10 : 0;
                })()}
                tax={(() => {
                    const subtotal = orderItems.reduce((sum, item) => {
                        const price = item.customPrice ?? item.price;
                        return sum + (price * item.quantity);
                    }, 0);
                    return subtotal * 0.13;
                })()}
                orderItems={orderItems}
                restaurantName={restaurantData.restaurant.name}
                orderCode={orderCode}
                orderType={orderType}
                onConfirmPayment={handleConfirmPayment}
            />
        </div>
    );
}
