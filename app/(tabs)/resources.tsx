import { ScrollView, Text, View, TouchableOpacity, Modal, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
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
    id: 'pmr-therapy',
    title: 'Progressive Muscle Relaxation',
    category: 'Meditation',
    description: 'Release tension from your entire body through guided muscle relaxation',
    icon: '💆',
    duration: '18 min',
    type: 'exercise',
    exerciseId: 'pmr-therapy',
    route: '/pmr-detail',
  },
  {
    id: '4',
    title: 'Managing Anxiety Spirals',
    category: 'Coping Techniques',
    description: 'Know strategies to interrupt anxious thoughts and break free from the spiral',
    icon: '🧠',
    duration: '12 min',
    fullContent: `When the Mind Turns Against Itself

There is a particular kind of exhaustion that comes not from working too hard or sleeping too little, but from thinking too much. Anxiety spirals are not a sign of weakness. They are, in a very literal neurological sense, the brain doing exactly what it was designed to do — only doing it in the wrong context, at the wrong time, and without an off switch. Understanding why that happens is the first step toward changing it.

What Is Actually Happening in the Brain

When threat is perceived, whether real or imagined, the amygdala triggers a stress response. Cortisol and adrenaline flood the bloodstream. Heart rate climbs. Breathing becomes shallow. Thoughts narrow and loop. This is the same mechanism that helped early humans survive predators. The problem is that the brain cannot reliably tell the difference between a tiger and a difficult conversation, a job interview, or the silence after a breakup. For teenagers especially, this system is running on particularly sensitive hardware. The adolescent brain is still developing its prefrontal cortex, which is the region responsible for rational thought, perspective-taking, and emotional regulation. That is not an excuse. It is a biological fact worth treating seriously.

The Spiral Itself

Anxiety spirals tend to follow a recognizable pattern. A triggering thought or sensation arrives. The nervous system responds with physical symptoms. The physical symptoms become new evidence that something is wrong. That evidence feeds more frightening thoughts. Those thoughts produce stronger physical symptoms. The loop tightens. What makes this particularly cruel is that the harder one tries to stop thinking anxious thoughts, the more prominent those thoughts become. This is sometimes called the white bear phenomenon, named after a well-known psychological experiment by Daniel Wegner: ask someone not to think about a white bear, and a white bear is practically all they can think about.

Grounding Before Everything Else

The most clinically consistent first-line response to an active anxiety spiral is grounding, not because it is simple, but because it works directly on the nervous system rather than trying to argue with it. The 5-4-3-2-1 technique asks the person to name five things they can see, four they can physically touch, three they can hear, two they can smell, and one they can taste. This is not a distraction trick. It is a deliberate redirection of attentional resources from internal catastrophizing to external sensory input, which activates the parasympathetic nervous system and begins to slow the spiral down. Box breathing, which involves inhaling for four counts, holding for four, exhaling for four, and holding again for four, works on a similar principle. It gives the body something measurable and rhythmic to do, which is often what a spiraling mind most needs.

Movement as Medicine

There is a reason that exercise appears in nearly every mental health guideline published in the last two decades. Physical movement clears cortisol, releases endorphins, and breaks the body out of the frozen, contracted state that anxiety tends to create. This does not require a gym or a training plan. A ten-minute walk, even a slow one, produces measurable reductions in anxiety symptoms according to a 2018 review in Frontiers in Psychiatry. For younger people especially, the body often holds anxiety before the mind has even named it. Moving is sometimes the most direct route to relief available.

What to Say to Yourself

Cognitive reframing is a cornerstone of evidence-based anxiety treatment, but it deserves a more honest introduction than it usually gets. Telling someone in the middle of a spiral to "think positively" is not just unhelpful. It can make things worse by adding a layer of shame onto an already overloaded system. What actually works is something more modest and more truthful. Statements like "this feeling is temporary," "the worst case scenario is unlikely and manageable," and "anxiety feels dangerous but is not" work not because they are inspiring but because they are accurate. The goal is not to override the feeling. The goal is to stop adding fuel to it.

Connection Is Not Optional

Isolation is among the most reliable ways to make anxiety worse. When distress is shared, even incompletely, even imperfectly, with another person who responds with something resembling understanding, the nervous system calms. This is not metaphorical. Research on social buffering, including studies by the University of Virginia and later replicated in adolescent populations, shows that the physical presence of a trusted person reduces hypothalamic stress responses in measurable ways. Reaching out is not a weakness. For both teenagers navigating heartbreak and adults carrying grief or financial strain, it is often the most direct intervention available. A text that says "today has been hard" is a clinical act.

A Final Word on Patience

Managing anxiety is not a skill that arrives fully formed. It builds slowly, through repeated practice, through failed attempts that still count for something, and through the gradual accumulation of evidence that the spiral has an end. Every time the breath slows down before the catastrophe arrives, the nervous system learns something. That learning is real, it is durable, and it does not disappear when the next hard season comes.`,
  },
  {
    id: '5',
    title: 'Self-Compassion Meditation',
    category: 'Meditation',
    description: 'Cultivate kindness toward yourself',
    icon: '💝',
    duration: '7 min',
    fullContent: `Finding Kindness Within

This practice takes about seven minutes. There is nothing to get right. Your only task is to be present.

--- PHASE 1: SETTLING (1 minute) ---

Find a comfortable position — sitting, lying, or standing. Close your eyes, or let your gaze soften toward the floor. Take three slow breaths. Feel the weight of your body supported beneath you.

--- PHASE 2: ACKNOWLEDGE (2 minutes) ---

Bring to mind something that is difficult right now. Not the hardest thing you've ever faced — just something that feels a little uncomfortable today. Notice where you feel that discomfort in your body. A tightness? A heaviness? You don't need to fix it. Simply say, quietly, to yourself:

"This is a moment of difficulty."

Let that be enough for now.

--- PHASE 3: COMMON HUMANITY (2 minutes) ---

You are not alone in this feeling. Right now, thousands of people around the world feel exactly what you are feeling. Difficulty is part of being human. Say to yourself:

"I am not alone. Struggle is part of life."

--- PHASE 4: SELF-KINDNESS (2 minutes) ---

Place one hand gently on your heart if that feels comfortable. Feel the warmth of your own touch. Ask yourself: "What would I say to a dear friend who felt this way?" Then — say that to yourself. You deserve the same kindness.

A phrase you might try:
"May I be gentle with myself in this moment."
"May I give myself the compassion I need."

--- CLOSE ---

When you're ready, take one more slow breath. Open your eyes gently. Carry this kindness with you.`,
  },
  {
    id: '5a',
    title: 'Micro Self-Compassion Break',
    category: 'Meditation',
    description: 'A 3-minute gentle reset when emotions feel intense',
    icon: '🌿',
    duration: '3 min',
    fullContent: `Quick Kindness Reset

When feelings feel too big, this 3-minute practice brings you back to center.

--- PHASE 1: PAUSE (1 minute) ---

Stop what you're doing. Place one hand on your heart. Feel it beating. You are alive. You are here.

--- PHASE 2: NAME IT (1 minute) ---

Say to yourself: "This is hard right now. And that's okay. I'm allowed to feel this."

--- PHASE 3: KINDNESS (1 minute) ---

Whisper to yourself: "May I be gentle with myself. I deserve kindness, especially now."

Take one more breath. You did it.`,
  },
  {
    id: '5b',
    title: 'Self-Forgiveness Meditation',
    category: 'Meditation',
    description: 'Release anger and self-judgment with compassion',
    icon: '🌟',
    duration: '10 min',
    fullContent: `Letting Go With Kindness

Self-forgiveness is not about excusing harm — it's about releasing the grip of shame so you can move forward.

--- PHASE 1: SETTLING (2 minutes) ---

Find stillness. Breathe slowly. You are safe here.

--- PHASE 2: ACKNOWLEDGE THE PAIN (3 minutes) ---

Bring to mind something you're angry at yourself about. Don't minimize it. Feel it fully. Say: "I hurt. I made a mistake. I'm human."

--- PHASE 3: UNDERSTAND (2 minutes) ---

You did the best you could with what you knew then. That's the truth. Say: "I was doing my best. I didn't know better then. I know better now."

--- PHASE 4: RELEASE (3 minutes) ---

Place both hands on your heart. Say: "I forgive myself. I am learning. I am growing. I deserve my own compassion."

Let the weight lift, bit by bit.`,
  },
  {
    id: '5c',
    title: 'Loving-Kindness for Beginners',
    category: 'Meditation',
    description: 'Start your self-compassion journey with this gentle introduction',
    icon: '💕',
    duration: '5 min',
    fullContent: `Your First Step Into Kindness

This is a beginner-friendly introduction to extending kindness — first to yourself, then gently outward.

--- PHASE 1: CENTER (1 minute) ---

Sit comfortably. Close your eyes. Breathe.

--- PHASE 2: KINDNESS TO YOURSELF (2 minutes) ---

Repeat slowly, three times:
"May I be safe."
"May I be healthy."
"May I be at peace."

Feel each word. You deserve this.

--- PHASE 3: KINDNESS TO OTHERS (1 minute) ---

Bring to mind someone you care about. Say:
"May you be safe. May you be healthy. May you be at peace."

--- PHASE 4: CLOSE (1 minute) ---

Return to yourself. Say one more time:
"May I be kind to myself today."

That's all. You've begun.`,
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
          } else if (resource.fullContent) {
      Alert.alert(resource.title, resource.fullContent);
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
      } else if (resource.fullContent) {
      Alert.alert(resource.title, resource.fullContent);
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
  const router = useRouter();
  const { exercises } = useBreathing();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const filteredResources =
    selectedCategory === 'All'
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === selectedCategory);

  const handleResourcePress = (resource: any) => {
    if (resource.type === 'exercise') {
      if (resource.route) {
        router.push(resource.route);
      } else {
        setSelectedExercise(resource);
      }
    } else if (resource.fullContent) {
      setSelectedContent(resource);
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
            <Text className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'Fredoka-Bold' }}>Wellness Resources</Text>
            <Text className="text-base text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>
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
                  style={{ fontFamily: 'Fredoka-Medium' }}
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
                      <Text className="text-sm font-semibold text-foreground flex-1" style={{ fontFamily: 'Fredoka-SemiBold' }}>
                        {resource.title}
                      </Text>
                      <Text className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded" style={{ fontFamily: 'Fredoka-Medium' }}>
                        {resource.category}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted mb-2" style={{ fontFamily: 'Quicksand-Regular' }}>{resource.description}</Text>
                    <Text className="text-xs text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>⏱️ {resource.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ad Placeholder */}
          <View className="bg-surface rounded-lg p-4 border border-border items-center justify-center h-24 gap-2">
            <Text className="text-sm text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>Advertisement</Text>
            <Text className="text-xs text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>Sponsored wellness content</Text>
          </View>

          {/* Crisis Support Banner */}
          <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning border-opacity-30 gap-2">
            <Text className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Fredoka-SemiBold' }}>Need Immediate Help?</Text>
            <Text className="text-xs text-muted mb-3" style={{ fontFamily: 'Quicksand-Regular' }}>
              If you're in crisis, please reach out to emergency services or a crisis hotline.
            </Text>
            <TouchableOpacity className="bg-warning rounded-lg py-2 px-4 items-center">
              <Text className="text-white font-semibold text-sm" style={{ fontFamily: 'Fredoka-SemiBold' }}>Get Crisis Help</Text>
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

      {/* Content Detail Modal */}
      <Modal visible={!!selectedContent} animationType="slide" transparent>
        <ScreenContainer className="bg-background">
          <View className="flex-1 flex-col">
            {/* Header */}
            <View className="bg-primary px-6 py-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Fredoka-Bold' }}>
                  {selectedContent?.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedContent(null)}>
                <Text className="text-white text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
              <Text className="text-base text-foreground leading-relaxed" style={{ fontFamily: 'Quicksand-Regular' }}>
                {selectedContent?.fullContent}
              </Text>
            </ScrollView>
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
