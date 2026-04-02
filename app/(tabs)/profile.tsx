import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useWellness } from '@/lib/wellness-context';
import { cn } from '@/lib/utils';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { sessions } = useWellness();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/sign-in');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8 gap-6">
          {/* Profile Header */}
          <View className="bg-gradient-to-r from-primary to-success rounded-2xl p-6 gap-4">
            <View className="w-16 h-16 rounded-full bg-white bg-opacity-20 items-center justify-center">
              <Text className="text-3xl">👤</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-white">{user?.name}</Text>
              <Text className="text-white text-opacity-80">{user?.email}</Text>
            </View>
          </View>

          {/* Subscription Status */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-sm font-semibold text-foreground">Subscription Status</Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-foreground capitalize">
                  {user?.subscriptionStatus === 'free' ? 'Free Plan' : 'Premium'}
                </Text>
                <Text className="text-sm text-muted">
                  {user?.totalSessions || 0} sessions available
                </Text>
              </View>
              <View className="bg-primary bg-opacity-10 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-primary capitalize">
                  {user?.subscriptionStatus}
                </Text>
              </View>
            </View>
          </View>

          {/* Session Statistics */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Your Statistics</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border items-center">
                <Text className="text-2xl font-bold text-primary mb-1">{sessions.length}</Text>
                <Text className="text-xs text-muted text-center">Total Sessions</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border items-center">
                <Text className="text-2xl font-bold text-success mb-1">
                  {user?.totalSessions || 0}
                </Text>
                <Text className="text-xs text-muted text-center">Sessions Left</Text>
              </View>
            </View>
          </View>

          {/* Upgrade Section */}
          {user?.subscriptionStatus === 'free' && (
            <View className="bg-primary bg-opacity-10 rounded-lg p-4 border border-primary border-opacity-30 gap-3">
              <Text className="text-sm font-semibold text-foreground">Upgrade to Premium</Text>
              <Text className="text-xs text-muted">
                Get unlimited sessions and premium features
              </Text>
              <TouchableOpacity className="bg-primary rounded-lg py-2 px-4 items-center">
                <Text className="text-white font-semibold text-sm">View Plans</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Settings Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Settings</Text>

            {/* Privacy Settings */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">🔒</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Privacy & Data</Text>
                  <Text className="text-xs text-muted">Manage your data and privacy</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">›</Text>
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">🔔</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Notifications</Text>
                  <Text className="text-xs text-muted">Manage notification preferences</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">›</Text>
            </TouchableOpacity>

            {/* Theme */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">🌙</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Theme</Text>
                  <Text className="text-xs text-muted">Light or dark mode</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">›</Text>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Support</Text>

            {/* About */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">ℹ️</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">About</Text>
                  <Text className="text-xs text-muted">Version 1.0.0</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">›</Text>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">📋</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Privacy Policy</Text>
                  <Text className="text-xs text-muted">Our privacy commitments</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">›</Text>
            </TouchableOpacity>

            {/* Terms of Service */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">⚖️</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Terms of Service</Text>
                  <Text className="text-xs text-muted">Our terms and conditions</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">›</Text>
            </TouchableOpacity>

            {/* Contact Support */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl">💬</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground">Contact Support</Text>
                  <Text className="text-xs text-muted">Get help and feedback</Text>
                </View>
              </View>
              <Text className="text-lg text-muted">›</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            className="bg-error bg-opacity-10 rounded-lg py-3 items-center border border-error border-opacity-30"
            onPress={handleSignOut}
          >
            <Text className="text-error font-semibold">Sign Out</Text>
          </TouchableOpacity>

          {/* Safety Notice */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-2">
            <Text className="text-xs font-semibold text-foreground">Crisis Support</Text>
            <Text className="text-xs text-muted">
              This app is a wellness tool, not a medical device. For mental health emergencies, contact emergency services or a crisis hotline.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
