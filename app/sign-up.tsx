import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the privacy policy and terms');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      Alert.alert('Success', 'Account created! You now have 3 free sessions.');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Sign Up Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8 items-center">
            <Text className="text-4xl font-bold text-primary mb-2">Welcome</Text>
            <Text className="text-base text-muted text-center">Start your wellness journey with 3 free sessions</Text>
          </View>

          {/* Form */}
          <View className="gap-4 mb-6">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Full Name</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="John Doe"
                placeholderTextColor="#9BA1A6"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="you@example.com"
                placeholderTextColor="#9BA1A6"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Password</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor="#9BA1A6"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Confirm Password</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor="#9BA1A6"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Privacy Notice */}
          <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
            <Text className="text-xs text-muted leading-relaxed">
              Your data is encrypted and private. We never share your information with third parties. This app is a wellness tool, not a medical device. For emergencies, please contact local emergency services.
            </Text>
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View className={cn('w-5 h-5 rounded border-2 border-primary items-center justify-center mr-3', agreedToTerms && 'bg-primary')}>
              {agreedToTerms && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
            <Text className="text-sm text-muted flex-1">I agree to the Privacy Policy and Terms of Service</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={cn('bg-primary rounded-lg py-3 items-center mb-4', isLoading && 'opacity-60')}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-muted">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
