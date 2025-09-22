import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface GroupedSportItem {
    title: string;
    group: string;
    key: string;
}

interface GroupedSports {
    group: string;
    sports: GroupedSportItem[];
}

const SideBar = () => {
    const [groupedSports, setGroupedSports] = useState<GroupedSports[]>([]);
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
    
    useEffect(() => {
        const fetchGroupedSports = async () => {
            try {
                const response = await fetch("/api/Sports/grouped");
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data: GroupedSports[] = await response.json();
                setGroupedSports(data);
            } catch (error) {
                console.error("Błąd podczas pobierania sportów (grouped):", error);
            }
        };
        fetchGroupedSports();
    }, []);

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

    return (
        <ScrollArea className="h-full w-full p-3">
            <div className="flex flex-col m-3">
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
                                        className="py-2 w-full justify-start text-left text-sm"
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
