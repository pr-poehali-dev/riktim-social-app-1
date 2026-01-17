import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
}

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Смирнова', avatar: '', lastMessage: 'Привет! Как дела? 😊', time: '14:23', unread: 2, online: true },
  { id: 2, name: 'Дмитрий Иванов', avatar: '', lastMessage: 'Спасибо за помощь!', time: '13:45', unread: 0, online: false },
  { id: 3, name: 'Елена Петрова', avatar: '', lastMessage: 'Созвонимся завтра?', time: '12:10', unread: 1, online: true },
  { id: 4, name: 'Максим Волков', avatar: '', lastMessage: 'Отправил файлы', time: 'Вчера', unread: 0, online: false },
  { id: 5, name: 'Ольга Козлова', avatar: '', lastMessage: 'Отлично! До встречи 👋', time: 'Вчера', unread: 0, online: true },
];

const mockMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела?', time: '14:20', isMine: false },
  { id: 2, text: 'Отлично! А у тебя?', time: '14:21', isMine: true },
  { id: 3, text: 'Тоже хорошо! Хотела спросить про проект 😊', time: '14:22', isMine: false },
  { id: 4, text: 'Конечно, спрашивай!', time: '14:22', isMine: true },
];

export default function Index() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          isMine: true,
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted overflow-hidden">
      <div className="w-96 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Riktim
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/20 transition-all"
              onClick={() => setShowProfile(!showProfile)}
            >
              <Icon name="User" size={20} />
            </Button>
          </div>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Поиск..."
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl transition-all"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-muted/30 ${
                selectedChat?.id === chat.id ? 'bg-muted/50 border-l-4 border-primary' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {chat.name[0]}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-2">
                  {chat.unread}
                </Badge>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat && (
          <>
            <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {selectedChat.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.online ? '🟢 онлайн' : 'не в сети'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-all">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-all">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-all">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-background/50 to-muted/20">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        msg.isMine
                          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                          : 'bg-card/80 backdrop-blur-sm text-foreground rounded-bl-sm shadow-lg'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <span className={`text-xs mt-1 block ${msg.isMine ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-all">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                />
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-all">
                  <Icon name="Smile" size={20} />
                </Button>
                <Button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl transition-all"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {showProfile && (
        <div className="w-80 border-l border-border/50 bg-card/30 backdrop-blur-xl p-6 space-y-6 animate-in slide-in-from-right">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Профиль</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32 ring-4 ring-primary/30">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-accent text-white text-4xl">
                В
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Вы</h3>
              <p className="text-sm text-muted-foreground">+7 999 123-45-67</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-muted/30 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">БИО</p>
              <p className="text-sm">Живу в Riktim! 🚀</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">ИМЯ ПОЛЬЗОВАТЕЛЯ</p>
              <p className="text-sm">@username</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl hover:bg-primary/10">
              <Icon name="Bell" size={18} />
              Уведомления
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl hover:bg-primary/10">
              <Icon name="Settings" size={18} />
              Настройки
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl hover:bg-destructive/10 text-destructive">
              <Icon name="LogOut" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
