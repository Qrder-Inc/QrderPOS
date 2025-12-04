import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {Settings, ShoppingBag, Plus} from 'lucide-react';

import { useTranslations } from 'next-intl';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}


// Left Navbar Component
export default function NavSideBar() {
  const t = useTranslations('pos.navSidebar');

  const navItems: NavItem[] = [
    { icon: Plus, label: t('newOrder') },
    { icon: ShoppingBag, label: t('orders') },
    { icon: Settings, label: t('settings') }
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