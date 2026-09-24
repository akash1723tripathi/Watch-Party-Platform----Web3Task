import React, { useState } from 'react';
import { User, Copy, Check, Edit3 } from 'lucide-react';
import { useCurrentUser } from '../../lib/current-user';

interface UserPanelProps {
  onOpenDisplayNameModal: (triggerEl?: HTMLElement) => void;
  isCompact?: boolean;
}

export const UserPanel: React.FC<UserPanelProps> = ({
  onOpenDisplayNameModal,
  isCompact = false,
}) => {
  const { user, hasUsername } = useCurrentUser();
  const [copied, setCopied] = useState(false);

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(user.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const shortId = user.userId.length > 12 
    ? `${user.userId.slice(0, 6)}...${user.userId.slice(-4)}`
    : user.userId;

  if (isCompact) {
    return (
      <div className="relative group flex flex-col items-center">
        <button
          type="button"
          onClick={(e) => onOpenDisplayNameModal(e.currentTarget)}
          className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center text-text hover:border-accent hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label={hasUsername ? `User profile for ${user.username}` : 'Set display name'}
          title={hasUsername ? `${user.username} (${shortId})` : 'Set display name'}
        >
          <User className="w-5 h-5" />
        </button>

        {/* Hover/Focus popover tooltip on desktop rail */}
        <div className="hidden group-hover:flex md:flex-col absolute left-14 bottom-0 z-30 w-56 p-3 rounded-lg bg-surface border border-border shadow-xl pointer-events-none group-hover:pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm text-text truncate">
              {hasUsername ? user.username : 'Set Display Name'}
            </span>
            <button
              type="button"
              onClick={(e) => onOpenDisplayNameModal(e.currentTarget)}
              className="p-1 text-muted hover:text-accent rounded transition-colors"
              title="Change name"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-1 mt-1.5 pt-1.5 border-t border-border/60 text-xs text-muted">
            <span className="font-mono truncate">{shortId}</span>
            <button
              type="button"
              onClick={handleCopyId}
              className="p-1 hover:text-text rounded transition-colors"
              title="Copy User ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-surface/80 border border-border w-full">
      <div className="w-9 h-9 rounded-full bg-surface-hover border border-border flex items-center justify-center text-accent shrink-0">
        <User className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text truncate">
            {hasUsername ? user.username : 'Set Name'}
          </p>
          <button
            type="button"
            onClick={(e) => onOpenDisplayNameModal(e.currentTarget)}
            className="text-xs text-accent hover:underline flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-accent rounded px-1"
          >
            <Edit3 className="w-3 h-3" />
            {hasUsername ? 'Change' : 'Set'}
          </button>
        </div>
        <div className="flex items-center justify-between gap-1 text-xs text-muted">
          <span className="font-mono text-[11px] truncate">{shortId}</span>
          <button
            type="button"
            onClick={handleCopyId}
            className="p-0.5 hover:text-text rounded transition-colors flex items-center gap-0.5 text-[11px]"
            title="Copy ID"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-accent" />
                <span className="text-accent text-[10px]">Copied</span>
              </>
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
