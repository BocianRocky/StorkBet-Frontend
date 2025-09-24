export type OddBtnProps = {
	label: "1" | "X" | "2";
	value: number | undefined;
	active?: boolean;
	onClick?: () => void;
};

export default function OddBtn({ label, value, active = false, onClick }: OddBtnProps) {
	const displayValue = value !== undefined && value !== null ? value : 0;
	const isDisabled = value === undefined || value === null;

	return (
		<button
			onClick={isDisabled ? undefined : onClick}
			disabled={isDisabled}
			className={`w-full rounded-lg border text-zinc-100 text-sm font-semibold py-2.5 transition focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${
				isDisabled
					? 'bg-neutral-800 border-neutral-600 text-neutral-500 cursor-not-allowed'
					: active
						? 'bg-cyan-700/30 border-cyan-600 text-cyan-200'
						: 'bg-gradient-to-b from-[#0a1724] to-[#0f2236] hover:from-[#0e2234] hover:to-[#14314d] border-cyan-900/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
			}`}
		>
			<span className={`mr-1 ${active ? 'text-cyan-500' : 'text-cyan-700'}`}>{label}</span>
			<span className="tracking-wide">{isDisabled ? 'N/A' : displayValue.toFixed(2)}</span>
		</button>
	);
}
