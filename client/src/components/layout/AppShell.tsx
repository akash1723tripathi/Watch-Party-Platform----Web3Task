import React, { useState } from 'react';
import { NavRail } from './NavRail';
import { DisplayNameModal } from '../ui/DisplayNameModal';
import { useCurrentUser } from '../../lib/current-user';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, setUsername, hasUsername } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);

  const handleOpenModal = (triggerEl?: HTMLElement) => {
    if (triggerEl) {
      setTriggerElement(triggerEl);
    }
    setIsModalOpen(true);
  };

  const handleModalSubmit = (name: string) => {
    setUsername(name);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col md:flex-row">
      <NavRail onOpenDisplayNameModal={handleOpenModal} />

      <main className="flex-1 md:pl-16 lg:pl-20 pb-20 md:pb-0 min-h-screen flex flex-col">
        {children}
      </main>

      <DisplayNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        currentName={user.username}
        canDismiss={hasUsername}
        triggerElement={triggerElement}
      />
    </div>
  );
};
