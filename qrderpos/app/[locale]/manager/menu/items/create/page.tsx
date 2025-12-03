"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Upload, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for categories
const mockCategories = [
    { id: 1, name: "Bebidas" },
    { id: 2, name: "Platos Principales" },
    { id: 3, name: "Postres" },
    { id: 4, name: "Entradas" },
    { id: 5, name: "Ensaladas" },
];

// Mock data for modifiers
const mockModifiers = [
    { id: 1, name: "Extra Queso" },
    { id: 2, name: "Sin Cebolla" },
    { id: 3, name: "Picante" },
    { id: 4, name: "Con Aguacate" },
    { id: 5, name: "Doble Porción" },
    { id: 6, name: "Sin Gluten" },
];

export default function CreateMenuItemPage() {
    const router = useRouter();
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [includesIVA, setIncludesIVA] = useState(false);
    const [itemDescription, setItemDescription] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedModifiers, setSelectedModifiers] = useState<number[]>([]);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleModifierToggle = (modifierId: number) => {
        setSelectedModifiers(prev =>
            prev.includes(modifierId)
                ? prev.filter(id => id !== modifierId)
                : [...prev, modifierId]
        );
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        setPhotoPreview("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            name: itemName,
            price: itemPrice,
            includesIVA: includesIVA,
            description: itemDescription,
            categories: selectedCategories,
            modifiers: selectedModifiers,
            photo: photo,
        });
        // Reset form
        setItemName("");
        setItemPrice("");
        setIncludesIVA(false);
        setItemDescription("");
        setSelectedCategories([]);
        setSelectedModifiers([]);
        setPhoto(null);
        setPhotoPreview("");
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Create Button */}
            <div className="">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <Button type="submit" form="item-form" disabled={!itemName.trim() || !itemPrice}>
                        Crear Item
                    </Button>
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Item</h1>
                <p className="text-muted-foreground mt-2">
                    Completa el formulario para agregar un nuevo artículo al menú.
                </p>
            </div>

            {/* Form */}
            <div className="max-w-3xl">
                <form id="item-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Item Name */}
                        <div className="space-y-2">
                            <Label htmlFor="item-name">
                                Nombre del Item *
                            </Label>
                            <Input
                                id="item-name"
                                placeholder="Ej: Café Americano, Hamburguesa..."
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-3">
                            <Label htmlFor="item-price">
                                Precio *
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="item-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={itemPrice}
                                    onChange={(e) => setItemPrice(e.target.value)}
                                    className="pl-7"
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="includes-iva"
                                    checked={includesIVA}
                                    onCheckedChange={setIncludesIVA}
                                />
                                <Label htmlFor="includes-iva" className="text-sm font-normal cursor-pointer">
                                    El precio incluye IVA (13%)
                                </Label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="item-description">
                                Descripción
                            </Label>
                            <Textarea
                                id="item-description"
                                placeholder="Describe el artículo..."
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <Label>Categorías</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <span>
                                            {selectedCategories.length === 0
                                                ? 'Seleccionar categorías'
                                                : `${selectedCategories.length} ${selectedCategories.length === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}`
                                            }
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                                    {mockCategories.map((category) => (
                                        <DropdownMenuItem
                                            key={category.id}
                                            className="flex items-center space-x-2 cursor-pointer"
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                handleCategoryToggle(category.id);
                                            }}
                                        >
                                            <Checkbox
                                                id={`category-${category.id}`}
                                                checked={selectedCategories.includes(category.id)}
                                                onCheckedChange={() => handleCategoryToggle(category.id)}
                                            />
                                            <Label
                                                htmlFor={`category-${category.id}`}
                                                className="text-sm font-normal cursor-pointer flex-1"
                                            >
                                                {category.name}
                                            </Label>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <p className="text-xs text-muted-foreground">
                                Selecciona una o más categorías para este item
                            </p>
                        </div>

                        {/* Photo Upload */}
                        <div className="space-y-3">
                            <Label>Foto del Item</Label>
                            {!photoPreview ? (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        id="photo-upload"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-sm font-medium">Haz clic para subir una imagen</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG o WEBP (MAX. 5MB)
                                        </p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative w-60 h-60 border rounded-lg overflow-hidden">
                                    <Image
                                        src={photoPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon-sm"
                                        className="absolute top-2 right-2"
                                        onClick={handleRemovePhoto}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Modifiers */}
                        <div className="space-y-3">
                            <Label>Modificadores</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <span>
                                            {selectedModifiers.length === 0
                                                ? 'Seleccionar modificadores'
                                                : `${selectedModifiers.length} ${selectedModifiers.length === 1 ? 'modificador seleccionado' : 'modificadores seleccionados'}`
                                            }
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                                    {mockModifiers.map((modifier) => (
                                        <DropdownMenuItem
                                            key={modifier.id}
                                            className="flex items-center space-x-2 cursor-pointer"
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                handleModifierToggle(modifier.id);
                                            }}
                                        >
                                            <Checkbox
                                                id={`modifier-${modifier.id}`}
                                                checked={selectedModifiers.includes(modifier.id)}
                                                onCheckedChange={() => handleModifierToggle(modifier.id)}
                                            />
                                            <Label
                                                htmlFor={`modifier-${modifier.id}`}
                                                className="text-sm font-normal cursor-pointer flex-1"
                                            >
                                                {modifier.name}
                                            </Label>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <p className="text-xs text-muted-foreground">
                                Opciones adicionales que los clientes pueden elegir
                            </p>
                        </div>

                    </form>
            </div>
        </div>
    );
}