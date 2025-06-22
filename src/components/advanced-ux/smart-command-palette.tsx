'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Star,
  Zap,
  Command,
  Keyboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  shortcut?: string;
  category: string;
  icon?: React.ReactNode;
  action: () => void;
  keywords?: string[];
  priority?: number;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands?: CommandAction[];
}

export function SmartCommandPalette({ 
  isOpen, 
  onClose, 
  commands = [] 
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Default commands
  const defaultCommands: CommandAction[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      description: 'View your main dashboard',
      category: 'Navigation',
      icon: <Zap className="w-4 h-4" />,
      action: () => router.push('/dashboard'),
      keywords: ['home', 'main', 'overview'],
      shortcut: 'g h',
      priority: 10
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'See your progress analytics',
      category: 'Navigation',
      icon: <Star className="w-4 h-4" />,
      action: () => router.push('/dashboard/analytics'),
      keywords: ['stats', 'charts', 'progress'],
      shortcut: 'g a',
      priority: 9
    },
    {
      id: 'learning-paths',
      title: 'Learning Paths',
      description: 'Manage your learning paths',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4" />,
      action: () => router.push('/dashboard/learning-paths'),
      keywords: ['learn', 'courses', 'skills'],
      shortcut: 'g l',
      priority: 9
    },
    {
      id: 'voice-coach',
      title: 'Voice Coach',
      description: 'Start voice coaching session',
      category: 'Features',
      icon: <Command className="w-4 h-4" />,
      action: () => router.push('/dashboard/voice-coach'),
      keywords: ['voice', 'ai', 'coach', 'speak'],
      shortcut: 'g v',
      priority: 8
    }
  ];

  const allCommands = [...defaultCommands, ...commands];

  // Filter and sort commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query) {
      // Show recent commands first, then popular ones
      const recent = allCommands.filter(cmd => recentCommands.includes(cmd.id));
      const others = allCommands.filter(cmd => !recentCommands.includes(cmd.id))
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
      return [...recent, ...others];
    }

    const queryLower = query.toLowerCase();
    return allCommands
      .filter(cmd => {
        const titleMatch = cmd.title.toLowerCase().includes(queryLower);
        const descMatch = cmd.description?.toLowerCase().includes(queryLower);
        const keywordMatch = cmd.keywords?.some(k => k.toLowerCase().includes(queryLower));
        return titleMatch || descMatch || keywordMatch;
      })
      .sort((a, b) => {
        // Prioritize exact title matches
        const aExact = a.title.toLowerCase().includes(queryLower) ? 2 : 0;
        const bExact = b.title.toLowerCase().includes(queryLower) ? 2 : 0;
        return bExact - aExact + ((b.priority || 0) - (a.priority || 0));
      });
  }, [query, allCommands, recentCommands]);

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandAction[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const executeCommand = (command: CommandAction) => {
    // Add to recent commands
    setRecentCommands(prev => {
      const filtered = prev.filter(id => id !== command.id);
      return [command.id, ...filtered].slice(0, 5);
    });

    // Execute the command
    command.action();
    onClose();
  };

  const formatShortcut = (shortcut: string) => {
    return shortcut.split(' ').map((key, index) => (
      <React.Fragment key={index}>
        {index > 0 && <span className="mx-1">+</span>}
        <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
          {key.toUpperCase()}
        </kbd>
      </React.Fragment>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] z-50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassmorphismCard className="p-0 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none text-lg"
                />
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Keyboard className="w-3 h-3" />
                  <span>↑↓ navigate</span>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No commands found</p>
                    <p className="text-sm mt-1">Try different keywords</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                      <div key={category}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 dark:bg-gray-800/50">
                          {category}
                        </div>
                        {categoryCommands.map((command, commandIndex) => {
                          const globalIndex = filteredCommands.indexOf(command);
                          const isSelected = globalIndex === selectedIndex;
                          
                          return (
                            <motion.button
                              key={command.id}
                              onClick={() => executeCommand(command)}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left ${
                                isSelected ? 'bg-purple-50 dark:bg-purple-900/20 border-r-2 border-purple-500' : ''
                              }`}
                              whileHover={{ x: 2 }}
                            >
                              {/* Icon */}
                              <div className={`p-1.5 rounded-lg ${
                                isSelected 
                                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}>
                                {command.icon || <Command className="w-4 h-4" />}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {command.title}
                                  </p>
                                  {command.shortcut && (
                                    <div className="flex items-center gap-1 ml-2">
                                      {formatShortcut(command.shortcut)}
                                    </div>
                                  )}
                                </div>
                                {command.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {command.description}
                                  </p>
                                )}
                              </div>

                              {/* Recent indicator */}
                              {recentCommands.includes(command.id) && (
                                <Clock className="w-4 h-4 text-gray-400" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to execute</span>
                  <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to close</span>
                </div>
                <div>
                  {filteredCommands.length} commands
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
}
