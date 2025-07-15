import React from 'react';
import { HeroUIProvider as Provider } from '@heroui/react';
import ThemeProvider from './ThemeProvider';

interface HeroUIProviderProps {
  children: React.ReactNode;
}

export function HeroUIProvider({ children }: HeroUIProviderProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <Provider>
        {children}
      </Provider>
    </ThemeProvider>
  );
}

export default HeroUIProvider;
