import { ScrollView, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useBreathing } from '@/lib/breathing-context';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function BreathingScreen() {
  const router = useRouter();
  const { exercises, currentSession, startSession, endSession, favorites, toggleFavorite } = useBreathing();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breathePhase, setBreathaPhase] = useState<'inhale' | 'pause' | 'exhale' | 'idle'>('idle');
  const breatheScale = useRef(new Animated.Value(1)).current;

  const exercise = exercises.find((e) => e.id === selectedExercise);
  const currentPhase = exercise?.phases[currentPhaseIndex];

  // Breathing animation
  useEffect(() => {
    if (breathePhase === 'inhale') {
      Animated.timing(breatheScale, {
        toValue: 1.3,
        duration: (currentPhase?.inhaleCount || 4) * 1000,
        useNativeDriver: true,
      }).start();
    } else if (breathePhase === 'exhale') {
      Animated.timing(breatheScale, {
        toValue: 1,
        duration: (currentPhase?.exhaleCount || 4) * 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [breathePhase, currentPhase]);

  // Timer effect
  useEffect(() => {
    if (!isRunning || !exercise) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (currentPhaseIndex < exercise.phases.length - 1) {
            setCurrentPhaseIndex((idx) => idx + 1);
            setTimeRemaining(exercise.phases[currentPhaseIndex + 1]?.duration || 0);
          } else {
            handleCompleteExercise();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentPhaseIndex, exercise]);

  // Breathing cycle effect (for breathing exercises)
  useEffect(() => {
    if (!isRunning || exercise?.category !== 'breathing' || !currentPhase?.inhaleCount) return;

    const inhaleTime = (currentPhase.inhaleCount || 4) * 1000;
    const pauseTime = (currentPhase.pauseCount || 1) * 1000;
    const exhaleTime = (currentPhase.exhaleCount || 4) * 1000;
    const totalCycle = inhaleTime + pauseTime + exhaleTime;

    let cycleStart = Date.now();

    const cycleInterval = setInterval(() => {
      const elapsed = Date.now() - cycleStart;
      const position = elapsed % totalCycle;

      if (position < inhaleTime) {
        setBreathaPhase('inhale');
      } else if (position < inhaleTime + pauseTime) {
        setBreathaPhase('pause');
      } else {
        setBreathaPhase('exhale');
      }
    }, 100);

    return () => clearInterval(cycleInterval);
  }, [isRunning, currentPhase, exercise?.category]);

  const handleStartExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    const ex = exercises.find((e) => e.id === exerciseId);
    if (ex) {
      setCurrentPhaseIndex(0);
      setTimeRemaining(ex.phases[0]?.duration || 0);
      startSession(exerciseId);
    }
  };

  const handleBeginSession = () => {
    if (selectedExercise) {
      setIsRunning(true);
    }
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleCompleteExercise = async () => {
    setIsRunning(false);
    await endSession();
    Alert.alert('Great Job!', 'You have completed this exercise. Keep up your wellness practice!');
    setSelectedExercise(null);
    setCurrentPhaseIndex(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Exercise selection view
  if (!selectedExercise) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6 gap-4">
            <View className="items-center gap-2 mb-4">
              <Text className="text-4xl">🧘‍♀️</Text>
              <Text className="text-3xl font-bold text-primary text-center">Breathing & Grounding</Text>
              <Text className="text-base text-muted text-center">
                Guided exercises to calm your mind and ground yourself
              </Text>
            </View>

            {exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                className="bg-surface border border-border rounded-xl p-4 active:opacity-70"
                onPress={() => handleStartExercise(exercise.id)}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-2">
                    <Text className="text-lg font-semibold text-foreground">{exercise.name}</Text>
                    <Text className="text-sm text-muted">{exercise.description}</Text>
                    <View className="flex-row items-center gap-2 mt-2">
                      <Text className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded">
                        {Math.ceil(exercise.duration / 60)} min
                      </Text>
                      <Text className="text-xs text-muted capitalize">{exercise.category}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(exercise.id)}
                    className="p-2"
                  >
                    <Text className="text-xl">
                      {favorites.includes(exercise.id) ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            <View className="bg-primary bg-opacity-10 rounded-lg p-4 border border-primary border-opacity-30 mt-4">
              <Text className="text-sm font-semibold text-foreground mb-2">💡 Tip</Text>
              <Text className="text-xs text-muted leading-relaxed">
                Find a quiet, comfortable space. These exercises work best when you can focus without distractions. You can repeat any exercise as many times as you like.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Exercise in progress view
  if (isRunning && exercise) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 flex-col">
          {/* Header */}
          <View className="bg-primary px-6 py-4">
            <Text className="text-white text-sm opacity-80">{exercise.name}</Text>
            <Text className="text-white text-2xl font-bold mt-2">{formatTime(timeRemaining)}</Text>
          </View>

          {/* Main content */}
          <ScrollView
            className="flex-1 px-6 py-8"
            contentContainerStyle={{ justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-8">
              {/* Breathing animation (only for breathing exercises) */}
              {exercise.category === 'breathing' && (
                <View className="items-center gap-4">
                  <Animated.View
                    className="w-32 h-32 rounded-full bg-primary bg-opacity-30 items-center justify-center"
                    style={{ transform: [{ scale: breatheScale }] }}
                  >
                    <Text className="text-5xl">🫁</Text>
                  </Animated.View>
                  <Text className="text-lg font-semibold text-primary capitalize">
                    {breathePhase === 'idle' ? 'Ready' : breathePhase}
                  </Text>
                </View>
              )}

              {/* Phase information */}
              <View className="bg-surface border border-border rounded-xl p-6 gap-4">
                <Text className="text-xl font-bold text-foreground">
                  {currentPhase?.name}
                </Text>
                <View className="gap-3">
                  {currentPhase?.instructions.map((instruction, idx) => (
                    <View key={idx} className="flex-row gap-3">
                      <Text className="text-primary font-bold">{idx + 1}.</Text>
                      <Text className="flex-1 text-sm text-foreground leading-relaxed">
                        {instruction}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Progress indicator */}
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Progress</Text>
                  <Text className="text-xs text-muted">
                    Phase {currentPhaseIndex + 1} of {exercise.phases.length}
                  </Text>
                </View>
                <View className="bg-surface rounded-full h-2 overflow-hidden">
                  <View
                    className="bg-primary h-full"
                    style={{
                      width: `${((currentPhaseIndex + 1) / exercise.phases.length) * 100}%`,
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Controls */}
          <View className="px-6 py-4 border-t border-border bg-background gap-3">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-primary rounded-lg py-3 items-center"
                onPress={handlePauseResume}
              >
                <Text className="text-white font-semibold">
                  {isRunning ? 'Pause' : 'Resume'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-error bg-opacity-20 border border-error rounded-lg py-3 items-center"
                onPress={handleCompleteExercise}
              >
                <Text className="text-error font-semibold">End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Exercise ready to start view
  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8 justify-center gap-6">
          <View className="items-center gap-4">
            <Text className="text-6xl">
              {exercise?.category === 'breathing' ? '🫁' : '🌍'}
            </Text>
            <Text className="text-2xl font-bold text-foreground text-center">
              {exercise?.name}
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              {exercise?.description}
            </Text>
          </View>

          <View className="bg-surface border border-border rounded-xl p-6 gap-4">
            <Text className="text-sm font-semibold text-foreground mb-2">What to expect:</Text>
            <View className="gap-3">
              {exercise?.phases.map((phase, idx) => (
                <View key={idx} className="flex-row gap-3">
                  <Text className="text-primary font-bold">{idx + 1}.</Text>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-foreground">{phase.name}</Text>
                    <Text className="text-xs text-muted">
                      {phase.duration ? `${Math.ceil(phase.duration / 60)} minute${phase.duration > 60 ? 's' : ''}` : 'Guided'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              className="bg-primary rounded-lg py-4 items-center"
              onPress={handleBeginSession}
            >
              <Text className="text-white font-semibold text-base">Begin Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-surface border border-border rounded-lg py-4 items-center"
              onPress={() => setSelectedExercise(null)}
            >
              <Text className="text-foreground font-semibold">Back to Exercises</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning border-opacity-30">
            <Text className="text-xs text-muted leading-relaxed">
              💡 Find a quiet, comfortable space. These exercises work best when you can focus without distractions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
