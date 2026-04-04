import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useWellness } from '@/lib/wellness-context';
import { trpc } from '@/lib/trpc';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function ChatScreen() {
  const router = useRouter();
  const { user, consumeSession } = useAuth();
  const { currentSession, startSession, endSession, addSessionMessage } = useWellness();
  const [messageText, setMessageText] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // tRPC mutation for wellness chat
  const wellnessChatMutation = trpc.wellness.chat.useMutation();

  // Timer effect
  useEffect(() => {
    if (!sessionActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleStartSession = async () => {
    if (!user || user.totalSessions <= 0) {
      Alert.alert('No Sessions Available', 'Please upgrade to continue.');
      return;
    }

    try {
      await startSession();
      await consumeSession();
      setSessionActive(true);
      setTimeRemaining(30 * 60);
      setMessages([
        {
          role: 'assistant',
          content: `Hello ${user.name}! I'm your wellness companion. I'm here to listen and support you. How are you feeling today?`,
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to start session');
    }
  };

  const handleEndSession = async () => {
    try {
      await endSession('Session ended');
      setSessionActive(false);
      setMessages([]);
      Alert.alert('Session Ended', 'Thank you for taking care of your wellness today.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to end session');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const userMessage = messageText;
    setMessageText('');

    // Add user message to display
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, content: userMessage },
    ];
    setMessages(updatedMessages);

    setIsLoading(true);

    try {
      // Call real AI endpoint via tRPC
      const result = await wellnessChatMutation.mutateAsync({
        messages: updatedMessages,
        sessionId: currentSession?.id,
      });

      // Add AI response
      const responseContent = typeof result.response === 'string' ? result.response : 'I understand. Please tell me more.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: responseContent },
      ]);

      // Check for crisis indicators
      if (result.hasCrisisIndicators && result.crisisResources) {
        setCrisisResources(result.crisisResources);
        setShowCrisisAlert(true);
      }

      // Store in session history
      await addSessionMessage('user', userMessage);
      await addSessionMessage('assistant', responseContent);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sessionActive) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 py-8 gap-6">
            <View className="items-center gap-4">
              <Text className="text-5xl">🧘</Text>
              <Text className="text-3xl font-bold text-primary text-center">Start a Wellness Session</Text>
              <Text className="text-base text-muted text-center leading-relaxed">
                Connect with your AI wellness companion for a 30-minute supportive conversation powered by advanced AI.
              </Text>
            </View>

            <View className="bg-surface rounded-xl p-6 border border-border gap-3">
              <Text className="text-sm font-semibold text-foreground">What to expect:</Text>
              <View className="gap-2">
                <Text className="text-sm text-muted">✓ Personalized, empathetic conversation</Text>
                <Text className="text-sm text-muted">✓ Safe space to express your feelings</Text>
                <Text className="text-sm text-muted">✓ Practical coping strategies</Text>
                <Text className="text-sm text-muted">✓ Your privacy is always protected</Text>
                <Text className="text-sm text-muted">✓ Powered by real AI technology</Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-lg py-4 items-center"
              onPress={handleStartSession}
            >
              <Text className="text-white font-semibold text-base">Start Session Now</Text>
            </TouchableOpacity>

            <View className="bg-warning bg-opacity-10 rounded-lg p-4 border border-warning border-opacity-30">
              <Text className="text-xs font-semibold text-foreground mb-2">Crisis Support</Text>
              <Text className="text-xs text-muted mb-3">
                If you're in crisis, please reach out to emergency services or a crisis hotline immediately.
              </Text>
              <TouchableOpacity className="bg-warning rounded-lg py-2 px-4 items-center">
                <Text className="text-white font-semibold text-xs">Get Crisis Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 flex-col">
        {/* Header with Timer */}
        <View className="bg-primary px-6 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-white text-sm opacity-80">Session Timer</Text>
            <Text className="text-white text-2xl font-bold">{formatTime(timeRemaining)}</Text>
          </View>
          <TouchableOpacity
            className="bg-white bg-opacity-20 rounded-lg px-4 py-2"
            onPress={handleEndSession}
          >
            <Text className="text-white font-semibold text-sm">End Session</Text>
          </TouchableOpacity>
        </View>

        {/* Crisis Alert */}
        {showCrisisAlert && crisisResources && (
          <View className="bg-error bg-opacity-10 px-4 py-3 border-b border-error border-opacity-30">
            <Text className="text-sm font-semibold text-error mb-2">{crisisResources.title}</Text>
            <Text className="text-xs text-foreground mb-3">{crisisResources.message}</Text>
            <View className="gap-2">
              {crisisResources.resources.map((resource: any, idx: number) => (
                <TouchableOpacity key={idx} className="bg-error bg-opacity-20 rounded-lg p-2">
                  <Text className="text-xs font-semibold text-error">{resource.name}</Text>
                  {resource.phone && <Text className="text-xs text-foreground">{resource.phone}</Text>}
                  {resource.text && <Text className="text-xs text-foreground">{resource.text}</Text>}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowCrisisAlert(false)} className="mt-2">
              <Text className="text-xs text-muted">Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              className={cn(
                'max-w-xs rounded-lg px-4 py-3',
                msg.role === 'user'
                  ? 'self-end bg-primary'
                  : 'self-start bg-surface border border-border'
              )}
            >
              <Text
                className={cn(
                  'text-sm leading-relaxed',
                  msg.role === 'user' ? 'text-white' : 'text-foreground'
                )}
              >
                {msg.content}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View className="self-start bg-surface border border-border rounded-lg px-4 py-3">
              <Text className="text-sm text-muted">AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-4 py-4 border-t border-border bg-background gap-3">
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="Share your thoughts..."
              placeholderTextColor="#9BA1A6"
              value={messageText}
              onChangeText={setMessageText}
              editable={!isLoading}
              multiline
            />
            <TouchableOpacity
              className={cn('bg-primary rounded-lg px-4 py-3 items-center justify-center', isLoading && 'opacity-60')}
              onPress={handleSendMessage}
              disabled={isLoading || !messageText.trim()}
            >
              <Text className="text-white font-semibold">Send</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-muted text-center">
            Your conversation is private and encrypted
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
