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
import { OrderType } from "@/types/order";
import { useTranslations } from "next-intl";


const POSPageInfo = {
    restaurantName: "ACME Restaurant",
    restaurantLogo: "/logo.png"
}

interface Menu {
    id: number;
    name: string;
    categories: string[];
}

const MOCK_MENUS: Menu[] = [
    { id: 1, name: "Lunch Menu", categories: ["Burgers", "Salads", "Appetizers", "Drinks"] },
    { id: 2, name: "Dinner Menu", categories: ["Pizza", "Pasta", "Seafood", "Mains", "Desserts"] },
    { id: 3, name: "Late Night Menu", categories: ["Mexican", "Appetizers", "Drinks"] },
];

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
}

interface Modifier {
    id: number;
    name: string;
    options: ModifierOption[];
}

interface ModifierOption {
    id: number;
    name: string;
    priceChange: number;
}

const MOCK_MODIFIERS: Modifier[] = [
    {
        id: 1,
        name: "Size",
        options: [
            { id: 1, name: "Small", priceChange: -2 },
            { id: 2, name: "Medium", priceChange: 0 },
            { id: 3, name: "Large", priceChange: 3 },
        ]
    },
    {
        id: 2,
        name: "Add-ons",
        options: [
            { id: 4, name: "Extra Cheese", priceChange: 1.5 },
            { id: 5, name: "Bacon", priceChange: 2 },
            { id: 6, name: "Avocado", priceChange: 2.5 },
        ]
    },
];

const MOCK_PRODUCTS: MenuItem[] = [
    { id: 1, name: "Classic Burger", price: 12.99, category: "Burgers" },
    { id: 2, name: "Cheese Pizza", price: 14.99, category: "Pizza" },
    { id: 3, name: "Caesar Salad", price: 9.99, category: "Salads" },
    { id: 4, name: "Chicken Wings", price: 11.99, category: "Appetizers" },
    { id: 5, name: "Spaghetti Carbonara", price: 13.99, category: "Pasta" },
    { id: 6, name: "Fish & Chips", price: 15.99, category: "Seafood" },
    { id: 7, name: "Margarita", price: 8.99, category: "Drinks" },
    { id: 8, name: "Chocolate Cake", price: 6.99, category: "Desserts" },
    { id: 9, name: "BBQ Ribs", price: 18.99, category: "Mains" },
    { id: 10, name: "Greek Salad", price: 10.99, category: "Salads" },
    { id: 11, name: "Pepperoni Pizza", price: 15.99, category: "Pizza" },
    { id: 12, name: "Tacos", price: 9.99, category: "Mexican" },
];

interface OrderItem extends MenuItem {
    quantity: number;
    customPrice?: number;
    notes?: string;
}

export default function POSPage() {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [sidebarWidth, setSidebarWidth] = useState(384); // 96 * 4 = 384px (w-96)
    const [isResizing, setIsResizing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(MOCK_MENUS[0]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showModifierModal, setShowModifierModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [selectedModifiers, setSelectedModifiers] = useState<Record<number, number>>({});
    const [orderNotes, setOrderNotes] = useState<string>('');
    const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
    const [orderCode] = useState<string>('ORD');
    const sidebarRef = useRef<HTMLDivElement>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const t = useTranslations('pos');

    const handleItemClick = (item: MenuItem) => {
        if (clickTimeoutRef.current) {
            // Double click detected
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            handleDoubleClick(item);
        } else {
            // Wait to see if it's a double click
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

    const handleDoubleClick = (item: MenuItem) => {
        // Set default modifiers (first option from each modifier group)
        const defaultModifiers: Record<number, number> = {};
        MOCK_MODIFIERS.forEach(modifier => {
            if (modifier.options.length > 0) {
                defaultModifiers[modifier.id] = modifier.options[0].id;
            }
        });
        addItemToOrder(item, defaultModifiers);
    };

    const addItemToOrder = (item: MenuItem, modifiers: Record<number, number>, notes: string = '') => {
        setOrderItems(prev => {
            const orderData = { modifiers, notes };
            const orderDataString = JSON.stringify(orderData);
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
            
            return [...prev, { ...item, quantity: 1, notes: orderDataString }];
        });
    };

    const handleAddWithModifiers = () => {
        if (selectedItem) {
            addItemToOrder(selectedItem, selectedModifiers, orderNotes);
            setShowModifierModal(false);
            setSelectedItem(null);
            setSelectedModifiers({});
            setOrderNotes('');
        }
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
        // Here you would typically send the order to your backend
        // For now, we'll just clear the order
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

    return (
        <div className="flex h-screen">
            <NavSideBar />

            {/* Restaurant information Area */}
            <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: '#f5f5f5' }}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Image src={POSPageInfo.restaurantLogo} alt={POSPageInfo.restaurantName} width={50} height={50} />
                        <h1 className="text-2xl font-bold">{POSPageInfo.restaurantName}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder={t('searchItems')}
                                className="w-full max-w-md pl-10" 
                            />
                        </div>
                        {/* Internet Connection Icon */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Wifi className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Menu and Category Selection */}
                <div className="mb-6">
                    {/* Menu Selection - Text-like Dropdown */}
                    <div className="mb-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="text-lg font-semibold hover:text-[#ff8f2e] transition-colors flex items-center gap-1 outline-none">
                                {selectedMenu ? selectedMenu.name : "Select Menu"}
                                <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {MOCK_MENUS.map((menu) => (
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
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-[#ff8f2e] text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main content area for menu items */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {MOCK_PRODUCTS
                            .filter((product) => {
                                if (!selectedMenu) return true;
                                if (!selectedMenu.categories.includes(product.category)) return false;
                                if (selectedCategory && product.category !== selectedCategory) return false;
                                return true;
                            })
                            .map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleItemClick(product)}
                                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                            >
                                <ProductCard
                                    title={product.name}
                                    category={product.category}
                                    price={product.price}
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
                modifiers={MOCK_MODIFIERS}
                selectedModifiers={selectedModifiers}
                onModifierChange={(modifierId, optionId) => {
                    setSelectedModifiers(prev => ({
                        ...prev,
                        [modifierId]: optionId
                    }));
                }}
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
                restaurantName={POSPageInfo.restaurantName}
                orderCode={orderCode}
                orderType={orderType}
                onConfirmPayment={handleConfirmPayment}
            />
        </div>
    );
}