import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MuscleGroup {
  id: string;
  name: string;
  displayName: string;
  instructions: string[];
  tenseDuration: number; // seconds
  releaseDuration: number; // seconds
  restDuration: number; // seconds
}

export interface PMRSession {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  currentMuscleIndex: number;
  isRunning: boolean;
  totalDuration: number;
}

export interface PMRContextType {
  muscleGroups: MuscleGroup[];
  currentSession: PMRSession | null;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  moveToNextMuscle: () => void;
  getSessions: () => Promise<PMRSession[]>;
}

const PMRContext = createContext<PMRContextType | undefined>(undefined);

const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: 'toes',
    name: 'Toes',
    displayName: 'Toes & Feet',
    instructions: [
      'Curl your toes tightly, creating tension in the bottom of your feet.',
      'Feel the tension building in your toes and the soles of your feet.',
      'Notice how tense this area feels.',
    ],
    tenseDuration: 5,
    releaseDuration: 7,
    restDuration: 3,
  },
  {
    id: 'calves',
    name: 'Calves',
    displayName: 'Calves & Shins',
    instructions: [
      'Point your toes downward and tense your calf muscles.',
      'Feel the tension running up the back of your lower leg.',
      'Hold this tension, noticing the sensation.',
    ],
    tenseDuration: 5,
    releaseDuration: 7,
    restDuration: 3,
  },
  {
    id: 'thighs',
    name: 'Thighs',
    displayName: 'Thighs & Quadriceps',
    instructions: [
      'Tighten your thigh muscles by straightening your legs.',
      'Feel the tension in the front and back of your thighs.',
      'Hold this tension, breathing steadily.',
    ],
    tenseDuration: 5,
    releaseDuration: 7,
    restDuration: 3,
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    displayName: 'Abdomen & Core',
    instructions: [
      'Tighten your abdominal muscles, pulling your stomach in.',
      'Feel the tension in your core and lower back.',
      'Hold this tension while breathing slowly.',
    ],
    tenseDuration: 5,
    releaseDuration: 7,
    restDuration: 3,
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    displayName: 'Shoulders & Neck',
    instructions: [
      'Raise your shoulders up toward your ears and tense your neck.',
      'Feel the tension spreading across your shoulders and upper back.',
      'Hold this tension, noticing where you feel it most.',
    ],
    tenseDuration: 5,
    releaseDuration: 7,
    restDuration: 3,
  },
  {
    id: 'face',
    name: 'Face',
    displayName: 'Face & Head',
    instructions: [
      'Scrunch up your face, tightening all the muscles.',
      'Feel the tension in your jaw, cheeks, forehead, and around your eyes.',
      'Hold this tension, breathing through your nose.',
    ],
    tenseDuration: 5,
    releaseDuration: 7,
    restDuration: 3,
  },
];

export function PMRProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<PMRSession | null>(null);

  const calculateTotalDuration = useCallback(() => {
    return MUSCLE_GROUPS.reduce(
      (total, group) => total + group.tenseDuration + group.releaseDuration + group.restDuration,
      0
    );
  }, []);

  const startSession = useCallback(async () => {
    const session: PMRSession = {
      id: `pmr-${Date.now()}`,
      startedAt: new Date(),
      currentMuscleIndex: 0,
      isRunning: true,
      totalDuration: calculateTotalDuration(),
    };
    setCurrentSession(session);
    await AsyncStorage.setItem('pmr_current_session', JSON.stringify(session));
  }, [calculateTotalDuration]);

  const endSession = useCallback(async () => {
    if (currentSession) {
      const completedSession: PMRSession = {
        ...currentSession,
        completedAt: new Date(),
        isRunning: false,
      };
      
      // Save to history
      const sessions = await getSessions();
      const updatedSessions = [...sessions, completedSession];
      await AsyncStorage.setItem('pmr_sessions', JSON.stringify(updatedSessions));
      
      // Clear current session
      setCurrentSession(null);
      await AsyncStorage.removeItem('pmr_current_session');
    }
  }, [currentSession]);

  const pauseSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, isRunning: false });
    }
  }, [currentSession]);

  const resumeSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, isRunning: true });
    }
  }, [currentSession]);

  const moveToNextMuscle = useCallback(() => {
    if (currentSession) {
      const nextIndex = currentSession.currentMuscleIndex + 1;
      if (nextIndex < MUSCLE_GROUPS.length) {
        setCurrentSession({ ...currentSession, currentMuscleIndex: nextIndex });
      } else {
        // Session complete
        endSession();
      }
    }
  }, [currentSession, endSession]);

  const getSessions = useCallback(async (): Promise<PMRSession[]> => {
    try {
      const data = await AsyncStorage.getItem('pmr_sessions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading PMR sessions:', error);
      return [];
    }
  }, []);

  return (
    <PMRContext.Provider
      value={{
        muscleGroups: MUSCLE_GROUPS,
        currentSession,
        startSession,
        endSession,
        pauseSession,
        resumeSession,
        moveToNextMuscle,
        getSessions,
      }}
    >
      {children}
    </PMRContext.Provider>
  );
}

export function usePMR() {
  const context = useContext(PMRContext);
  if (!context) {
    throw new Error('usePMR must be used within PMRProvider');
  }
  return context;
}
