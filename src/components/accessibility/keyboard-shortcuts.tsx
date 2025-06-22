'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, 
  Search, 
  Home, 
  BarChart3, 
  BookOpen, 
  Mic, 
  User,
  Settings,
  X,
  Keyboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
  icon?: React.ReactNode;
}

interface UseKeyboardShortcutsProps {
  shortcuts?: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ 
  shortcuts = [],
  enabled = true 
}: UseKeyboardShortcutsProps = {}) {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const defaultShortcuts: KeyboardShortcut[] = [
    {
      key: 'ctrl+k',
      description: 'Open command palette',
      action: () => setShowHelp(true),
      category: 'General',
      icon: <Command className="w-4 h-4" />
    },
    {
      key: 'ctrl+/',
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(true),
      category: 'General',
      icon: <Keyboard className="w-4 h-4" />
    },
    {
      key: 'g+h',
      description: 'Go to Dashboard',
      action: () => router.push('/dashboard'),
      category: 'Navigation',
      icon: <Home className="w-4 h-4" />
    },
    {
      key: 'g+a',
      description: 'Go to Analytics',
      action: () => router.push('/dashboard/analytics'),
      category: 'Navigation',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      key: 'g+l',
      description: 'Go to Learning Paths',
      action: () => router.push('/dashboard/learning-paths'),
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      key: 'g+v',
      description: 'Go to Voice Coach',
      action: () => router.push('/dashboard/voice-coach'),
      category: 'Navigation',
      icon: <Mic className="w-4 h-4" />
    },
    {
      key: 'g+p',
      description: 'Go to Profile',
      action: () => router.push('/dashboard/profile'),
      category: 'Navigation',
      icon: <User className="w-4 h-4" />
    },
    {
      key: 'ctrl+,',
      description: 'Open Settings',
      action: () => router.push('/dashboard/settings'),
      category: 'General',
      icon: <Settings className="w-4 h-4" />
    },
    {
      key: 'escape',
      description: 'Close dialogs/modals',
      action: () => setShowHelp(false),
      category: 'General'
    }
  ];

  const allShortcuts = [...defaultShortcuts, ...shortcuts];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Build shortcut string
    let shortcut = '';
    if (ctrl) shortcut += 'ctrl+';
    if (shift) shortcut += 'shift+';
    if (alt) shortcut += 'alt+';
    shortcut += key;

    // Handle special sequences (like g+h)
    const sequence = getKeySequence(event);

    // Find matching shortcut
    const matchingShortcut = allShortcuts.find(s => 
      s.key.toLowerCase() === shortcut || s.key.toLowerCase() === sequence
    );

    if (matchingShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchingShortcut.action();
    }
  }, [enabled, allShortcuts]);

  // Sequence tracking for shortcuts like 'g+h'
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [sequenceTimeout, setSequenceTimeout] = useState<NodeJS.Timeout | null>(null);

  const getKeySequence = (event: KeyboardEvent): string => {
    const key = event.key.toLowerCase();
    
    // Clear previous timeout
    if (sequenceTimeout) {
      clearTimeout(sequenceTimeout);
    }

    // Add key to sequence
    const newSequence = [...keySequence, key];
    setKeySequence(newSequence);

    // Set timeout to reset sequence
    const timeout = setTimeout(() => {
      setKeySequence([]);
    }, 1000);
    setSequenceTimeout(timeout);

    // Return sequence as string
    return newSequence.join('+');
  };

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (sequenceTimeout) {
          clearTimeout(sequenceTimeout);
        }
      };
    }
  }, [handleKeyDown, enabled, sequenceTimeout]);

  const groupedShortcuts = allShortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(shortcut);
    return groups;
  }, {} as Record<string, KeyboardShortcut[]>);

  return {
    showHelp,
    setShowHelp,
    shortcuts: allShortcuts,
    groupedShortcuts
  };
}

// Keyboard Shortcuts Help Modal
interface KeyboardShortcutsHelpProps {
  show: boolean;
  onClose: () => void;
  shortcuts: Record<string, KeyboardShortcut[]>;
}

export function KeyboardShortcutsHelp({ 
  show, 
  onClose, 
  shortcuts 
}: KeyboardShortcutsHelpProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

  const formatShortcut = (shortcut: string) => {
    return shortcut
      .split('+')
      .map(key => {
        switch (key.toLowerCase()) {
          case 'ctrl': return '⌘';
          case 'shift': return '⇧';
          case 'alt': return '⌥';
          case 'meta': return '⌘';
          default: return key.toUpperCase();
        }
      })
      .join(' + ');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassmorphismCard className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Keyboard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Keyboard Shortcuts
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use these shortcuts to navigate faster
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Shortcuts List */}
              <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                {Object.entries(shortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {shortcut.icon && (
                              <div className="text-gray-500 dark:text-gray-400">
                                {shortcut.icon}
                              </div>
                            )}
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {shortcut.description}
                            </span>
                          </div>
                          <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                            {formatShortcut(shortcut.key)}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Press <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to close
                </p>
              </div>
            </GlassmorphismCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Command Palette Component
export function CommandPalette() {
  const { showHelp, setShowHelp, groupedShortcuts } = useKeyboardShortcuts();

  return (
    <>
      <KeyboardShortcutsHelp
        show={showHelp}
        onClose={() => setShowHelp(false)}
        shortcuts={groupedShortcuts}
      />
    </>
  );
}
