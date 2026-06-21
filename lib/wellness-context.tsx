import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  summary?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  crisisDetected: boolean;
}

export interface MoodEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: number; // 1-10
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  emotion?: string;
  isPrivate: boolean;
}

interface WellnessContextType {
  sessions: Session[];
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  currentSession: Session | null;
  isLoading: boolean;
  startSession: () => Promise<Session>;
  endSession: (summary?: string) => Promise<void>;
  addSessionMessage: (role: 'user' | 'assistant', content: string) => Promise<void>;
  addMoodEntry: (emotion: string, intensity: number, note?: string) => Promise<void>;
  getTodayMood: () => MoodEntry | undefined;
  addJournalEntry: (content: string, emotion?: string, isPrivate?: boolean) => Promise<void>;
  getSessionHistory: () => Session[];
  getMoodTrend: (days: number) => MoodEntry[];
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data on app launch
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsData, moodData, journalData] = await Promise.all([
        AsyncStorage.getItem('sessions'),
        AsyncStorage.getItem('moodEntries'),
        AsyncStorage.getItem('journalEntries'),
      ]);

      if (sessionsData) setSessions(JSON.parse(sessionsData));
      if (moodData) setMoodEntries(JSON.parse(moodData));
      if (journalData) setJournalEntries(JSON.parse(journalData));
    } catch (error) {
      console.error('Failed to load wellness data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async (): Promise<Session> => {
    const newSession: Session = {
      id: `session_${Date.now()}`,
      startTime: new Date().toISOString(),
      duration: 30,
      messages: [],
      crisisDetected: false,
    };

    setCurrentSession(newSession);
    return newSession;
  };

  const endSession = async (summary?: string) => {
    if (!currentSession) return;

    try {
      const endedSession: Session = {
        ...currentSession,
        endTime: new Date().toISOString(),
        summary,
      };

      const updatedSessions = [...sessions, endedSession];
      await AsyncStorage.setItem('sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const addSessionMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!currentSession) return;

    try {
      const updatedSession: Session = {
        ...currentSession,
        messages: [
          ...currentSession.messages,
          {
            role,
            content,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setCurrentSession(updatedSession);
    } catch (error) {
      console.error('Failed to add message:', error);
    }
  };

  const addMoodEntry = async (emotion: string, intensity: number, note?: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newEntry: MoodEntry = {
        id: `mood_${Date.now()}`,
        date: today,
        emotion,
        intensity,
        note,
      };

      // Replace if already logged today
      const filteredEntries = moodEntries.filter((e) => e.date !== today);
      const updatedEntries = [...filteredEntries, newEntry];

      await AsyncStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
      setMoodEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to add mood entry:', error);
    }
  };

  const getTodayMood = (): MoodEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return moodEntries.find((e) => e.date === today);
  };

  const addJournalEntry = async (content: string, emotion?: string, isPrivate = true) => {
    try {
      const newEntry: JournalEntry = {
        id: `journal_${Date.now()}`,
        date: new Date().toISOString(),
        content,
        emotion,
        isPrivate,
      };

      const updatedEntries = [...journalEntries, newEntry];
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      setJournalEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to add journal entry:', error);
    }
  };

  const getSessionHistory = (): Session[] => {
    return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  };

  const getMoodTrend = (days: number): MoodEntry[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return moodEntries
      .filter((e) => new Date(e.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const value: WellnessContextType = {
    sessions,
    moodEntries,
    journalEntries,
    currentSession,
    isLoading,
    startSession,
    endSession,
    addSessionMessage,
    addMoodEntry,
    getTodayMood,
    addJournalEntry,
    getSessionHistory,
    getMoodTrend,
  };

  return <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>;
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (context === undefined) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
}
