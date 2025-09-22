import OddBtn from "@/components/match/OddBtn";
import { OddsData } from "@/services/api";
import { useBetSlip } from "@/context/BetSlipContext";

export type SimpleMatchCardProps = {
	match: OddsData;
};

export default function SimpleMatchCard({ match }: SimpleMatchCardProps) {
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

	const selectionId = (choice: "1" | "X" | "2") => `${match.id}-${choice}`;

	return (
		<article className="rounded-2xl border border-neutral-600/40 bg-[linear-gradient(180deg,#0a0a0a,#15171c)] p-5 shadow-[0_8px_30px_rgba(189,189,189,0.08)] hover:shadow-[0_12px_40px_rgba(21,94,117,0.14)] transition">
			<header className="mb-4">
				<div className="flex items-center justify-between">
					<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-cyan-neutral-950 text-neutral-200 border border-neutral-200/40">
						{match.league}
					</span>
					<span className="text-[11px] text-zinc-400">{formatDate(match.date)}</span>
				</div>
				<div className="mt-3 grid grid-cols-[1fr,auto,1fr] items-center gap-2 text-base font-bold text-zinc-100">
					<span className="text-right truncate">{match.home}</span>
					<span className="px-2 text-cyan-900">vs</span>
					<span className="text-left truncate">{match.away}</span>
				</div>
			</header>
			<div className={`grid gap-3 ${match.odds.draw ? 'grid-cols-3' : 'grid-cols-2'}`}>
				<OddBtn
					label="1"
					value={match.odds.home}
					active={isSelected(selectionId("1"))}
					onClick={() => addOrToggleSelection({
						id: selectionId("1"),
						matchId: match.id,
						selection: "1",
						price: match.odds.home ?? 0,
						home: match.home,
						away: match.away,
						league: match.league,
						date: match.date,
					})}
				/>
				{match.odds.draw && (
					<OddBtn
						label="X"
						value={match.odds.draw}
						active={isSelected(selectionId("X"))}
						onClick={() => addOrToggleSelection({
							id: selectionId("X"),
							matchId: match.id,
							selection: "X",
							price: match.odds.draw ?? 0,
							home: match.home,
							away: match.away,
							league: match.league,
							date: match.date,
						})}
					/>
				)}
				<OddBtn
					label="2"
					value={match.odds.away}
					active={isSelected(selectionId("2"))}
					onClick={() => addOrToggleSelection({
						id: selectionId("2"),
						matchId: match.id,
						selection: "2",
						price: match.odds.away ?? 0,
						home: match.home,
						away: match.away,
						league: match.league,
						date: match.date,
					})}
				/>
			</div>
		</article>
	);
}
