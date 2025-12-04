import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MENU_ROUTES } from "@/config/routes"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"
    

export default function CreateMenuPage() {
    const t = useTranslations("createMenu");
    const days = useTranslations("days");
    const common = useTranslations("common");
    
    return (
        <>
        <div className="flex items-center justify-between">
            <Link href={MENU_ROUTES.MENUS}>
                <ArrowLeft className="mb-4 h-6 w-6 cursor-pointer" />
            </Link>
            <div className="flex">
                <button className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    {common("save")}
                </button>
                <button className="ml-2 rounded border border-border bg-background px-4 py-2 text-foreground hover:bg-accent">
                    {common("delete")}
                </button>

            </div>

        </div>
            {/* ========= Gestionar Menú ========= */}
            <section>

            <h1 className="text-3xl font-bold tracking-tight">
                {t("title")}
            </h1>
            <Input
                placeholder={t("namePlaceholder")}
                className="mt-4 mb-8 w-md border-0 border-b-2 border-primary rounded-none"
                />
            <h2 className="text-2xl">{t("visibility")}</h2>
            <div className="flex items-center gap-5">
                <p className="text-sm text-muted-foreground">
                    {t("visibilityDescription")}
                </p>
                <Switch className="" />
            </div>
            </section>

            {/* ========= Horarios de Disponibilidad ========= */}
            <section>
            <div className="mt-8 flex items-center justify-between">
                <h2 className="text-2xl">{
                    t("availabilityHours")}
                </h2>
                <button className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    {t("addAvailabilityHoursBtn")}
                </button>
            </div>
            <p className="text-sm text-muted-foreground">
                {t("addAvailabilityHours")}
            </p>
            <div className="mt-4 space-y-4">
                {/* Ejemplo de horario */}
                <Card className="p-4 flex justify-between items-start relative">
                    <div>
                        <ToggleGroup type="multiple" className="flex space-x-2">
                            <ToggleGroupItem value="mon" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">{days("mon")}</ToggleGroupItem>
                            <ToggleGroupItem value="tue" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">{days("tue")}</ToggleGroupItem>
                            <ToggleGroupItem value="wed" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">{days("wed")}</ToggleGroupItem>
                            <ToggleGroupItem value="thu" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">{days("thu")}</ToggleGroupItem>
                            <ToggleGroupItem value="fri" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">{days("fri")}</ToggleGroupItem>
                            <ToggleGroupItem value="sat" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">{days("sat")}</ToggleGroupItem>
                            <ToggleGroupItem value="sun" className="px-5 py-1 rounded bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-white">{days("sun")}</ToggleGroupItem>
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