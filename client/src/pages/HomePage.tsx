import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Users,
  Copy,
  Check,
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  Plus,
} from 'lucide-react';
import { createRoom, getRoom } from '../api/rooms.api';
import { ApiClientError } from '../api/axios-instance';
import { useCurrentUser } from '../lib/current-user';
import { DisplayNameModal } from '../components/ui/DisplayNameModal';
import { AppShell } from '../components/layout/AppShell';

const VALID_ROOM_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUsername, hasUsername } = useCurrentUser();

  // Host state
  const [isHosting, setIsHosting] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
  const [hostError, setHostError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'code' | 'link' | null>(null);

  // Join state
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Display Name Modal state
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'host' | 'join' | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  // Host room handler
  const executeHostRoom = async (currentUser = user) => {
    setIsHosting(true);
    setHostError(null);
    try {
      const room = await createRoom({
        userId: currentUser.userId,
        username: currentUser.username,
      });
      setCreatedRoomCode(room.code);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setHostError(err.message);
      } else {
        setHostError('Failed to create room. Please try again.');
      }
    } finally {
      setIsHosting(false);
    }
  };

  const handleHostClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasUsername) {
      setTriggerEl(e.currentTarget);
      setPendingAction('host');
      setIsNameModalOpen(true);
      return;
    }
    executeHostRoom();
  };

  // Join room handler
  const executeJoinRoom = async (codeToJoin = joinCode) => {
    const cleanCode = codeToJoin.trim().toUpperCase();
    if (cleanCode.length !== 6) {
      setJoinError('Room code must be exactly 6 characters');
      return;
    }

    setIsJoining(true);
    setJoinError(null);

    try {
      const room = await getRoom(cleanCode);
      navigate(`/room/${room.code}`);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.status === 404) {
          setJoinError('Room not found');
        } else {
          setJoinError(err.message || 'Failed to join room');
        }
      } else {
        setJoinError('Unable to connect. Please check your network.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode.trim().toUpperCase();

    if (cleanCode.length !== 6) {
      setJoinError('Room code must be exactly 6 characters');
      return;
    }

    if (!hasUsername) {
      setPendingAction('join');
      setIsNameModalOpen(true);
      return;
    }

    executeJoinRoom(cleanCode);
  };

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    // Filter to only allowed alphabet chars and limit to 6
    const filtered = rawVal
      .split('')
      .filter((char) => VALID_ROOM_CHARS.includes(char))
      .join('')
      .slice(0, 6);

    setJoinCode(filtered);
    if (joinError) setJoinError(null);
  };

  const handleNameModalSubmit = (name: string) => {
    const updatedUser = setUsername(name);
    setIsNameModalOpen(false);

    if (pendingAction === 'host') {
      setPendingAction(null);
      executeHostRoom(updatedUser);
    } else if (pendingAction === 'join') {
      setPendingAction(null);
      executeJoinRoom();
    }
  };

  const handleCopyCode = async () => {
    if (!createdRoomCode) return;
    try {
      await navigator.clipboard.writeText(createdRoomCode);
      setCopiedType('code');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    if (!createdRoomCode) return;
    const roomUrl = `${window.location.origin}/room/${createdRoomCode}`;
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopiedType('link');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // Fallback
    }
  };

  const roomLink = createdRoomCode ? `${window.location.origin}/room/${createdRoomCode}` : '';
  const emailSubject = encodeURIComponent('Join my YouTube Watch Party');
  const emailBody = encodeURIComponent(
    `Hey!\n\nJoin my synchronized watch party room on WatchParty.\n\nRoom Code: ${createdRoomCode}\nLink: ${roomLink}\n\nSee you there!`,
  );
  const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  return (
    <AppShell>
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 md:py-20 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center max-w-2xl mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Synchronized Video Experience
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text mb-3">
            Watch YouTube Together in Real Time
          </h1>
          <p className="text-base md:text-lg text-muted">
            Host private watch parties, invite your friends with a code, and enjoy synchronized playback.
          </p>
        </div>

        {/* Two Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Host Card */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6 md:p-8 shadow-lg transition-all duration-200 hover:border-border-hover">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <Video className="w-6 h-6" />
                </div>
                {createdRoomCode && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent border border-accent/30">
                    Room Ready
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-text mb-2">Host a Room</h2>
              <p className="text-sm text-muted mb-6">
                Start a new watch party room instantly and invite friends with a shareable code or link.
              </p>

              {hostError && (
                <div
                  className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  {hostError}
                </div>
              )}
            </div>

            {createdRoomCode ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-lg bg-background/80 border border-border text-center">
                  <span className="text-xs text-muted font-medium uppercase tracking-wider block mb-1">
                    Room Code
                  </span>
                  <div className="text-3xl md:text-4xl font-mono font-bold tracking-widest text-accent selection:bg-accent selection:text-background">
                    {createdRoomCode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-surface-hover border border-border text-text hover:bg-surface-raised transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {copiedType === 'code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-accent" />
                        <span className="text-accent">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-surface-hover border border-border text-text hover:bg-surface-raised transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {copiedType === 'link' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-accent" />
                        <span className="text-accent">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={mailtoLink}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-medium rounded-lg border border-border text-muted hover:text-text hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent text-center"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Invite by email</span>
                </a>

                <button
                  type="button"
                  onClick={() => navigate(`/room/${createdRoomCode}`)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-accent text-background hover:bg-accent-hover font-bold text-sm shadow-lg shadow-accent/20 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
                >
                  <span>Enter Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedRoomCode(null);
                      setHostError(null);
                    }}
                    className="text-xs text-muted hover:text-text transition-colors inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create another room</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleHostClick}
                disabled={isHosting}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-accent text-background hover:bg-accent-hover font-bold text-sm shadow-lg shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
              >
                {isHosting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Room...</span>
                  </>
                ) : (
                  <>
                    <span>Create Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Join Card */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6 md:p-8 shadow-lg transition-all duration-200 hover:border-border-hover">
            <div>
              <div className="w-12 h-12 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text mb-4">
                <Users className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-text mb-2">Join a Room</h2>
              <p className="text-sm text-muted mb-6">
                Enter the 6-character room code shared by your host to join the party.
              </p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label htmlFor="join-room-code" className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                  Room Code
                </label>
                <div className="relative">
                  <input
                    id="join-room-code"
                    type="text"
                    value={joinCode}
                    onChange={handleJoinCodeChange}
                    placeholder="e.g. 234HJK"
                    maxLength={6}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck="false"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-center font-mono text-xl tracking-widest text-text placeholder:text-muted/50 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors uppercase"
                  />
                </div>

                {joinError && (
                  <p
                    className="mt-2 text-xs text-danger font-medium"
                    role="alert"
                    aria-live="polite"
                  >
                    {joinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isJoining || joinCode.length !== 6}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-surface-hover border border-border text-text hover:bg-surface-raised hover:border-accent hover:text-accent font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span>Joining Room...</span>
                  </>
                ) : (
                  <>
                    <span>Join Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <DisplayNameModal
        isOpen={isNameModalOpen}
        onClose={() => {
          setIsNameModalOpen(false);
          setPendingAction(null);
        }}
        onSubmit={handleNameModalSubmit}
        currentName={user.username}
        canDismiss={hasUsername}
        triggerElement={triggerEl}
      />
    </AppShell>
  );
};
