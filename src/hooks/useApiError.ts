import { useState, useCallback } from 'react';

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    let errorMessage = fallbackMessage;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setError(errorMessage);
    console.error('API Error:', error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
  };
};
