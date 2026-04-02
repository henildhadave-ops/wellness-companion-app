import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const RESOURCES = [
  {
    id: '1',
    title: 'Guided Breathing Exercise',
    category: 'Meditation',
    description: 'A 5-minute breathing technique to calm your mind',
    icon: '🫁',
    duration: '5 min',
  },
  {
    id: '2',
    title: 'Grounding Technique: 5-4-3-2-1',
    category: 'Coping Techniques',
    description: 'Ground yourself in the present moment',
    icon: '🌍',
    duration: '3 min',
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

const CATEGORIES = ['All', 'Meditation', 'Coping Techniques', 'Self-Care', 'Crisis', 'Professional'];

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources =
    selectedCategory === 'All'
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === selectedCategory);

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
    </ScreenContainer>
  );
}
