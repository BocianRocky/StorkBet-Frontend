import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useEffect, useMemo, useState } from "react";
// Removed custom ScrollArea to match SideBar's native scroll behavior
import { useBetSlip } from "@/context/BetSlipContext"
import { takeBetslip } from "@/services/player"
import { BetSuccessDialog } from "@/components/BetSuccessDialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { getMyPromotions, type PromotionForUser } from "@/services/promotions"

const BetSlip = () => {

    const [amount, setAmount] = useState<number>(0);
    const { selections, removeSelection, clearSelections, combinedOdds } = useBetSlip();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successData, setSuccessData] = useState<{
        amount: number;
        potentialWin: number;
        combinedOdds: number;
    } | null>(null);
    const { toast } = useToast();
    const { isAuthenticated } = useAuth();

    const [promotions, setPromotions] = useState<PromotionForUser[]>([]);
    const [promotionsLoading, setPromotionsLoading] = useState(false);
    const [promotionsError, setPromotionsError] = useState<string | null>(null);
    const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null);

    useEffect(() => {
        let ignore = false;

        if (!isAuthenticated) {
            setPromotions([]);
            setSelectedPromotionId(null);
            setPromotionsError(null);
            setPromotionsLoading(false);
            return;
        }

        setPromotionsLoading(true);
        setPromotionsError(null);
        getMyPromotions()
            .then((data) => {
                if (ignore) return;
                const list = Array.isArray(data) ? data : [];
                setPromotions(list);
                setSelectedPromotionId((prev) => {
                    if (!prev) return prev;
                    return list.some((promotion) => promotion.id === prev) ? prev : null;
                });
            })
            .catch((error: any) => {
                if (ignore) return;
                console.error("Nie udało się pobrać promocji:", error);
                setPromotionsError("Nie udało się pobrać promocji. Spróbuj ponownie później.");
            })
            .finally(() => {
                if (ignore) return;
                setPromotionsLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [isAuthenticated]);

    const selectedPromotion = useMemo(() => {
        if (!selectedPromotionId) return null;
        return promotions.find((promotion) => promotion.id === selectedPromotionId) ?? null;
    }, [promotions, selectedPromotionId]);

    const effectiveAmount = useMemo(() => {
        if (!amount) return 0;
        if (!selectedPromotion) return amount;

        const type = selectedPromotion.bonusType?.toLowerCase();
        const bonusValue = selectedPromotion.bonusValue ?? 0;

        if (type === "percentage") {
            return amount + amount * (bonusValue / 100);
        }

        if (type === "fixed") {
            return amount + bonusValue;
        }

        return amount;
    }, [amount, selectedPromotion]);

    const basePotentialWin = useMemo(() => {
        if (!amount || selections.length === 0) return 0;
        return amount * (combinedOdds || 1);
    }, [amount, combinedOdds, selections.length]);

    const potentialWin = useMemo(() => {
        if (!effectiveAmount || selections.length === 0) return 0;
        return effectiveAmount * (combinedOdds || 1);
    }, [effectiveAmount, combinedOdds, selections.length]);

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

        {isAuthenticated && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-200">Promocje</span>
              {promotionsLoading && <span className="text-xs text-neutral-400">Ładowanie...</span>}
            </div>
            {promotionsError && (
              <div className="mt-2 text-xs text-red-500">{promotionsError}</div>
            )}
            {!promotionsLoading && !promotionsError && promotions.length === 0 && (
              <div className="mt-2 text-xs text-neutral-400">Brak dostępnych promocji.</div>
            )}
            {promotions.length > 0 && !promotionsError && (
              <div className="mt-2 space-y-2">
                <select
                  className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm text-neutral-100 focus:border-cyan-700 focus:outline-none"
                  value={selectedPromotionId ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedPromotionId(value === "" ? null : Number(value));
                  }}
                >
                  <option value="">Brak promocji</option>
                  {promotions.map((promotion) => (
                    <option key={promotion.id} value={promotion.id}>
                      {promotion.promotionName}
                    </option>
                  ))}
                </select>

                {selectedPromotion && (
                  <div className="rounded-md border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-300">
                    <div className="font-semibold text-neutral-100">{selectedPromotion.promotionName}</div>
                    <div className="mt-1 text-neutral-400">
                      {selectedPromotion.description}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-neutral-400">
                      <span>Bonus: {selectedPromotion.bonusType} {selectedPromotion.bonusValue}{selectedPromotion.bonusType?.toLowerCase() === "percentage" ? "%" : ""}</span>
                      {selectedPromotion.promoCode && (
                        <span>Kod: {selectedPromotion.promoCode}</span>
                      )}
                      <span>Dostępna do: {new Date(selectedPromotion.dateEnd).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="ml-1 mt-2 flex items-center justify-between text-neutral-300">
          <span className="text-sm">Potencjalna wygrana</span>
          {selectedPromotion && amount > 0 && potentialWin !== basePotentialWin ? (
            <div className="text-right">
              <div className="text-sm text-neutral-500 line-through">
                {basePotentialWin > 0 ? basePotentialWin.toFixed(2) : "-"} zł
              </div>
              <div className="text-lg font-semibold text-emerald-400">
                {potentialWin > 0 ? potentialWin.toFixed(2) : "-"} zł
              </div>
            </div>
          ) : (
            <span className="text-lg font-semibold">
              {basePotentialWin > 0 ? basePotentialWin.toFixed(2) : "-"} zł
            </span>
          )}
        </div>

        {!isAuthenticated && selections.length > 0 && (
          <div className="w-full mt-4 p-3 rounded-md bg-amber-900/30 border border-amber-700/50">
            <p className="text-sm text-amber-200 text-center">
              Musisz być zalogowany, aby móc obstawić zakład.
            </p>
          </div>
        )}
        <Button
          className="w-full h-12 mt-4 font-bold bg-slate-700 hover:bg-zinc-600 text-white disabled:opacity-60"
          disabled={selections.length === 0 || amount <= 0 || submitting || !isAuthenticated}
          onClick={async () => {
            if (!isAuthenticated) {
              setSubmitError('Musisz być zalogowany, aby móc obstawić zakład.');
              return;
            }
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
              const amountToSend = Number(effectiveAmount.toFixed(2));
              await takeBetslip(amountToSend, oddsIds, selectedPromotion?.id);
              
              // Save success data before clearing selections
              setSuccessData({
                amount: amountToSend,
                potentialWin,
                combinedOdds
              });
              
              // Show success dialog
              setShowSuccessDialog(true);
              
              // Show toast notification
              toast({
                variant: "success",
                title: "Kupon złożony!",
                description: `Twój kupon na ${amountToSend.toFixed(2)} zł został pomyślnie złożony.`,
              });
              
              // Refresh balance in navbar
              window.dispatchEvent(new Event('refreshBalance'));
              
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

        <BetSuccessDialog
          open={showSuccessDialog}
          onOpenChange={(open) => {
            setShowSuccessDialog(open);
            if (!open) {
              setSuccessData(null);
            }
          }}
          amount={successData?.amount || 0}
          potentialWin={successData?.potentialWin || 0}
          combinedOdds={successData?.combinedOdds || 0}
        />
      </div>
    );
}
export default BetSlip;