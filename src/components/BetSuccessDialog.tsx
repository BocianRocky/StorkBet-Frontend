import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface BetSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  potentialWin: number
  combinedOdds: number
}

export function BetSuccessDialog({
  open,
  onOpenChange,
  amount,
  potentialWin,
  combinedOdds,
}: BetSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-2xl text-green-500 font-bold">
            Kupon został złożony!
          </DialogTitle>
          <DialogDescription className="text-neutral-300 mt-4">
            Twój kupon został pomyślnie złożony i oczekuje na rozstrzygnięcie.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Stawka:</span>
              <span className="text-white font-semibold">{amount.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Kurs:</span>
              <span className="text-cyan-500 font-semibold">{combinedOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-700 pt-2">
              <span className="text-neutral-400">Potencjalna wygrana:</span>
              <span className="text-green-500 font-bold text-lg">{potentialWin.toFixed(2)} zł</span>
            </div>
          </div>
          
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Zamknij
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

