import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useWellness } from '@/lib/wellness-context';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const EMOTIONS = [
  { name: 'happy', emoji: '😊', color: '#FFD700' },
  { name: 'sad', emoji: '😢', color: '#4169E1' },
  { name: 'anxious', emoji: '😰', color: '#FF6347' },
  { name: 'calm', emoji: '😌', color: '#90EE90' },
  { name: 'angry', emoji: '😠', color: '#FF4500' },
  { name: 'peaceful', emoji: '🧘', color: '#9370DB' },
  { name: 'hopeful', emoji: '🌟', color: '#FFB6C1' },
  { name: 'overwhelmed', emoji: '😵', color: '#FF8C00' },
];

export default function MoodScreen() {
  const { addMoodEntry, getTodayMood, getMoodTrend } = useWellness();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayMood = getTodayMood();
  const moodTrend = getMoodTrend(7);

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      Alert.alert('Error', 'Please select an emotion');
      return;
    }

    setIsSubmitting(true);
    try {
      await addMoodEntry(selectedEmotion, intensity, note);
      Alert.alert('Success', 'Your mood has been logged!');
      setSelectedEmotion(null);
      setIntensity(5);
      setNote('');
    } catch (error) {
      Alert.alert('Error', 'Failed to log mood');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emotionEmoji: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    calm: '😌',
    angry: '😠',
    peaceful: '🧘',
    hopeful: '🌟',
    overwhelmed: '😵',
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8 gap-8">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'Fredoka-Bold' }}>How are you feeling?</Text>
            <Text className="text-base text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>
              Check in with yourself and track your emotional wellbeing
            </Text>
          </View>

          {/* Emotion Selection */}
          <View className="gap-4">
            <Text className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Fredoka-SemiBold' }}>Select your emotion</Text>
            <View className="flex-row flex-wrap gap-3">
              {EMOTIONS.map((emotion) => (
                <TouchableOpacity
                  key={emotion.name}
                  className={cn(
                    'rounded-full p-4 items-center justify-center',
                    selectedEmotion === emotion.name
                      ? 'bg-primary border-2 border-primary'
                      : 'bg-surface border border-border'
                  )}
                  onPress={() => setSelectedEmotion(emotion.name)}
                >
                  <Text className="text-3xl mb-1">{emotion.emoji}</Text>
                  <Text className={cn(
                    'text-xs font-medium capitalize',
                    selectedEmotion === emotion.name ? 'text-white' : 'text-foreground'
                  )}>
                    {emotion.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Intensity Slider */}
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Fredoka-SemiBold' }}>Intensity</Text>
              <Text className="text-2xl font-bold text-primary" style={{ fontFamily: 'Fredoka-Bold' }}>{intensity}/10</Text>
            </View>
            <View className="flex-row gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  className={cn(
                    'flex-1 h-8 rounded-lg',
                    i < intensity ? 'bg-primary' : 'bg-surface border border-border'
                  )}
                  onPress={() => setIntensity(i + 1)}
                />
              ))}
            </View>
          </View>

          {/* Note Input */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Fredoka-SemiBold' }}>Add a note (optional)</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="What's on your mind?"
              placeholderTextColor="#9BA1A6"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={cn(
              'bg-primary rounded-lg py-4 items-center',
              isSubmitting && 'opacity-60'
            )}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-white font-semibold text-base" style={{ fontFamily: 'Fredoka-SemiBold' }}>
              {isSubmitting ? 'Logging...' : 'Log Mood'}
            </Text>
          </TouchableOpacity>

          {/* Today's Mood */}
          {todayMood && (
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                Today's Logged Mood
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">{emotionEmoji[todayMood.emotion] || '😊'}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground capitalize">
                    {todayMood.emotion}
                  </Text>
                  <Text className="text-sm text-muted">
                    Intensity: {todayMood.intensity}/10
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 7-Day Trend */}
          {moodTrend.length > 0 && (
            <View className="gap-4">
              <Text className="text-sm font-semibold text-foreground">7-Day Trend</Text>
              <View className="bg-surface rounded-xl p-4 border border-border gap-3">
                {moodTrend.map((mood) => (
                  <View key={mood.id} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="text-xl">{emotionEmoji[mood.emotion] || '😊'}</Text>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-foreground capitalize">
                          {mood.emotion}
                        </Text>
                        <Text className="text-xs text-muted">
                          {new Date(mood.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <View
                          key={i}
                          className={cn(
                            'w-1 h-4 rounded-sm',
                            i < mood.intensity ? 'bg-primary' : 'bg-border'
                          )}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
