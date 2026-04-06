import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useWellness } from '@/lib/wellness-context';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getTodayMood, startSession } = useWellness();
  const colors = useColors();
  const todayMood = getTodayMood();

  const handleStartSession = async () => {
    if (!user) return;

    if (user.totalSessions <= 0) {
      Alert.alert(
        'No Sessions Available',
        'You have used all your sessions. Upgrade to continue.',
        [
          { text: 'Cancel', onPress: () => {} },
              { text: 'Upgrade', onPress: () => router.push('./chat') },
        ]
      );
      return;
    }

    try {
      await startSession();
      router.push('/(tabs)/chat');
    } catch (error) {
      Alert.alert('Error', 'Failed to start session');
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
          {/* Welcome Header */}
          <View>
            <Text className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'Fredoka-Bold' }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </Text>
            <Text className="text-base text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>
              Your wellness journey continues here
            </Text>
          </View>

          {/* Session Counter Card */}
          <View className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 shadow-sm">
            <Text className="text-sm font-medium text-white opacity-80 mb-2" style={{ fontFamily: 'Fredoka-SemiBold' }}>Sessions Available</Text>
            <View className="flex-row items-baseline gap-2 mb-4">
              <Text className="text-5xl font-bold text-white" style={{ fontFamily: 'Fredoka-Bold' }}>{user?.totalSessions || 0}</Text>
              <Text className="text-lg text-white opacity-70" style={{ fontFamily: 'Quicksand-Regular' }}>sessions</Text>
            </View>
            <View className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
              <View
                className="bg-white h-full"
                style={{
                  width: `${((user?.totalSessions || 0) / 10) * 100}%`,
                }}
              />
            </View>
            {user?.freeSessions && user.freeSessions > 0 && (
              <Text className="text-xs text-white opacity-70 mt-3" style={{ fontFamily: 'Quicksand-Regular' }}>
                {user.freeSessions} free sessions remaining
              </Text>
            )}
          </View>

          {/* Today's Mood */}
          {todayMood && (
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-xs font-medium text-muted uppercase tracking-wider mb-3" style={{ fontFamily: 'Fredoka-SemiBold' }}>
                Today's Mood
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-4xl">{emotionEmoji[todayMood.emotion] || '😊'}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground capitalize" style={{ fontFamily: 'Fredoka-SemiBold' }}>
                    {todayMood.emotion}
                  </Text>
                  <Text className="text-sm text-muted" style={{ fontFamily: 'Quicksand-Regular' }}>
                    Intensity: {todayMood.intensity}/10
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="gap-3">
            {/* Start Session Button */}
            <TouchableOpacity
              className={cn(
                'bg-primary rounded-xl py-4 px-6 flex-row items-center justify-between',
                user?.totalSessions === 0 && 'opacity-60'
              )}
              onPress={handleStartSession}
              disabled={user?.totalSessions === 0}
            >
              <View>
                <Text className="text-white font-semibold text-base" style={{ fontFamily: 'Fredoka-SemiBold' }}>Start Wellness Session</Text>
                <Text className="text-white text-xs opacity-80" style={{ fontFamily: 'Quicksand-Regular' }}>30 minutes of AI support</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </TouchableOpacity>

            {/* Log Mood Button */}
            <TouchableOpacity
              className="bg-surface border border-border rounded-xl py-4 px-6 flex-row items-center justify-between"
              onPress={() => router.push('./mood')}
            >
              <View>
                <Text className="text-foreground font-semibold text-base" style={{ fontFamily: 'Fredoka-SemiBold' }}>Log Your Mood</Text>
                <Text className="text-muted text-xs" style={{ fontFamily: 'Quicksand-Regular' }}>How are you feeling today?</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </TouchableOpacity>

            {/* Journal Button */}
            <TouchableOpacity
              className="bg-surface border border-border rounded-xl py-4 px-6 flex-row items-center justify-between"
              onPress={() => router.push('./journal')}
            >
              <View>
                <Text className="text-foreground font-semibold text-base" style={{ fontFamily: 'Fredoka-SemiBold' }}>Write in Journal</Text>
                <Text className="text-muted text-xs" style={{ fontFamily: 'Quicksand-Regular' }}>Express your thoughts</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </TouchableOpacity>

            {/* Resources Button */}
            <TouchableOpacity
              className="bg-surface border border-border rounded-xl py-4 px-6 flex-row items-center justify-between"
              onPress={() => router.push('./resources')}
            >
              <View>
                <Text className="text-foreground font-semibold text-base" style={{ fontFamily: 'Fredoka-SemiBold' }}>Browse Resources</Text>
                <Text className="text-muted text-xs" style={{ fontFamily: 'Quicksand-Regular' }}>Meditation, tips, and more</Text>
              </View>
              <Text className="text-2xl">→</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View className="gap-3">
            <Text className="text-xs font-medium text-muted uppercase tracking-wider" style={{ fontFamily: 'Fredoka-SemiBold' }}>
              Your Progress
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border items-center">
                <Text className="text-2xl font-bold text-primary mb-1" style={{ fontFamily: 'Fredoka-Bold' }}>
                  {user?.totalSessions || 0}
                </Text>
                <Text className="text-xs text-muted text-center" style={{ fontFamily: 'Quicksand-Regular' }}>Total Sessions</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border items-center">
                <Text className="text-2xl font-bold text-success mb-1" style={{ fontFamily: 'Fredoka-Bold' }}>
                  {todayMood ? '✓' : '—'}
                </Text>
                <Text className="text-xs text-muted text-center" style={{ fontFamily: 'Quicksand-Regular' }}>Mood Logged</Text>
              </View>
            </View>
          </View>

          {/* Upgrade CTA - Show if no sessions left */}
          {user?.totalSessions === 0 && (
            <View className="bg-warning bg-opacity-10 rounded-xl p-4 border border-warning border-opacity-30">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Ready to continue your wellness journey?
              </Text>
              <Text className="text-xs text-muted mb-4">
                Upgrade to unlock unlimited sessions and premium features.
              </Text>
              <TouchableOpacity
                className="bg-warning rounded-lg py-2 px-4 items-center"
                onPress={() => router.push('/(tabs)/chat')}
              >
                <Text className="text-white font-semibold text-sm">Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
