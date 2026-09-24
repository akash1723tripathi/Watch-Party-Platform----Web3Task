import React, { useState, useEffect, useRef } from 'react';
import { User, X } from 'lucide-react';

interface DisplayNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  currentName?: string;
  canDismiss?: boolean;
  triggerElement?: HTMLElement | null;
}

export const DisplayNameModal: React.FC<DisplayNameModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentName = '',
  canDismiss = true,
  triggerElement,
}) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setError(null);
      // Autofocus input
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else if (triggerElement) {
      triggerElement.focus();
    }
  }, [isOpen, currentName, triggerElement]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (canDismiss) {
          e.preventDefault();
          onClose();
        }
      } else if (e.key === 'Tab') {
        // Focus trap inside modal
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canDismiss, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (trimmed.length > 24) {
      setError('Name cannot exceed 24 characters');
      return;
    }

    setError(null);
    onSubmit(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="display-name-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-text">
            <User className="w-5 h-5 text-accent" />
            <h2 id="display-name-modal-title" className="text-lg font-semibold">
              {currentName ? 'Change Display Name' : 'Choose Your Display Name'}
            </h2>
          </div>
          {canDismiss && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-muted hover:text-text hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-sm text-muted">
            Enter a username (2–24 characters) to identify yourself in watch parties.
          </p>

          <div>
            <label htmlFor="display-name-input" className="block text-sm font-medium text-text mb-1.5">
              Display Name
            </label>
            <input
              ref={inputRef}
              id="display-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Alex, CyberNaut"
              maxLength={24}
              className="w-full px-3.5 py-2.5 rounded bg-background border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
            />
            {error && (
              <p className="mt-1.5 text-xs text-danger" role="alert" aria-live="polite">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {canDismiss && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded border border-border text-text hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium rounded bg-accent text-background hover:bg-accent-hover font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            >
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
