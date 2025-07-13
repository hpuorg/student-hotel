import React from 'react';
import { HeroUIProvider as Provider } from '@heroui/react';

interface HeroUIProviderProps {
  children: React.ReactNode;
}

export function HeroUIProvider({ children }: HeroUIProviderProps) {
  return (
    <Provider>
      {children}
    </Provider>
  );
}

export default HeroUIProvider;
