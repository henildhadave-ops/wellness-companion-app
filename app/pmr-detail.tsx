import { ScrollView, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { usePMR } from '@/lib/pmr-context';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type Phase = 'tense' | 'release' | 'rest' | 'idle';

export default function PMRDetailScreen() {
  const router = useRouter();
  const { startSession, endSession, moveToNextMuscle, currentSession, muscleGroups } = usePMR();
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const breatheScale = useRef(new Animated.Value(1)).current;
  const muscleGlow = useRef(new Animated.Value(0)).current;

  const currentMuscle = currentSession
    ? muscleGroups[currentSession.currentMuscleIndex]
    : null;

  // Initialize session
  useEffect(() => {
    if (!sessionInitialized && !currentSession) {
      startSession();
      setSessionInitialized(true);
    }
  }, [sessionInitialized, currentSession, startSession]);

  // Breathing animation - synced with phase duration
  useEffect(() => {
    if (phase === 'tense' && currentMuscle) {
      Animated.timing(breatheScale, {
        toValue: 1.3,
        duration: currentMuscle.tenseDuration * 1000,
        useNativeDriver: true,
      }).start();
    } else if (phase === 'release' && currentMuscle) {
      Animated.timing(breatheScale, {
        toValue: 1,
        duration: currentMuscle.releaseDuration * 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [phase, breatheScale, currentMuscle]);

  // Muscle glow animation
  useEffect(() => {
    if (phase === 'tense' && currentMuscle) {
      Animated.timing(muscleGlow, {
        toValue: 1,
        duration: currentMuscle.tenseDuration * 1000,
        useNativeDriver: true,
      }).start();
    } else if (phase === 'release' && currentMuscle) {
      Animated.timing(muscleGlow, {
        toValue: 0,
        duration: currentMuscle.releaseDuration * 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [phase, muscleGlow, currentMuscle]);

  // Timer effect - handles phase transitions with correct timing
  useEffect(() => {
    if (!isRunning || !currentMuscle || phase === 'idle') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          // Transition to next phase
          if (phase === 'tense') {
            setPhase('release');
            return currentMuscle.releaseDuration;
          } else if (phase === 'release') {
            setPhase('rest');
            return currentMuscle.restDuration;
          } else if (phase === 'rest') {
            // Check if there's a next muscle group
            if (currentSession && currentSession.currentMuscleIndex < muscleGroups.length - 1) {
              moveToNextMuscle();
              setPhase('tense');
              const nextMuscle = muscleGroups[currentSession.currentMuscleIndex + 1];
              return nextMuscle.tenseDuration;
            } else {
              // Session complete
              setIsRunning(false);
              return 0;
            }
          }
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, currentMuscle, currentSession, moveToNextMuscle, muscleGroups]);

  const handleStartExercise = async () => {
    if (currentSession && currentMuscle) {
      setPhase('tense');
      setTimeRemaining(currentMuscle.tenseDuration);
      setIsRunning(true);
    }
  };

  const handleCompleteExercise = async () => {
    setIsRunning(false);
    await endSession();
    Alert.alert(
      'Great Job!',
      'You have completed the Progressive Muscle Relaxation exercise. Your body should feel more relaxed now.'
    );
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'tense':
        return `Focus and gently tense your ${currentMuscle?.displayName}`;
      case 'release':
        return 'Release and feel the tension wash away';
      case 'rest':
        return 'Rest and breathe deeply';
      default:
        return 'Ready to begin?';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'tense':
        return 'text-warning';
      case 'release':
        return 'text-success';
      case 'rest':
        return 'text-primary';
      default:
        return 'text-muted';
    }
  };

  if (!currentSession || !currentMuscle) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 py-8 justify-center gap-6">
            <View className="items-center gap-4">
              <Text className="text-6xl">💆</Text>
              <Text className="text-2xl font-bold text-foreground text-center">
                Progressive Muscle Relaxation
              </Text>
              <Text className="text-base text-muted text-center leading-relaxed">
                A guided journey to release tension from your entire body, starting from your toes and moving up to your head.
              </Text>
            </View>

            <View className="bg-surface border border-border rounded-xl p-6 gap-4">
              <Text className="text-sm font-semibold text-foreground mb-2">What to expect:</Text>
              <View className="gap-3">
                <View className="flex-row gap-3">
                  <Text className="text-primary font-bold">1.</Text>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-foreground">Focus & Tense (5 sec)</Text>
                    <Text className="text-xs text-muted">Tense each muscle group</Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <Text className="text-primary font-bold">2.</Text>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-foreground">Release & Relax (7 sec)</Text>
                    <Text className="text-xs text-muted">Feel tension melt away</Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <Text className="text-primary font-bold">3.</Text>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-foreground">Rest (3 sec)</Text>
                    <Text className="text-xs text-muted">Breathe and prepare for next</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="gap-3">
              <TouchableOpacity
                className="bg-primary rounded-lg py-4 items-center"
                onPress={handleStartExercise}
              >
                <Text className="text-white font-semibold text-base">Start Exercise</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-surface border border-border rounded-lg py-4 items-center"
                onPress={() => router.back()}
              >
                <Text className="text-foreground font-semibold">Back to Resources</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning border-opacity-30">
              <Text className="text-xs text-muted leading-relaxed">
                💡 Find a quiet, comfortable space. This exercise works best when lying down or sitting comfortably.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Exercise in progress
  if (isRunning && (phase === 'tense' || phase === 'release' || phase === 'rest')) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 flex-col">
          {/* Header */}
          <View className="bg-primary px-6 py-4">
            <Text className="text-white text-sm opacity-80">Progressive Muscle Relaxation</Text>
            <Text className="text-white text-2xl font-bold mt-2">{formatTime(timeRemaining)}</Text>
          </View>

          {/* Main content */}
          <ScrollView
            className="flex-1 px-6 py-8"
            contentContainerStyle={{ justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-8">
              {/* Breathing circle */}
              <View className="items-center gap-4">
                <Animated.View
                  className="w-40 h-40 rounded-full bg-primary bg-opacity-20 items-center justify-center border-2 border-primary border-opacity-30"
                  style={{ transform: [{ scale: breatheScale }] }}
                >
                  <Text className="text-6xl">🫁</Text>
                </Animated.View>
                <Text className="text-lg font-semibold text-primary capitalize">
                  {phase}
                </Text>
              </View>

              {/* Phase information */}
              <View className="bg-surface border border-border rounded-xl p-6 gap-4">
                <Text className={cn('text-xl font-bold', getPhaseColor())}>
                  {getPhaseText()}
                </Text>
                <View className="gap-3">
                  {currentMuscle.instructions.map((instruction, idx) => (
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
                    {currentSession.currentMuscleIndex + 1} of {muscleGroups.length}
                  </Text>
                </View>
                <View className="bg-surface rounded-full h-2 overflow-hidden">
                  <View
                    className="bg-primary h-full"
                    style={{
                      width: `${((currentSession.currentMuscleIndex + 1) / muscleGroups.length) * 100}%`,
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
                onPress={() => setIsRunning(!isRunning)}
              >
                <Text className="text-white font-semibold">
                  {isRunning ? 'Pause' : 'Resume'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-error bg-opacity-20 border border-error rounded-lg py-3 items-center"
                onPress={() => {
                  handleCompleteExercise();
                }}
              >
                <Text className="text-error font-semibold">End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Default view
  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8 justify-center gap-6">
          <View className="items-center gap-4">
            <Text className="text-6xl">💆</Text>
            <Text className="text-2xl font-bold text-foreground text-center">
              Progressive Muscle Relaxation
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              A guided journey to release tension from your entire body, starting from your toes and moving up to your head.
            </Text>
          </View>

          <View className="bg-surface border border-border rounded-xl p-6 gap-4">
            <Text className="text-sm font-semibold text-foreground mb-2">What to expect:</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <Text className="text-primary font-bold">1.</Text>
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-semibold text-foreground">Focus & Tense (5 sec)</Text>
                  <Text className="text-xs text-muted">Tense each muscle group</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <Text className="text-primary font-bold">2.</Text>
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-semibold text-foreground">Release & Relax (7 sec)</Text>
                  <Text className="text-xs text-muted">Feel tension melt away</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <Text className="text-primary font-bold">3.</Text>
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-semibold text-foreground">Rest (3 sec)</Text>
                  <Text className="text-xs text-muted">Breathe and prepare for next</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              className="bg-primary rounded-lg py-4 items-center"
              onPress={handleStartExercise}
            >
              <Text className="text-white font-semibold text-base">Start Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-surface border border-border rounded-lg py-4 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-foreground font-semibold">Back to Resources</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning border-opacity-30">
            <Text className="text-xs text-muted leading-relaxed">
              💡 Find a quiet, comfortable space. This exercise works best when lying down or sitting comfortably.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
