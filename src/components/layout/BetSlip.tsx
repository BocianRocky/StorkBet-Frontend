import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"

const BetSlip = () => {

    const [Amount, setAmount] = useState(0);
  const [Bet, setBet] = useState([1,2,3,3,4,5,6,6,56,65,465,534,543,534,534,5,4,234,234,43,23,434,234,234,34,234,]);
    return (
      <div className="overflow-y-auto h-full w-full p-4">
        <h1 className="text-2xl font-bold my-4">Kupon</h1>
        <Tabs defaultValue="single" className="flex-grow w-full">
          
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single" className="font-bold">Pojedynczy</TabsTrigger>
              <TabsTrigger value="ako" className="font-bold">AKO</TabsTrigger>
              <TabsTrigger value="system" className="font-bold">SYSTEM</TabsTrigger>
            </TabsList>
            <TabsContent value="single" className="h-full">
              <ScrollArea className="h-[500px] w-full">
              <div className="flex flex-col m-3">
                  
                  {Bet.map((bet,index) => (
                  <div key={index}>
                      <Button variant="ghost" className="py-6 w-full justify-start text-left">{bet}</Button>
                      
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
            value={Amount === 0 ? "" : Amount} 
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
        <div className="flex justify-end items-center space-x-1">
          <span className="text-sm">Całkowity kurs</span>
          <Button className="h-12 font-bold border-none cursor-default hover:cursor-default focus:cursor-default hover:bg-white">6,25</Button>
        </div>
      </div>
      <Button className="w-full h-12 mt-4 font-bold bg-slate-700 hover:bg-zinc-600 text-white">Zatwierdź kupon</Button>
      </div>
    );
}
export default BetSlip;