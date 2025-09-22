import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBetSlip } from "@/context/BetSlipContext"

const BetSlip = () => {

    const [amount, setAmount] = useState<number>(0);
    const { selections, removeSelection, clearSelections, combinedOdds } = useBetSlip();

    const potentialWin = useMemo(() => {
        if (!amount || selections.length === 0) return 0;
        return amount * (combinedOdds || 1);
    }, [amount, combinedOdds, selections.length]);

    return (
      <div className="overflow-y-auto h-full w-full p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold my-4">Kupon</h1>
          {selections.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearSelections} className="text-neutral-300">Wyczyść</Button>
          )}
        </div>
        <Tabs defaultValue="single" className="flex-grow w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="font-bold">Pojedynczy</TabsTrigger>
            <TabsTrigger value="ako" className="font-bold">AKO</TabsTrigger>
            <TabsTrigger value="system" className="font-bold">SYSTEM</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="h-full">
            <ScrollArea className="h-[500px] w-full">
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
                        <div className="text-sm text-cyan-300 mt-1">Typ: {sel.selection} @ {sel.price.toFixed(2)}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeSelection(sel.id)} className="text-neutral-400 hover:text-white">Usuń</Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
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

        <Button className="w-full h-12 mt-4 font-bold bg-slate-700 hover:bg-zinc-600 text-white" disabled={selections.length === 0 || amount <= 0}>
          Zatwierdź kupon
        </Button>
      </div>
    );
}
export default BetSlip;