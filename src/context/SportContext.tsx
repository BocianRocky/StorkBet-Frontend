import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OddsData } from '../services/api';

interface SportContextType {
  selectedSport: string | null;
  selectedSportTitle: string | null;
  oddsData: OddsData[];
  isLoading: boolean;
  error: string | null;
  setSelectedSport: (sportKey: string, sportTitle: string) => void;
  setOddsData: (data: OddsData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSelection: () => void;
}

const SportContext = createContext<SportContextType | undefined>(undefined);

export const useSportContext = () => {
  const context = useContext(SportContext);
  if (context === undefined) {
    throw new Error('useSportContext must be used within a SportProvider');
  }
  return context;
};

interface SportProviderProps {
  children: ReactNode;
}

export const SportProvider: React.FC<SportProviderProps> = ({ children }) => {
  const [selectedSport, setSelectedSportKey] = useState<string | null>(null);
  const [selectedSportTitle, setSelectedSportTitle] = useState<string | null>(null);
  const [oddsData, setOddsData] = useState<OddsData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setSelectedSport = (sportKey: string, sportTitle: string) => {
    setSelectedSportKey(sportKey);
    setSelectedSportTitle(sportTitle);
    setOddsData([]); // Wyczyść stare dane przy zmianie sportu
    setError(null);
    setLoading(true); // Ustaw loading na true, aby pokazać stan ładowania
  };

  const clearSelection = () => {
    setSelectedSportKey(null);
    setSelectedSportTitle(null);
    setOddsData([]);
    setError(null);
    setLoading(false); // Wyłącz loading przy czyszczeniu wyboru
  };

  return (
    <SportContext.Provider
      value={{
        selectedSport,
        selectedSportTitle,
        oddsData,
        isLoading,
        error,
        setSelectedSport,
        setOddsData,
        setLoading,
        setError,
        clearSelection,
      }}
    >
      {children}
    </SportContext.Provider>
  );
};
