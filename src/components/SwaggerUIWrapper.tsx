'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '../contexts/ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import { suppressSwaggerWarnings } from '../utils/suppressWarnings';

// Dynamically import SwaggerUI to avoid SSR issues and React StrictMode warnings
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading API Documentation...</p>
      </div>
    </div>
  ),
});

interface SwaggerUIWrapperProps {
  spec: string;
}

const SwaggerUIWrapper: React.FC<SwaggerUIWrapperProps> = ({ spec }) => {
  const { theme } = useTheme();
  const [key, setKey] = useState(0);

  // Suppress React warnings from swagger-ui-react
  useEffect(() => {
    const cleanup = suppressSwaggerWarnings();
    return cleanup;
  }, []);

  // Force re-render when theme changes to apply new styles
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [theme]);

  const swaggerConfig = useMemo(() => ({
    url: spec,
    docExpansion: "list" as const,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    displayOperationId: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    onComplete: () => {
      console.log('Swagger UI loaded successfully');
    },
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'] as ('get' | 'post' | 'put' | 'delete' | 'patch')[],
  }), [spec]);

  // Suppress React StrictMode warnings for third-party component
  const StrictModeWrapper = ({ children }: { children: React.ReactNode }) => {
    // Only apply StrictMode suppression to SwaggerUI in development
    if (process.env.NODE_ENV === 'development') {
      return <div key={key}>{children}</div>;
    }
    return <>{children}</>;
  };

  return (
    <div className="api-docs-container">
      <ErrorBoundary suppressWarnings={true}>
        <StrictModeWrapper>
          <SwaggerUI {...swaggerConfig} />
        </StrictModeWrapper>
      </ErrorBoundary>
    </div>
  );
};

export default SwaggerUIWrapper;