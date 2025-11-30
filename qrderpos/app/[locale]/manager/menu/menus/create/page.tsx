import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MENU_ROUTES } from "@/config/routes"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

export default function CreateMenuPage() {
    return (
        <>
        <div className="flex items-center justify-between">
            <Link href={MENU_ROUTES.MENUS}>
                <ArrowLeft className="mb-4 h-6 w-6 cursor-pointer" />
            </Link>
            <div className="flex">
                <button className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    Guardar
                </button>
                <button className="ml-2 rounded border border-border bg-background px-4 py-2 text-foreground hover:bg-accent">
                    Eliminar
                </button>

            </div>

        </div>
            {/* ========= Gestionar Menú ========= */}
            <section>

            <h1 className="text-3xl font-bold tracking-tight">
                Gestionar Menú
            </h1>
            <Input
                placeholder="Nombre del Menú"
                className="mt-4 mb-8 w-md border-0 border-b-2 border-primary rounded-none"
                />
            <h2 className="text-2xl">Visibilidad</h2>
            <div className="flex items-center gap-5">
                <p className="text-sm text-muted-foreground">
                    Mostrar u ocultar el menú a los clientes
                </p>
                <Switch className="" />
            </div>
            </section>

            {/* ========= Horarios de Disponibilidad ========= */}
            <section>
            <div className="mt-8 flex items-center justify-between">
                <h2 className="text-2xl">Horarios de Disponibilidad</h2>
                <button className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    Añadir Horario
                </button>
            </div>
            <p className="text-sm text-muted-foreground">
                Define los horarios en los que este menú estará disponible para los clientes.
            </p>
            <div className="mt-4 space-y-4">
                {/* Ejemplo de horario */}
                <Card className="p-4 flex justify-between items-start relative">
                    <div>
                        <ToggleGroup type="multiple" className="flex space-x-2">
                            <ToggleGroupItem value="mon" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">Lun</ToggleGroupItem>
                            <ToggleGroupItem value="tue" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">Mar</ToggleGroupItem>
                            <ToggleGroupItem value="wed" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">Mié</ToggleGroupItem>
                            <ToggleGroupItem value="thu" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">Jue</ToggleGroupItem>
                            <ToggleGroupItem value="fri" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">Vie</ToggleGroupItem>
                            <ToggleGroupItem value="sat" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">Sáb</ToggleGroupItem>
                            <ToggleGroupItem value="sun" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">Dom</ToggleGroupItem>
                        </ToggleGroup>
                        <div className="space-x-4 mt-4">
                            <span>Hora de Inicio</span>
                            <Input type="time" className="w-auto" />
                            <span>-</span>
                            <span>Hora de Fin</span>
                            <Input type="time" className="w-auto" />
                        </div>
                    </div>
                    <X className="absolute top-4 right-4 h-5 w-5 cursor-pointer text-muted-foreground hover:text-destructive" />
                </Card>
            </div>
            </section>

        </>
    )
}