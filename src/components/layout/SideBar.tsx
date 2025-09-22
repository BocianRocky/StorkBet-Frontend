import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSportContext } from "@/context/SportContext";
import { apiService, GroupedSportItem, GroupedSports } from "@/services/api";
import { useApiError } from "@/hooks/useApiError";

const SideBar = () => {
    const [groupedSports, setGroupedSports] = useState<GroupedSports[]>([]);
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
    const { setSelectedSport, setOddsData, setLoading, setError, selectedSport } = useSportContext();
    const { handleError } = useApiError();
    
    useEffect(() => {
        const fetchGroupedSports = async () => {
            try {
                const data = await apiService.fetchGroupedSports();
                setGroupedSports(data);
            } catch (error) {
                handleError(error, "Błąd podczas pobierania listy sportów");
            }
        };
        fetchGroupedSports();
    }, [setError]);

    const toggleGroup = (groupName: string) => {
        setOpenGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupName)) {
                next.delete(groupName);
            } else {
                next.add(groupName);
            }
            return next;
        });
    };

    const handleSportClick = async (sport: GroupedSportItem) => {
        try {
            setLoading(true);
            setError(null);
            
            // Ustaw wybrany sport w kontekście
            setSelectedSport(sport.key, sport.title);
            
            // Pobierz dane odds dla wybranego sportu
            const oddsData = await apiService.fetchOddsForSport(sport.key);
            setOddsData(oddsData);
        } catch (error) {
            handleError(error, `Nie udało się pobrać danych dla ${sport.title}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollArea className="h-full w-full p-3">
            <div className="flex flex-col m-3">
                {selectedSport && (
                    <div className="mb-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedSport("", "");
                                setOddsData([]);
                                setError(null);
                            }}
                            className="w-full text-xs bg-neutral-800 hover:bg-neutral-700 border-neutral-600"
                        >
                            Wyczyść wybór
                        </Button>
                    </div>
                )}
                <Separator orientation="horizontal" />
                {groupedSports.map((group) => (
                    <div key={group.group}>
                        <Button
                            variant="ghost"
                            className="py-4 w-full justify-between"
                            onClick={() => toggleGroup(group.group)}
                        >
                            <span className="truncate text-left">
                                {group.group}
                            </span>
                            <span className="ml-2 text-neutral-400">
                                {openGroups.has(group.group) ? "−" : "+"}
                            </span>
                        </Button>
                        {openGroups.has(group.group) && (
                            <div className="ml-2">
                                {group.sports.map((s) => (
                                    <Button
                                        key={s.key}
                                        variant="ghost"
                                        className={`py-2 w-full justify-start text-left text-sm transition-colors ${
                                            selectedSport === s.key 
                                                ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-600/30' 
                                                : 'hover:bg-neutral-800/50'
                                        }`}
                                        onClick={() => handleSportClick(s)}
                                    >
                                        {s.title}
                                    </Button>
                                ))}
                            </div>
                        )}
                        <Separator orientation="horizontal" />
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

export default SideBar;
