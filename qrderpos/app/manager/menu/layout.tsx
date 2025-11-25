import { MenuNavbar } from "./menuNavbar";
import { Separator } from "@/components/ui/separator";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <MenuNavbar />
        <Separator />
        <div className="my-5">
            {children}
        </div>
    </>
  )
}