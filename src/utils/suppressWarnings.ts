'use client';

// Utility to suppress specific React warnings from third-party libraries
export const suppressSwaggerWarnings = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') ||
         args[0].includes('Using UNSAFE_componentWillReceiveProps') ||
         args[0].includes('ModelCollapse') ||
         args[0].includes('OperationContainer') ||
         args[0].includes('ContentType') ||
         args[0].includes('ExamplesSelect') ||
         args[0].includes('ExamplesSelectValueRetainer') ||
         args[0].includes('ParameterRow') ||
         args[0].includes('Select') ||
         args[0].includes('strict mode is not recommended'))
      ) {
        return; // Suppress these specific warnings
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') ||
         args[0].includes('Using UNSAFE_componentWillReceiveProps') ||
         args[0].includes('ContentType') ||
         args[0].includes('ExamplesSelect') ||
         args[0].includes('ExamplesSelectValueRetainer') ||
         args[0].includes('ParameterRow') ||
         args[0].includes('Select') ||
         args[0].includes('strict mode is not recommended'))
      ) {
        return; // Suppress these specific warnings
      }
      originalWarn.apply(console, args);
    };

    // Return cleanup function
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }
  return () => {}; // No-op cleanup for server-side
};

export const restoreConsole = () => {
  // This can be used to manually restore console if needed
  if (typeof window !== 'undefined') {
    // Get original console methods if they were stored
    const originalError = (console as unknown as Record<string, unknown>).__originalError;
    const originalWarn = (console as unknown as Record<string, unknown>).__originalWarn;
    
    if (originalError && typeof originalError === 'function') console.error = originalError as typeof console.error;
    if (originalWarn && typeof originalWarn === 'function') console.warn = originalWarn as typeof console.warn;
  }
};