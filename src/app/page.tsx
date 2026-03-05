import type { Metadata } from 'next';
import { Film, Home as HomeIcon, Bookmark, Settings } from 'lucide-react';
import MovieSearch from '@/components/MovieSearch';

export const metadata: Metadata = {
  title: 'Cineo AI — Understand Movie Audiences Through AI',
  description: 'Enter an IMDb movie ID to get AI-powered audience sentiment analysis, cast details, and reviews.',
};

function SidebarIcon({ icon: Icon, active }: { icon: React.ElementType; active?: boolean }) {
  return (
    <div className={`relative w-full flex items-center justify-center py-4 cursor-pointer transition-all duration-200 group
      ${active ? 'text-white' : 'text-white/15 hover:text-white/50'}`}>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-blue-500 rounded-r" />}
      <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#080808] text-white">

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden md:flex flex-col w-[66px] shrink-0 fixed left-0 top-0 bottom-0 z-50 bg-[#080808] border-r border-white/[0.05]">
        {/* Logo mark */}
        <div className="flex items-center justify-center h-[60px] border-b border-white/[0.05]">
          <Film size={18} className="text-blue-500" />
        </div>

        {/* Nav */}
        <nav className="flex flex-col flex-1 pt-2">
          <SidebarIcon icon={HomeIcon} active />
          <SidebarIcon icon={Bookmark} />
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.05]">
          <SidebarIcon icon={Settings} />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 md:ml-[66px] min-h-screen flex flex-col">
        <MovieSearch />
      </main>

    </div>
  );
}
