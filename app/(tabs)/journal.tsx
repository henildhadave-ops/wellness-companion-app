import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useWellness } from '@/lib/wellness-context';
import { useColors } from '@/hooks/use-colors';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  emotion: string;
  isPrivate: boolean;
  timestamp: string;
  date: string;
  time: string;
}

const PROMPTS = [
  "If your closest friend felt exactly how you feel today, what would you say to them?",
  "Write about one thing you did today that took effort. Acknowledge it.",
  "What would you tell your younger self about what you are going through?",
  "Describe a moment this week when you were hard on yourself. How could you reframe it with kindness?",
  "What does good enough look like for you today?",
  "What are you grateful for today?",
  "What challenged you today?",
  "How are you feeling right now?",
  "What would make tomorrow better?",
  "What did you learn about yourself today?",
];

const EMOTION_ICONS: Record<string, string> = {
  grounded: '🌿',
  radiant: '☀️',
  flowing: '💧',
  pensive: '☁️',
  peaceful: '🕊️',
  hopeful: '🌟',
};

export default function JournalScreen() {
  const colors = useColors();
  const { journalEntries, addJournalEntry } = useWellness();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('peaceful');
  const [isPrivate, setIsPrivate] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showEntryDetail, setShowEntryDetail] = useState(false);

  useEffect(() => {
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Please fill in title and content');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      title,
      content,
      emotion: selectedEmotion,
      isPrivate,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      await addJournalEntry(entry);
      Alert.alert('Success', 'Your reflection has been saved with kindness.');
      setTitle('');
      setContent('');
      setSelectedEmotion('peaceful');
      setShowNewEntry(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const handleUsePrompt = () => {
    setContent(currentPrompt + '\n\n');
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowEntryDetail(true);
  };

  const pastEntries = (journalEntries as JournalEntry[]).slice(0, 3);

  return (
    <ScreenContainer className="p-0">
      {!showNewEntry ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          {journalEntries.length > 0 && (
            <View className="px-6 py-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold" style={{ fontFamily: 'Fredoka', color: colors.foreground }}>
                  Past Reflections
                </Text>
                {journalEntries.length > 3 && (
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold" style={{ fontFamily: 'Fredoka', color: '#FFB366' }}>
                      VIEW ALL
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {pastEntries.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  onPress={() => handleViewEntry(entry)}
                  className="mb-4 p-4 rounded-2xl"
                  style={{ backgroundColor: '#FFF9F0', borderLeftWidth: 4, borderLeftColor: '#FFB366' }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-sm" style={{ fontFamily: 'Quicksand', color: '#999' }}>
                        {entry.date} • {entry.time}
                      </Text>
                      <Text className="text-lg font-bold mt-1" style={{ fontFamily: 'Fredoka', color: colors.foreground }}>
                        {entry.title}
                      </Text>
                    </View>
                    <Text className="text-2xl ml-2">{EMOTION_ICONS[entry.emotion] || '💭'}</Text>
                  </View>
                  <Text
                    className="text-sm"
                    style={{ fontFamily: 'Quicksand', color: '#666' }}
                    numberOfLines={2}
                  >
                    {entry.content}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="px-6 py-2">
            <View className="p-6 rounded-3xl" style={{ backgroundColor: '#4A9B8E' }}>
              <View className="flex-row items-start mb-3">
                <Text className="text-2xl mr-3">💡</Text>
                <Text className="flex-1 text-lg font-bold" style={{ fontFamily: 'Fredoka', color: 'white' }}>
                  Today's Reflection
                </Text>
              </View>
              <Text className="text-sm mb-4" style={{ fontFamily: 'Quicksand', color: 'rgba(255,255,255,0.9)' }}>
                {currentPrompt}
              </Text>
              <TouchableOpacity
                onPress={() => setShowNewEntry(true)}
                className="self-start px-6 py-2 rounded-full"
                style={{ backgroundColor: 'white' }}
              >
                <Text className="font-bold text-sm" style={{ fontFamily: 'Fredoka', color: '#4A9B8E' }}>
                  USE PROMPT
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-6 py-6">
            <TouchableOpacity
              onPress={() => setShowNewEntry(true)}
              className="p-6 rounded-3xl items-center"
              style={{ backgroundColor: '#FFD580' }}
            >
              <Text className="text-2xl mb-2">✍️</Text>
              <Text className="text-lg font-bold" style={{ fontFamily: 'Fredoka', color: colors.foreground }}>
                Start Writing
              </Text>
              <Text className="text-sm mt-1" style={{ fontFamily: 'Quicksand', color: colors.muted }}>
                Express your thoughts and feelings
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold" style={{ fontFamily: 'Fredoka', color: colors.foreground }}>
                Ink for the quiet soul.
              </Text>
              <TouchableOpacity onPress={() => setShowNewEntry(false)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Give your reflection a title"
              value={title}
              onChangeText={setTitle}
              className="p-4 rounded-xl mb-4 text-base"
              style={{
                fontFamily: 'Fredoka',
                backgroundColor: '#FFF9F0',
                color: colors.foreground,
              }}
              placeholderTextColor={colors.muted}
            />

            <Text className="text-sm font-bold mb-3" style={{ fontFamily: 'Fredoka', color: colors.foreground }}>
              How does your heart feel right now?
            </Text>
            <View className="flex-row justify-between mb-6">
              {Object.entries(EMOTION_ICONS).map(([emotion, icon]) => (
                <TouchableOpacity
                  key={emotion}
                  onPress={() => setSelectedEmotion(emotion)}
                  className={`p-3 rounded-full items-center ${
                    selectedEmotion === emotion ? 'border-2' : 'border-0'
                  }`}
                  style={{
                    backgroundColor: selectedEmotion === emotion ? '#FFE5B4' : '#FFF9F0',
                    borderColor: '#FFB366',
                  }}
                >
                  <Text className="text-2xl">{icon}</Text>
                  <Text className="text-xs mt-1 capitalize" style={{ fontFamily: 'Quicksand', color: colors.foreground }}>
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Begin your reflection..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              className="p-4 rounded-xl mb-4"
              style={{
                fontFamily: 'Quicksand',
                backgroundColor: '#FFF9F0',
                color: colors.foreground,
                minHeight: 200,
              }}
              placeholderTextColor={colors.muted}
            />

            <View className="flex-row items-center mb-6 p-4 rounded-xl" style={{ backgroundColor: '#FFF9F0' }}>
              <TouchableOpacity
                onPress={() => setIsPrivate(!isPrivate)}
                className={`w-6 h-6 rounded border-2 items-center justify-center mr-3`}
                style={{ borderColor: '#FFB366', backgroundColor: isPrivate ? '#FFB366' : 'transparent' }}
              >
                {isPrivate && <Text className="text-white font-bold">✓</Text>}
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Quicksand', color: colors.foreground }}>
                {isPrivate ? 'Private' : 'Shared'} - Only you can see this
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSaveEntry}
              className="p-4 rounded-full items-center mb-6"
              style={{ backgroundColor: '#8B6F47' }}
            >
              <Text className="text-white font-bold" style={{ fontFamily: 'Fredoka' }}>
                SAVE ENTRY ✓
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <Modal visible={showEntryDetail} animationType="slide" transparent>
        <ScreenContainer className="p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold flex-1" style={{ fontFamily: 'Fredoka', color: colors.foreground }}>
              {selectedEntry?.title}
            </Text>
            <TouchableOpacity onPress={() => setShowEntryDetail(false)}>
              <Text className="text-2xl">✕</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm mb-4" style={{ fontFamily: 'Quicksand', color: colors.muted }}>
            {selectedEntry?.date} • {selectedEntry?.time} • {selectedEntry?.emotion ? EMOTION_ICONS[selectedEntry.emotion] : '💭'}
          </Text>

          <ScrollView className="flex-1 mb-4">
            <Text style={{ fontFamily: 'Quicksand', color: colors.foreground, lineHeight: 24 }}>
              {selectedEntry?.content || ''}
            </Text>
          </ScrollView>

          <TouchableOpacity
            onPress={() => setShowEntryDetail(false)}
            className="p-4 rounded-full items-center"
            style={{ backgroundColor: '#FFD580' }}
          >
            <Text className="font-bold" style={{ fontFamily: 'Fredoka', color: colors.foreground }}>
              Close
            </Text>
          </TouchableOpacity>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
