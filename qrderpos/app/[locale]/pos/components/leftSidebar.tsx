import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {Settings, ShoppingBag, Plus, LogOut} from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}


// Left Navbar Component
export default function NavSideBar() {
  const t = useTranslations('pos.navSidebar');
  const router = useRouter();

  const navItems: NavItem[] = [
    { icon: Plus, label: t('newOrder') },
    { icon: ShoppingBag, label: t('orders') },
    { icon: Settings, label: t('settings') }
  ];

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear session, redirect to login)
    router.push('/');
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <TooltipProvider>
        {/* Top navigation items */}
        <div className="flex flex-col items-center gap-4 flex-1">
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
        </div>

        {/* Logout button at the bottom */}
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleLogout}
                className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t('logout')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};