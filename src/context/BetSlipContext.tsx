import React, { createContext, useContext, useMemo, useState } from "react";

export type BetSelection = {
	id: string; // unique: matchId-selection
	matchId: string;
	selection: "1" | "X" | "2";
	price: number;
	home: string;
	away: string;
	league: string;
	date: string;
};

export type BetSlipContextType = {
	selections: BetSelection[];
	addOrToggleSelection: (sel: BetSelection) => void;
	removeSelection: (id: string) => void;
	clearSelections: () => void;
	isSelected: (id: string) => boolean;
	combinedOdds: number;
};

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export const useBetSlip = (): BetSlipContextType => {
	const ctx = useContext(BetSlipContext);
	if (!ctx) {
		throw new Error("useBetSlip must be used within BetSlipProvider");
	}
	return ctx;
};

export function BetSlipProvider({ children }: { children: React.ReactNode }) {
	const [selections, setSelections] = useState<BetSelection[]>([]);

	const addOrToggleSelection = (sel: BetSelection) => {
		setSelections(prev => {
			const exists = prev.some(s => s.id === sel.id);
			if (exists) {
				return prev.filter(s => s.id !== sel.id);
			}
			// Optionally prevent multiple selections from same match by removing others with same matchId
			const withoutSameMatch = prev.filter(s => s.matchId !== sel.matchId);
			return [...withoutSameMatch, sel];
		});
	};

	const removeSelection = (id: string) => {
		setSelections(prev => prev.filter(s => s.id !== id));
	};

	const clearSelections = () => setSelections([]);

	const isSelected = (id: string) => selections.some(s => s.id === id);

	const combinedOdds = useMemo(() => {
		if (selections.length === 0) return 0;
		return selections.reduce((acc, s) => acc * (s.price || 1), 1);
	}, [selections]);

	return (
		<BetSlipContext.Provider value={{ selections, addOrToggleSelection, removeSelection, clearSelections, isSelected, combinedOdds }}>
			{children}
		</BetSlipContext.Provider>
	);
}
