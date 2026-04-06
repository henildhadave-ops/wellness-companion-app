import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useWellness } from '@/lib/wellness-context';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function JournalScreen() {
  const { addJournalEntry, journalEntries } = useWellness();
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emotions = ['happy', 'sad', 'anxious', 'calm', 'angry', 'peaceful', 'hopeful', 'overwhelmed'];
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

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something in your journal');
      return;
    }

    setIsSubmitting(true);
    try {
      await addJournalEntry(content, emotion || undefined, isPrivate);
      Alert.alert('Success', 'Your journal entry has been saved!');
      setContent('');
      setEmotion(null);
      setIsWriting(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isWriting) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 flex-col">
          {/* Header */}
          <View className="px-6 py-4 border-b border-border">
            <Text className="text-2xl font-bold text-primary" style={{ fontFamily: 'Fredoka-Bold' }}>New Entry</Text>
            <Text className="text-sm text-muted mt-1" style={{ fontFamily: 'Quicksand-Regular' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            {/* Emotion Selection */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'Fredoka-SemiBold' }}>How are you feeling?</Text>
              <View className="flex-row flex-wrap gap-2">
                {emotions.map((emo) => (
                  <TouchableOpacity
                    key={emo}
                    className={cn(
                      'rounded-full px-4 py-2',
                      emotion === emo
                        ? 'bg-primary'
                        : 'bg-surface border border-border'
                    )}
                    onPress={() => setEmotion(emotion === emo ? null : emo)}
                  >
                    <Text className={cn(
                      'text-sm font-medium capitalize',
                      emotion === emo ? 'text-white' : 'text-foreground'
                    )}>
                      {emotionEmoji[emo]} {emo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Text Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'Fredoka-SemiBold' }}>Your thoughts</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="Write freely. This is your safe space..."
                placeholderTextColor="#9BA1A6"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            {/* Privacy Toggle */}
            <TouchableOpacity
              className="flex-row items-center gap-3 mb-6"
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <View className={cn('w-5 h-5 rounded border-2 border-primary items-center justify-center', isPrivate && 'bg-primary')}>
                {isPrivate && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">Keep this entry private</Text>
                <Text className="text-xs text-muted">Only you can see this entry</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Actions */}
          <View className="px-6 py-4 border-t border-border gap-3 flex-row">
            <TouchableOpacity
              className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
              onPress={() => {
                setIsWriting(false);
                setContent('');
                setEmotion(null);
              }}
            >
              <Text className="text-foreground font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={cn('flex-1 bg-primary rounded-lg py-3 items-center', isSubmitting && 'opacity-60')}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="text-white font-semibold">
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'Fredoka-Bold' }}>Your Journal</Text>
            <Text className="text-base text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>
              A safe space for your thoughts and feelings
            </Text>
          </View>

          {/* New Entry Button */}
          <TouchableOpacity
            className="bg-primary rounded-lg py-4 items-center"
            onPress={() => setIsWriting(true)}
          >
            <Text className="text-white font-semibold text-base" style={{ fontFamily: 'Fredoka-SemiBold' }}>✍️ Write New Entry</Text>
          </TouchableOpacity>

          {/* Entries List */}
          {journalEntries.length > 0 ? (
            <View className="gap-4">
              <Text className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Fredoka-SemiBold' }}>Recent Entries</Text>
              {journalEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <View
                    key={entry.id}
                    className="bg-surface rounded-lg p-4 border border-border"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Fredoka-SemiBold' }}>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                      {entry.emotion && (
                        <Text className="text-lg">{emotionEmoji[entry.emotion] || '😊'}</Text>
                      )}
                    </View>
                    <Text className="text-sm text-muted leading-relaxed line-clamp-3" style={{ fontFamily: 'Quicksand-Regular' }}>
                      {entry.content}
                    </Text>
                    {entry.isPrivate && (
                      <Text className="text-xs text-muted mt-2" style={{ fontFamily: 'Quicksand-Regular' }}>🔒 Private</Text>
                    )}
                  </View>
                ))}
            </View>
          ) : (
            <View className="bg-surface rounded-lg p-8 border border-border items-center gap-3">
              <Text className="text-4xl">📝</Text>
              <Text className="text-base font-semibold text-foreground text-center" style={{ fontFamily: 'Fredoka-SemiBold' }}>
                No entries yet
              </Text>
              <Text className="text-sm text-muted text-center">
                Start journaling to reflect on your thoughts and feelings
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
