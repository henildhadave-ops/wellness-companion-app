import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { Fredoka_400Regular, Fredoka_500Medium, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';

interface FontContextType {
  fontsLoaded: boolean;
}

const FontContext = createContext<FontContextType>({ fontsLoaded: false });

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded] = useFonts({
    // Fredoka fonts for headings
    'Fredoka-Regular': Fredoka_400Regular,
    'Fredoka-Medium': Fredoka_500Medium,
    'Fredoka-SemiBold': Fredoka_600SemiBold,
    'Fredoka-Bold': Fredoka_700Bold,
    
    // Quicksand fonts for body text
    'Quicksand-Light': Quicksand_300Light,
    'Quicksand-Regular': Quicksand_400Regular,
    'Quicksand-Medium': Quicksand_500Medium,
    'Quicksand-SemiBold': Quicksand_600SemiBold,
    'Quicksand-Bold': Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFontsLoaded() {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFontsLoaded must be used within FontProvider');
  }
  return context;
}
