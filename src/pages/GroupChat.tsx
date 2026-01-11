import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, type GroupMessage, type TyperGroup, type SearchPlayerResult } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GroupChat: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [groupInfo, setGroupInfo] = useState<TyperGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [addingMember, setAddingMember] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchPlayerResult[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<SearchPlayerResult | null>(null);
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadMessages = async () => {
    if (!groupId) return;
    try {
      const messagesData = await apiService.fetchGroupMessages(Number(groupId));
      setMessages(messagesData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Wystąpił błąd podczas pobierania wiadomości');
    }
  };

  const reloadGroupInfo = async () => {
    if (!groupId) return;
    try {
      const groups = await apiService.fetchMyGroups();
      const group = groups.find(g => g.id === Number(groupId));
      if (group) {
        setGroupInfo(group);
      }
    } catch (e: unknown) {
      console.error('Błąd podczas odświeżania informacji o grupie:', e);
    }
  };

  const handleSearchPlayers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await apiService.searchPlayers(query);
      // Filtruj graczy, którzy już są w grupie
      const existingPlayerIds = groupInfo?.members.map(m => m.playerId) || [];
      const filteredResults = results.filter(p => !existingPlayerIds.includes(p.playerId));
      setSearchResults(filteredResults);
    } catch (e: unknown) {
      console.error('Błąd podczas wyszukiwania graczy:', e);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [groupInfo]);

  useEffect(() => {
    // Debounce wyszukiwania
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearchPlayers(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, handleSearchPlayers]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !selectedPlayer || addingMember) return;

    setAddingMember(true);
    setError(null);
    try {
      await apiService.addMemberToGroup(Number(groupId), { playerId: selectedPlayer.playerId });
      setSearchQuery('');
      setSearchResults([]);
      setSelectedPlayer(null);
      setShowAddMember(false);
      // Odśwież informacje o grupie
      await reloadGroupInfo();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Błąd podczas dodawania członka do grupy');
    } finally {
      setAddingMember(false);
    }
  };

  const handleSelectPlayer = (player: SearchPlayerResult) => {
    setSelectedPlayer(player);
    setSearchQuery(`${player.name} ${player.lastName}`);
    setSearchResults([]);
  };

  useEffect(() => {
    if (!groupId) return;
    
    let mounted = true;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        // Pobierz wiadomości
        const messagesData = await apiService.fetchGroupMessages(Number(groupId));
        
        // Pobierz informacje o grupie (z listy grup)
        const groups = await apiService.fetchMyGroups();
        const group = groups.find(g => g.id === Number(groupId));
        
        if (!mounted) return;
        
        setMessages(messagesData);
        setGroupInfo(group || null);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Wystąpił błąd podczas pobierania danych');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [groupId]);

  useEffect(() => {
    // Przewiń do dołu po dodaniu nowych wiadomości
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !messageText.trim() || sending) return;

    setSending(true);
    setError(null);
    try {
      await apiService.sendGroupMessage(Number(groupId), { messageText: messageText.trim() });
      setMessageText('');
      // Odśwież wiadomości po wysłaniu
      await loadMessages();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Błąd podczas wysyłania wiadomości');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4">Ładowanie czatu…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-red-600">{error}</div>
        <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
          Powrót do strony głównej
        </Button>
      </div>
    );
  }

  if (!groupInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4">Grupa nie została znaleziona.</div>
        <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
          Powrót do strony głównej
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do strony głównej
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{groupInfo.groupName}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                Członkowie: {groupInfo.members.length} | Wiadomości: {messages.length}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddMember(!showAddMember)}
            >
              {showAddMember ? 'Anuluj' : '+ Dodaj członka'}
            </Button>
          </div>
          {showAddMember && (
            <form onSubmit={handleAddMember} className="mt-4 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Wyszukaj gracza po imieniu lub nazwisku..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedPlayer(null);
                    }}
                    disabled={addingMember}
                    className="w-full"
                  />
                  {searching && (
                    <div className="absolute right-2 top-2 text-sm text-muted-foreground">
                      Szukam...
                    </div>
                  )}
                  {searchResults.length > 0 && !selectedPlayer && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((player) => (
                        <div
                          key={player.playerId}
                          onClick={() => handleSelectPlayer(player)}
                          className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        >
                          <div className="font-medium">{player.name} {player.lastName}</div>
                          <div className="text-xs text-muted-foreground">ID: {player.playerId}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedPlayer && (
                  <div className="p-2 bg-primary/10 border border-primary/20 rounded-md">
                    <div className="text-sm font-medium">
                      Wybrany gracz: {selectedPlayer.name} {selectedPlayer.lastName}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlayer(null);
                        setSearchQuery('');
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground mt-1"
                    >
                      Zmień wybór
                    </button>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={addingMember || !selectedPlayer}
                  className="w-full"
                >
                  {addingMember ? 'Dodawanie...' : 'Dodaj gracza'}
                </Button>
              </div>
            </form>
          )}
        </CardHeader>
        <CardContent>
          <div 
            ref={messagesContainerRef}
            className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto p-4 border rounded-lg bg-muted/30"
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Brak wiadomości w tej grupie. Bądź pierwszy!
              </div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = user?.userId === message.playerId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border'
                      }`}
                    >
                      <div className={`text-xs mb-1 ${isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {message.playerName} {message.playerLastName}
                      </div>
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.messageText}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {error && (
            <div className="mt-4 text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              type="text"
              placeholder="Napisz wiadomość..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={sending}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={sending || !messageText.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Wysyłanie...' : 'Wyślij'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupChat;
