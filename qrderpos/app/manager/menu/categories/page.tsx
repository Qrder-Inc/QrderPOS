"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Pencil, Trash2 } from "lucide-react";

// Mock data for categories
const mockCategories = [
    { id: 1, name: "Bebidas", description: "Bebidas frías y calientes", menuCount: 3 },
    { id: 2, name: "Platos Principales", description: "Comidas del día", menuCount: 2 },
    { id: 3, name: "Postres", description: "Dulces y helados", menuCount: 4 },
    { id: 4, name: "Entradas", description: "Aperitivos y bocadillos", menuCount: 1 },
    { id: 5, name: "Ensaladas", description: "Ensaladas frescas", menuCount: 2 },
    { id: 6, name: "Bebidas", description: "Bebidas frías y calientes", menuCount: 3 },
    { id: 7, name: "Platos Principales", description: "Comidas del día", menuCount: 2 },
    { id: 8, name: "Postres", description: "Dulces y helados", menuCount: 4 },
    { id: 9, name: "Entradas", description: "Aperitivos y bocadillos", menuCount: 1 },
    { id: 10, name: "Ensaladas", description: "Ensaladas frescas", menuCount: 2 },
    
];

// Mock data for menus
const mockMenus = [
    { id: 1, name: "Menú Principal" },
    { id: 2, name: "Menú Ejecutivo" },
    { id: 3, name: "Menú Vegetariano" },
    { id: 4, name: "Menú de Temporada" },
];

export default function MenuCategoriesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [selectedMenus, setSelectedMenus] = useState<number[]>([]);

    const filteredCategories = mockCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMenuToggle = (menuId: number) => {
        setSelectedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log({
            name: categoryName,
            description: categoryDescription,
            menus: selectedMenus,
        });
        // Reset form
        setCategoryName("");
        setCategoryDescription("");
        setSelectedMenus([]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
                <p className="text-muted-foreground">
                    Gestiona las categorías de tu menú aquí.
                </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Side - Categories List */}
                <Card className="h-fit max-h-[calc(100vh-12rem)] flex flex-col lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Categorías Existentes</CardTitle>
                        <CardDescription>
                            Lista de todas las categorías disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
                        {/* Search Box */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar categorías..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Categories List */}
                        <div className="space-y-2 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            {filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-1 flex-1">
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {category.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                                                {category.menuCount} {category.menuCount === 1 ? 'menú' : 'menús'}
                                            </span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => console.log('Modificar', category.id)}>
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Modificar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => console.log('Eliminar', category.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Side - Create Category Form */}
                <Card className="h-fit max-h-[calc(100vh-12rem)] lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Crear Nueva Categoría</CardTitle>
                        <CardDescription>
                            Completa el formulario para agregar una categoría
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Category Name */}
                            <div className="space-y-2">
                                <Label htmlFor="category-name">
                                    Nombre de la Categoría *
                                </Label>
                                <Input
                                    id="category-name"
                                    placeholder="Ej: Bebidas, Platos Principales..."
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Category Description */}
                            <div className="space-y-2">
                                <Label htmlFor="category-description">
                                    Descripción
                                </Label>
                                <Textarea
                                    id="category-description"
                                    placeholder="Describe esta categoría..."
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Link to Menus */}
                            <div className="space-y-3">
                                <Label>Vincular a Menús</Label>
                                <div className="space-y-2 border rounded-lg p-4 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                    {mockMenus.map((menu) => (
                                        <div key={menu.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`menu-${menu.id}`}
                                                checked={selectedMenus.includes(menu.id)}
                                                onCheckedChange={() => handleMenuToggle(menu.id)}
                                            />
                                            <Label
                                                htmlFor={`menu-${menu.id}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {menu.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {selectedMenus.length} {selectedMenus.length === 1 ? 'menú seleccionado' : 'menús seleccionados'}
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" disabled={!categoryName.trim()}>
                                Crear Categoría
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}