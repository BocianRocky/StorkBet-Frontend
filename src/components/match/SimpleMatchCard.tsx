import OddBtn from "@/components/match/OddBtn";
import { OddsData } from "@/services/api";
import { useBetSlip } from "@/context/BetSlipContext";

export type SimpleMatchCardProps = {
	match: OddsData;
	compact?: boolean;
};

export default function SimpleMatchCard({ match, compact }: SimpleMatchCardProps) {
	const { addOrToggleSelection, isSelected } = useBetSlip();

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('pl-PL', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return dateString;
		}
	};

	const getOddId = (choice: "1" | "X" | "2") => {
		if (!match || !('oddIds' in match)) return undefined as unknown as number | undefined;
		const ids = (match as any).oddIds as { home?: number; draw?: number; away?: number } | undefined;
		if (!ids) return undefined;
		return choice === '1' ? ids.home : choice === '2' ? ids.away : ids.draw;
	};

	const selectionId = (choice: "1" | "X" | "2") => {
		const oddId = getOddId(choice);
		return oddId != null ? `odd-${oddId}` : `${match.id}-${choice}`;
	};

	const isCompact = compact !== undefined ? compact : false;
	
	return (
		<article className={`rounded-2xl border border-neutral-600/40 bg-[linear-gradient(180deg,#0a0a0a,#15171c)] shadow-[0_8px_30px_rgba(189,189,189,0.08)] hover:shadow-[0_12px_40px_rgba(21,94,117,0.14)] transition ${isCompact ? 'p-3 md:p-5' : 'p-5'}`}>
			<header className={isCompact ? 'mb-2 md:mb-4' : 'mb-4'}>
				<div className="flex items-center justify-between">
					<span className={`px-2 py-0.5 rounded-full font-semibold tracking-wide bg-cyan-neutral-950 text-neutral-200 border border-neutral-200/40 ${isCompact ? 'text-[9px] md:text-[10px]' : 'text-[10px]'}`}>
						{match.league}
					</span>
					<span className={`text-zinc-400 ${isCompact ? 'text-[10px] md:text-[11px]' : 'text-[11px]'}`}>{formatDate(match.date)}</span>
				</div>
				<div className={`grid grid-cols-[1fr,auto,1fr] items-center gap-2 font-bold text-zinc-100 ${isCompact ? 'mt-2 md:mt-3 text-sm md:text-base' : 'mt-3 text-base'}`}>
					<span className="text-right truncate">{match.home}</span>
					<span className={`text-cyan-900 ${isCompact ? 'px-1 md:px-2' : 'px-2'}`}>vs</span>
					<span className="text-left truncate">{match.away}</span>
				</div>
			</header>
			<div className={`grid ${match.odds.draw ? 'grid-cols-3' : 'grid-cols-2'} ${isCompact ? 'gap-2 md:gap-3' : 'gap-3'}`}>
				<OddBtn
					label="1"
					value={match.odds.home}
					active={(() => { const id = selectionId("1"); return id.startsWith('odd-') ? isSelected(id) : false; })()}
					onClick={() => {
                        const id = selectionId("1");
						if (!id.startsWith('odd-')) return;
                        addOrToggleSelection({
                            id,
                            matchId: match.id,
                            selection: "1",
                            price: match.odds.home ?? 0,
                            home: match.home,
                            away: match.away,
                            league: match.league,
                            date: match.date,
                        })
                    }}
				/>
				{match.odds.draw && (
					<OddBtn
						label="X"
						value={match.odds.draw}
					active={(() => { const id = selectionId("X"); return id.startsWith('odd-') ? isSelected(id) : false; })()}
					onClick={() => {
                        const id = selectionId("X");
						if (!id.startsWith('odd-')) return;
                        addOrToggleSelection({
                            id,
                            matchId: match.id,
                            selection: "X",
                            price: match.odds.draw ?? 0,
                            home: match.home,
                            away: match.away,
                            league: match.league,
                            date: match.date,
                        })
                    }}
					/>
				)}
				<OddBtn
					label="2"
					value={match.odds.away}
					active={(() => { const id = selectionId("2"); return id.startsWith('odd-') ? isSelected(id) : false; })()}
					onClick={() => {
                        const id = selectionId("2");
						if (!id.startsWith('odd-')) return;
                        addOrToggleSelection({
                            id,
                            matchId: match.id,
                            selection: "2",
                            price: match.odds.away ?? 0,
                            home: match.home,
                            away: match.away,
                            league: match.league,
                            date: match.date,
                        })
                    }}
				/>
			</div>
		</article>
	);
}
