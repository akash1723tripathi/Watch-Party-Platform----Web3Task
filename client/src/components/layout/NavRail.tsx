import React from 'react';
import { Home, Clapperboard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { UserPanel } from './UserPanel';

interface NavRailProps {
  onOpenDisplayNameModal: (triggerEl?: HTMLElement) => void;
}

export const NavRail: React.FC<NavRailProps> = ({ onOpenDisplayNameModal }) => {
  return (
    <>
      {/* Desktop Left Rail (md and up) */}
      <aside
        className="hidden md:flex flex-col justify-between items-center w-16 lg:w-20 h-screen py-6 border-r border-border bg-surface/50 backdrop-blur-md shrink-0 fixed left-0 top-0 z-30"
        aria-label="Sidebar Navigation"
      >
        {/* Top: Brand Logo */}
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-sm"
            title="WatchParty"
          >
            <Clapperboard className="w-5 h-5" />
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col items-center gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent ${
                  isActive
                    ? 'bg-accent text-background font-bold shadow-md shadow-accent/20'
                    : 'text-muted hover:text-text hover:bg-surface-hover'
                }`
              }
              aria-label="Home"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </NavLink>
          </nav>
        </div>

        {/* Bottom: Pinned User Panel */}
        <div className="flex flex-col items-center">
          <UserPanel onOpenDisplayNameModal={onOpenDisplayNameModal} isCompact />
        </div>
      </aside>

      {/* Mobile Bottom Bar (below md) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-surface/95 backdrop-blur-md px-6 flex items-center justify-between z-30"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Clapperboard className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-text">WatchParty</span>
        </div>

        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                isActive ? 'bg-accent text-background' : 'text-muted hover:text-text'
              }`
            }
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </NavLink>

          <UserPanel onOpenDisplayNameModal={onOpenDisplayNameModal} isCompact />
        </div>
      </nav>
    </>
  );
};
