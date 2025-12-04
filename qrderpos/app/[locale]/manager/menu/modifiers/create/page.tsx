"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModifierOption {
    id: string;
    name: string;
    priceChange: string;
}

export default function CreateModifierPage() {
    const router = useRouter();
    const [modifierName, setModifierName] = useState("");
    const [modifierDescription, setModifierDescription] = useState("");
    const [options, setOptions] = useState<ModifierOption[]>([
        { id: "1", name: "", priceChange: "0" }
    ]);

    const addOption = () => {
        const newId = String(Date.now());
        setOptions([...options, { id: newId, name: "", priceChange: "0" }]);
    };

    const removeOption = (id: string) => {
        if (options.length > 1) {
            setOptions(options.filter(option => option.id !== id));
        }
    };

    const updateOption = (id: string, field: 'name' | 'priceChange', value: string) => {
        setOptions(options.map(option => 
            option.id === id ? { ...option, [field]: value } : option
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            name: modifierName,
            description: modifierDescription,
            options: options.filter(opt => opt.name.trim() !== ""),
        });
        // Reset form
        setModifierName("");
        setModifierDescription("");
        setOptions([{ id: "1", name: "", priceChange: "0" }]);
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header Controls */}
            <div>
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
                    <Button 
                        type="submit" 
                        form="modifier-form" 
                        disabled={!modifierName.trim() || options.every(opt => !opt.name.trim())}
                    >
                        Crear Modificador
                    </Button>
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Modificador</h1>
                <p className="text-muted-foreground mt-2">
                    Los modificadores permiten a los clientes personalizar sus productos.
                </p>
            </div>

            {/* Form */}
            <div className="max-w-3xl">
                <form id="modifier-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Modifier Name */}
                    <div className="space-y-2">
                        <Label htmlFor="modifier-name">
                            Nombre del Modificador *
                        </Label>
                        <Input
                            id="modifier-name"
                            placeholder="Ej: Tamaño, Extras, Temperatura..."
                            value={modifierName}
                            onChange={(e) => setModifierName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Modifier Description */}
                    <div className="space-y-2">
                        <Label htmlFor="modifier-description">
                            Descripción
                        </Label>
                        <Textarea
                            id="modifier-description"
                            placeholder="Describe este modificador..."
                            value={modifierDescription}
                            onChange={(e) => setModifierDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Opciones *</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addOption}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Opción
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={option.id} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Opción {index + 1}
                                        </span>
                                        {options.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => removeOption(option.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Option Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`option-name-${option.id}`}>
                                                Nombre de la Opción
                                            </Label>
                                            <Input
                                                id={`option-name-${option.id}`}
                                                placeholder="Ej: Pequeño, Mediano, Grande..."
                                                value={option.name}
                                                onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                                            />
                                        </div>

                                        {/* Price Change */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`option-price-${option.id}`}>
                                                Cambio de Precio
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input
                                                    id={`option-price-${option.id}`}
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={option.priceChange}
                                                    onChange={(e) => updateOption(option.id, 'priceChange', e.target.value)}
                                                    className="pl-7"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Use números negativos para descuentos
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                            Cada opción puede aumentar o disminuir el precio del producto
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
