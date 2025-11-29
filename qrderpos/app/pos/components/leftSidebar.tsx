import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {Settings, ShoppingBag, Plus} from 'lucide-react';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}


// Left Navbar Component
export default function NavSideBar() {
  const navItems: NavItem[] = [
    { icon: Plus, label: 'New Order' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
      <TooltipProvider>
        {navItems.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <item.icon className="w-6 h-6 text-gray-700" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};