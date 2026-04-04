import { ScrollView, Text, View, TouchableOpacity, Modal, Alert, Animated } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useBreathing } from '@/lib/breathing-context';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const RESOURCES = [
  {
    id: 'breathing-uplifting',
    title: 'Five Minutes to Brightness',
    category: 'Breathing',
    description: 'An uplifting breathing practice to clear mental clutter and invite lightness',
    icon: '🫁',
    duration: '5 min',
    type: 'exercise',
    exerciseId: 'uplifting-breath',
  },
  {
    id: 'grounding-5-4-3-2-1',
    title: 'Grounding Technique: 5-4-3-2-1',
    category: 'Breathing',
    description: 'Anchor yourself in the present moment using your five senses',
    icon: '🌍',
    duration: '10 min',
    type: 'exercise',
    exerciseId: '5-4-3-2-1-grounding',
  },
  {
    id: '3',
    title: 'Progressive Muscle Relaxation',
    category: 'Meditation',
    description: 'Release tension from your body systematically',
    icon: '💆',
    duration: '10 min',
  },
  {
    id: '4',
    title: 'Managing Anxiety Spirals',
    category: 'Coping Techniques',
    description: 'Learn strategies to interrupt anxious thoughts',
    icon: '🧠',
    duration: '8 min',
  },
  {
    id: '5',
    title: 'Self-Compassion Meditation',
    category: 'Meditation',
    description: 'Cultivate kindness toward yourself',
    icon: '💝',
    duration: '7 min',
  },
  {
    id: '6',
    title: 'Sleep Preparation Routine',
    category: 'Self-Care',
    description: 'Prepare your mind and body for restful sleep',
    icon: '😴',
    duration: '15 min',
  },
  {
    id: '7',
    title: 'Crisis Support Resources',
    category: 'Crisis',
    description: 'Emergency contacts and immediate help',
    icon: '🆘',
    duration: 'Always available',
  },
  {
    id: '8',
    title: 'Finding Professional Help',
    category: 'Professional',
    description: 'Directory of therapists and counselors',
    icon: '👨‍⚕️',
    duration: 'Reference',
  },
];

const CATEGORIES = ['All', 'Meditation', 'Coping Techniques', 'Self-Care', 'Breathing', 'Crisis', 'Professional'];

