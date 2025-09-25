import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react";
// Removed custom ScrollArea to match SideBar's native scroll behavior
import { useBetSlip } from "@/context/BetSlipContext"
import { takeBetslip } from "@/services/player"

const BetSlip = () => {

    const [amount, setAmount] = useState<number>(0);
    const { selections, removeSelection, clearSelections, combinedOdds } = useBetSlip();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const potentialWin = useMemo(() => {
        if (!amount || selections.length === 0) return 0;
        return amount * (combinedOdds || 1);
    }, [amount, combinedOdds, selections.length]);

    return (
      <div className="h-full w-full p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold my-4">Kupon</h1>
          {selections.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearSelections} className="text-neutral-300">Wyczyść</Button>
          )}
        </div>
        {submitError && <div className="text-sm text-red-500 mb-2">{submitError}</div>}
        {submitSuccess && <div className="text-sm text-green-500 mb-2">{submitSuccess}</div>}
        <Tabs defaultValue="single" className="flex-grow w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="font-bold">Pojedynczy</TabsTrigger>
            <TabsTrigger value="ako" className="font-bold">AKO</TabsTrigger>
            <TabsTrigger value="system" className="font-bold">SYSTEM</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="h-full">
            <div className="h-[500px] w-full overflow-y-auto">
              <div className="flex flex-col m-3 gap-2">
                {selections.length === 0 && (
                  <div className="text-neutral-400 text-sm">Brak wybranych zdarzeń. Kliknij kurs, aby dodać do kuponu.</div>
                )}
                {selections.map((sel) => (
                  <div key={sel.id} className="rounded-md border border-neutral-700 p-3 bg-neutral-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-neutral-400">{sel.league} • {new Date(sel.date).toLocaleDateString('pl-PL')}</div>
                        <div className="font-semibold text-neutral-100 truncate">{sel.home} vs {sel.away}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeSelection(sel.id)} className="text-neutral-400 hover:text-white">Usuń</Button>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-400">TYP:</span> <span className="text-cyan-800 font-bold">{sel.selection === "1"
                                ? sel.home 
                                : sel.selection === "2" 
                                  ? sel.away 
                                  : sel.selection === "X" 
                                    ? "Remis" 
                                    : sel.selection}
                        </span>
                      </div>

                      <span className="ml-2 text-cyan-600 font-bold border border-cyan-700 px-2 py-1 rounded bg-neutral-950">{sel.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="ml-1 mt-4 flex items-center justify-between">
          <div className="relative">
            <Input
              type="number"
              value={amount === 0 ? "" : amount}
              className="pr-8 h-12 w-32"
              style={{ appearance: 'textfield' }}
              placeholder="Stawka"
              onChange={(e) => {
                const value = e.target.value;
                setAmount(value === "" ? 0 : Number(value));
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">zł</span>
          </div>
          <div className="flex justify-end items-center space-x-2">
            <span className="text-sm">Całkowity kurs</span>
            <Button className="h-12 font-bold border-none cursor-default hover:cursor-default focus:cursor-default bg-neutral-800 text-neutral-100">
              {combinedOdds > 0 ? combinedOdds.toFixed(2) : "-"}
            </Button>
          </div>
        </div>

        <div className="ml-1 mt-2 flex items-center justify-between text-neutral-300">
          <span className="text-sm">Potencjalna wygrana</span>
          <span className="text-lg font-semibold">{potentialWin > 0 ? potentialWin.toFixed(2) : "-"} zł</span>
        </div>

        <Button
          className="w-full h-12 mt-4 font-bold bg-slate-700 hover:bg-zinc-600 text-white disabled:opacity-60"
          disabled={selections.length === 0 || amount <= 0 || submitting}
          onClick={async () => {
            setSubmitError(null);
            setSubmitSuccess(null);
            try {
              console.log(selections);
              setSubmitting(true);
              // matchId ma format typu "event-123" – wyciągamy część numeryczną
              const oddsIds = selections
                .map(s => {
                  // id ma format "odd-<oddId>"
                  const onlyNums = String(s.id).replace(/[^0-9]/g, "");
                  const n = Number(onlyNums);
                  return Number.isFinite(n) ? n : NaN;
                })
                .filter(n => !Number.isNaN(n));
              if (oddsIds.length === 0) {
                throw new Error('Brak prawidłowych identyfikatorów kursów do wysłania.');
              }
              await takeBetslip(amount, oddsIds);
              setSubmitSuccess('Kupon został złożony.');
              clearSelections();
            } catch (e: any) {
              setSubmitError(e?.message || 'Nie udało się złożyć kuponu.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {submitting ? 'Wysyłanie...' : 'Zatwierdź kupon'}
        </Button>
      </div>
    );
}
export default BetSlip;