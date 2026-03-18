'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Briefcase,
  PieChart,
  Network,
  Megaphone,
  LifeBuoy,
  Settings,
  Search
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Commissions', href: '/admin/commissions', icon: DollarSign },
  { name: 'Brokers', href: '/admin/brokers', icon: Briefcase },
  { name: 'Finance', href: '/admin/finance', icon: PieChart },
  { name: 'Network', href: '/admin/network', icon: Network },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
  { name: 'Support', href: '/admin/support', icon: LifeBuoy },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-950 text-slate-50">
      <div className="flex h-14 items-center border-b border-slate-800 px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="h-6 w-6 rounded-md bg-indigo-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">F</span>
          </div>
          Finhalo Admin
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-slate-800 text-slate-50" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-slate-400">admin@finhalo.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