// Breathing Exercise Modal
function BreathingExerciseModal({ resource, visible, onClose }: any) {
  const { exercises, startSession, endSession } = useBreathing();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breathePhase, setBreathaPhase] = useState<'inhale' | 'pause' | 'exhale' | 'idle'>('idle');
  const [sessionStarted, setSessionStarted] = useState(false);
  const breatheScale = useRef(new Animated.Value(1)).current;

  const exercise = exercises.find((e) => e.id === resource?.exerciseId);
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

  // Breathing cycle effect
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

  const handleStartExercise = async () => {
    if (exercise) {
      try {
        await startSession(exercise.id);
        setSessionStarted(true);
        setCurrentPhaseIndex(0);
        setTimeRemaining(exercise.phases[0]?.duration || 0);
        setIsRunning(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to start exercise');
      }
    }
  };

  const handleCompleteExercise = async () => {
    setIsRunning(false);
    await endSession();
    Alert.alert('Great Job!', 'You have completed this exercise. Keep up your wellness practice!');
    setSessionStarted(false);
    setCurrentPhaseIndex(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!resource || !exercise) return null;

  // Exercise in progress
  if (sessionStarted && isRunning) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
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
                {/* Breathing animation */}
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
                    onClose();
                  }}
                >
                  <Text className="text-error font-semibold">End</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScreenContainer>
      </Modal>
    );
  }

  // Exercise ready to start
  if (sessionStarted) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <ScreenContainer className="bg-background">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View className="flex-1 px-6 py-8 justify-center gap-6">
              <View className="items-center gap-4">
                <Text className="text-6xl">{resource.icon}</Text>
                <Text className="text-2xl font-bold text-foreground text-center">
                  {exercise.name}
                </Text>
                <Text className="text-base text-muted text-center leading-relaxed">
                  {exercise.description}
                </Text>
              </View>

              <View className="bg-surface border border-border rounded-xl p-6 gap-4">
                <Text className="text-sm font-semibold text-foreground mb-2">What to expect:</Text>
                <View className="gap-3">
                  {exercise.phases.map((phase, idx) => (
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
                  onPress={() => setIsRunning(true)}
                >
                  <Text className="text-white font-semibold text-base">Begin Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-surface border border-border rounded-lg py-4 items-center"
                  onPress={() => {
                    setSessionStarted(false);
                    onClose();
                  }}
                >
                  <Text className="text-foreground font-semibold">Back to Resources</Text>
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
      </Modal>
    );
  }

  // Exercise selection view
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="px-6 py-8 gap-6">
            <View className="items-center gap-2 mb-4">
              <Text className="text-6xl">{resource.icon}</Text>
              <Text className="text-2xl font-bold text-primary text-center">{resource.title}</Text>
              <Text className="text-base text-muted text-center">
                {resource.description}
              </Text>
            </View>

            <View className="bg-surface border border-border rounded-xl p-6 gap-4">
              <Text className="text-sm font-semibold text-foreground mb-2">About this exercise:</Text>
              <Text className="text-sm text-muted leading-relaxed">
                Duration: {resource.duration}
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Category: {resource.category}
              </Text>
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
                onPress={onClose}
              >
                <Text className="text-foreground font-semibold">Back to Resources</Text>
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
    </Modal>
  );
}

export default function ResourcesScreen() {
  const { exercises } = useBreathing();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const filteredResources =
    selectedCategory === 'All'
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === selectedCategory);

  const handleResourcePress = (resource: any) => {
    if (resource.type === 'exercise') {
      setSelectedExercise(resource);
    } else {
      Alert.alert(resource.title, resource.description);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-primary mb-2">Wellness Resources</Text>
            <Text className="text-base text-muted">
              Curated tools and techniques for your wellbeing
            </Text>
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                className={cn(
                  'rounded-full px-4 py-2',
                  selectedCategory === category
                    ? 'bg-primary'
                    : 'bg-surface border border-border'
                )}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  className={cn(
                    'text-sm font-medium',
                    selectedCategory === category ? 'text-white' : 'text-foreground'
                  )}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Resources Grid */}
          <View className="gap-4">
            {filteredResources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                className="bg-surface rounded-lg p-4 border border-border active:opacity-70"
                onPress={() => handleResourcePress(resource)}
              >
                <View className="flex-row items-start gap-4">
                  <Text className="text-4xl">{resource.icon}</Text>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-sm font-semibold text-foreground flex-1">
                        {resource.title}
                      </Text>
                      <Text className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                        {resource.category}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted mb-2">{resource.description}</Text>
                    <Text className="text-xs text-muted">⏱️ {resource.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ad Placeholder */}
          <View className="bg-surface rounded-lg p-4 border border-border items-center justify-center h-24 gap-2">
            <Text className="text-sm text-muted">Advertisement</Text>
            <Text className="text-xs text-muted">Sponsored wellness content</Text>
          </View>

          {/* Crisis Support Banner */}
          <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning border-opacity-30 gap-2">
            <Text className="text-sm font-semibold text-foreground">Need Immediate Help?</Text>
            <Text className="text-xs text-muted mb-3">
              If you're in crisis, please reach out to emergency services or a crisis hotline.
            </Text>
            <TouchableOpacity className="bg-warning rounded-lg py-2 px-4 items-center">
              <Text className="text-white font-semibold text-sm">Get Crisis Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Breathing Exercise Modal */}
      <BreathingExerciseModal
        resource={selectedExercise}
        visible={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </ScreenContainer>
  );
}
