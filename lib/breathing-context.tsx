import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BreathingExercise = {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  phases: BreathingPhase[];
  category: 'breathing' | 'grounding';
};

export type BreathingPhase = {
  name: string;
  instructions: string[];
  duration?: number;
  inhaleCount?: number;
  pauseCount?: number;
  exhaleCount?: number;
};

export type BreathingSession = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  category: 'breathing' | 'grounding';
};

interface BreathingContextType {
  exercises: BreathingExercise[];
  sessions: BreathingSession[];
  currentSession: BreathingSession | null;
  favorites: string[];
  startSession: (exerciseId: string) => Promise<void>;
  endSession: () => Promise<void>;
  toggleFavorite: (exerciseId: string) => Promise<void>;
  getSessions: () => Promise<BreathingSession[]>;
}

const BreathingContext = createContext<BreathingContextType | undefined>(undefined);

const DEFAULT_EXERCISES: BreathingExercise[] = [
  {
    id: 'uplifting-breath',
    name: 'Five Minutes to Brightness',
    description: 'An uplifting breathing practice to clear mental clutter and invite lightness',
    duration: 300,
    category: 'breathing',
    phases: [
      {
        name: 'Settling In',
        instructions: [
          'Find a comfortable seated position',
          'Soften your posture and relax your shoulders',
          'Close your eyes or lower your gaze',
          'Take a normal, natural breath',
        ],
        duration: 30,
      },
      {
        name: 'The Uplifting Breath',
        instructions: [
          'Inhale slowly through your nose for 1... 2... 3... 4',
          'Imagine breathing in a bright, warm light',
          'Pause at the top of the breath',
          'Exhale gently through your mouth for 1... 2... 3... 4',
          'Imagine blowing away a gray cloud',
          'Continue this rhythm, breathing in brightness and clarity',
          'With every inhale, picture that bright light filling you up',
          'Notice how each breath makes you feel lighter and more at ease',
        ],
        duration: 240,
        inhaleCount: 4,
        pauseCount: 1,
        exhaleCount: 4,
      },
      {
        name: 'Returning and Concluding',
        instructions: [
          'Let go of the counting and return to natural breathing',
          'Notice how you feel - more awake, brighter, or centered',
          'Bring gentle movement back into your body',
          'Wiggle your fingers and toes',
          'Take a gentle roll of your shoulders',
          'Take one final deep, refreshing breath',
          'Slowly blink your eyes open',
          'Thank yourself for taking these five minutes',
        ],
        duration: 30,
      },
    ],
  },
  {
    id: '5-4-3-2-1-grounding',
    name: '5-4-3-2-1 Grounding Technique',
    description: 'Anchor yourself in the present moment using your five senses',
    duration: 600,
    category: 'grounding',
    phases: [
      {
        name: 'Introduction',
        instructions: [
          'When stress or anxiety pulls your mind into a spiral, the 5-4-3-2-1 technique brings your focus back to the present moment',
          'By intentionally using your five senses, you can interrupt overwhelming thoughts',
          'This anchors you safely in your physical body and surroundings',
          'Take a moment to pause and check in with yourself',
        ],
        duration: 60,
      },
      {
        name: 'Step 1: Identify 5 Things You Can See',
        instructions: [
          'Look slowly around your space',
          'Silently name five objects you see',
          'Try to notice little details you usually overlook',
          'Notice the texture of the ceiling, a shadow on the floor, or the shape of a plant',
          'Take your time with each observation',
        ],
        duration: 90,
      },
      {
        name: 'Step 2: Identify 4 Things You Can Touch',
        instructions: [
          'Bring your attention to physical sensations',
          'Reach out and feel four things around you',
          'It could be the softness of your shirt, a sturdy table surface, the warmth of your hands',
          'Feel your feet resting on the ground',
          'Notice the texture and temperature of each sensation',
        ],
        duration: 90,
      },
      {
        name: 'Step 3: Identify 3 Things You Can Hear',
        instructions: [
          'Let your ears tune in to the environment',
          'Name three distinct sounds you hear',
          'Listen for the quiet hum of an appliance, cars passing by outside',
          'Notice the rhythmic sound of your own breathing',
          'Pay attention to subtle sounds around you',
        ],
        duration: 90,
      },
      {
        name: 'Step 4: Identify 2 Things You Can Smell',
        instructions: [
          'Take a gentle breath in through your nose',
          'Notice two scents around you',
          'It could be a nearby cup of tea, fresh air from a window',
          'Notice the scent of your laundry detergent or other familiar smells',
          'Breathe naturally and observe what you notice',
        ],
        duration: 90,
      },
      {
        name: 'Step 5: Identify 1 Thing You Can Taste',
        instructions: [
          'Focus on one thing you can taste right now',
          'It might be a lingering flavor from your last meal',
          'Notice a sip of water or the natural taste in your mouth',
          'Simply observe what is present on your palate',
          'There is no right or wrong answer',
        ],
        duration: 90,
      },
      {
        name: 'Conclusion',
        instructions: [
          'This simple practice shifts your brain\'s energy away from distress',
          'You are now focused on the calm of the "here and now"',
          'Take one more deep, slow breath',
          'You are safe, you are grounded, and you are doing a wonderful job',
          'Carry this sense of presence with you',
        ],
        duration: 60,
      },
    ],
  },
];

export function BreathingProvider({ children }: { children: React.ReactNode }) {
  const [exercises] = useState<BreathingExercise[]>(DEFAULT_EXERCISES);
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<BreathingSession | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const startSession = useCallback(
    async (exerciseId: string) => {
      const exercise = exercises.find((e) => e.id === exerciseId);
      if (!exercise) return;

      const session: BreathingSession = {
        id: `session-${Date.now()}`,
        exerciseId,
        exerciseName: exercise.name,
        startedAt: new Date().toISOString(),
        duration: exercise.duration,
        category: exercise.category,
      };

      setCurrentSession(session);
    },
    [exercises]
  );

  const endSession = useCallback(async () => {
    if (!currentSession) return;

    const completedSession: BreathingSession = {
      ...currentSession,
      completedAt: new Date().toISOString(),
    };

    setSessions((prev) => [...prev, completedSession]);
    setCurrentSession(null);

    // Save to AsyncStorage
    try {
      const existingSessions = await AsyncStorage.getItem('breathing_sessions');
      const allSessions = existingSessions ? JSON.parse(existingSessions) : [];
      await AsyncStorage.setItem(
        'breathing_sessions',
        JSON.stringify([...allSessions, completedSession])
      );
    } catch (error) {
      console.error('Error saving breathing session:', error);
    }
  }, [currentSession]);

  const toggleFavorite = useCallback(async (exerciseId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId];

      // Save to AsyncStorage
      AsyncStorage.setItem('breathing_favorites', JSON.stringify(updated)).catch((error) => {
        console.error('Error saving favorites:', error);
      });

      return updated;
    });
  }, []);

  const getSessions = useCallback(async (): Promise<BreathingSession[]> => {
    try {
      const stored = await AsyncStorage.getItem('breathing_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving breathing sessions:', error);
      return [];
    }
  }, []);

  return (
    <BreathingContext.Provider
      value={{
        exercises,
        sessions,
        currentSession,
        favorites,
        startSession,
        endSession,
        toggleFavorite,
        getSessions,
      }}
    >
      {children}
    </BreathingContext.Provider>
  );
}

export function useBreathing() {
  const context = useContext(BreathingContext);
  if (!context) {
    throw new Error('useBreathing must be used within BreathingProvider');
  }
  return context;
}
