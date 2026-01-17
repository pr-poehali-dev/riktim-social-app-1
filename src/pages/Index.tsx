import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  text?: string;
  time: string;
  isMine: boolean;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Смирнова', avatar: '', lastMessage: 'Привет! Как дела? 😊', time: '14:23', unread: 2, online: true },
  { id: 2, name: 'Дмитрий Иванов', avatar: '', lastMessage: 'Спасибо за помощь!', time: '13:45', unread: 0, online: false },
  { id: 3, name: 'Елена Петрова', avatar: '', lastMessage: 'Созвонимся завтра?', time: '12:10', unread: 1, online: true },
  { id: 4, name: 'Максим Волков', avatar: '', lastMessage: 'Отправил файлы', time: 'Вчера', unread: 0, online: false },
  { id: 5, name: 'Ольга Козлова', avatar: '', lastMessage: 'Отлично! До встречи 👋', time: 'Вчера', unread: 0, online: true },
];

const mockMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела?', time: '14:20', isMine: false, type: 'text' },
  { id: 2, text: 'Отлично! А у тебя?', time: '14:21', isMine: true, type: 'text' },
  { id: 3, text: 'Тоже хорошо! Хотела спросить про проект 😊', time: '14:22', isMine: false, type: 'text' },
  { id: 4, text: 'Конечно, спрашивай!', time: '14:22', isMine: true, type: 'text' },
];

const themes = [
  { name: 'Градиент', primary: '271 81% 56%', secondary: '326 77% 58%', accent: '199 89% 48%', bg: '220 25% 10%' },
  { name: 'Тёмная', primary: '220 13% 18%', secondary: '220 13% 25%', accent: '217 91% 60%', bg: '220 13% 10%' },
  { name: 'Океан', primary: '199 89% 48%', secondary: '204 94% 54%', accent: '175 84% 51%', bg: '200 50% 8%' },
  { name: 'Закат', primary: '14 100% 57%', secondary: '340 82% 52%', accent: '45 93% 47%', bg: '20 30% 10%' },
  { name: 'Лес', primary: '142 71% 45%', secondary: '122 39% 49%', accent: '84 81% 44%', bg: '150 20% 12%' },
];

const wallpapers = [
  { name: 'По умолчанию', pattern: 'none' },
  { name: 'Точки', pattern: 'radial-gradient(circle, hsl(var(--muted)) 1px, transparent 1px)' },
  { name: 'Линии', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--muted))/20 10px, hsl(var(--muted))/20 11px)' },
  { name: 'Сетка', pattern: 'linear-gradient(hsl(var(--muted))/20 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted))/20 1px, transparent 1px)' },
  { name: 'Волны', pattern: 'repeating-radial-gradient(circle at 0 0, transparent 0, hsl(var(--background)) 10px, transparent 20px, hsl(var(--muted))/10 30px)' },
];

const emojis = {
  'Смайлики': ['😊', '😂', '🥰', '😍', '🤗', '😎', '🤔', '😴', '😭', '🥳', '😇', '🤩'],
  'Жесты': ['👍', '👎', '👏', '🙌', '👋', '🤝', '✌️', '🤞', '💪', '🙏', '👊', '✊'],
  'Сердца': ['❤️', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤', '💝', '💘'],
  'Природа': ['🌸', '🌺', '🌻', '🌹', '🌷', '🌴', '🌲', '🍀', '🌿', '🌾', '🌵', '🎋'],
  'Еда': ['🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🧀', '🥗', '🍝', '🍜'],
  'Животные': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  'Активность': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸'],
  'Объекты': ['💻', '📱', '⌚', '📷', '🎧', '🎮', '🕹️', '🎬', '📺', '📻', '🎙️', '🎚️'],
};

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'phone' | 'code' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userName, setUserName] = useState('');
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          isMine: true,
          type: 'text',
        },
      ]);
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const isImage = file.type.startsWith('image/');
      
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          isMine: true,
          type: isImage ? 'image' : 'file',
          fileUrl,
          fileName: file.name,
        },
      ]);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(newMessage + emoji);
  };

  const applyTheme = (index: number) => {
    const theme = themes[index];
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--background', theme.bg);
    setCurrentTheme(index);
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 10) {
      setAuthStep('code');
    }
  };

  const handleCodeSubmit = () => {
    if (verificationCode === '1234') {
      setAuthStep('profile');
    }
  };

  const handleProfileSubmit = () => {
    if (userName.trim()) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="w-full max-w-md p-8 space-y-6 bg-card/50 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Riktim
            </h1>
            <p className="text-muted-foreground">Добро пожаловать!</p>
          </div>

          {authStep === 'phone' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер телефона</label>
                <Input
                  type="tel"
                  placeholder="+7 999 123-45-67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                />
              </div>
              <Button
                onClick={handlePhoneSubmit}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl"
              >
                Получить код
              </Button>
            </div>
          )}

          {authStep === 'code' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium">Код подтверждения</label>
                <p className="text-xs text-muted-foreground">Введите код из SMS (используйте 1234)</p>
                <Input
                  type="text"
                  placeholder="1234"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={4}
                  className="bg-background/50 border-border/50 focus:border-primary/50 rounded-xl text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                onClick={handleCodeSubmit}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl"
              >
                Подтвердить
              </Button>
              <Button
                variant="ghost"
                onClick={() => setAuthStep('phone')}
                className="w-full"
              >
                Изменить номер
              </Button>
            </div>
          )}

          {authStep === 'profile' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ваше имя</label>
                <Input
                  type="text"
                  placeholder="Как вас зовут?"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                />
              </div>
              <Button
                onClick={handleProfileSubmit}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl"
              >
                Начать общение 🚀
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const wallpaperStyle = wallpapers[currentWallpaper].pattern !== 'none' 
    ? { 
        backgroundImage: wallpapers[currentWallpaper].pattern,
        backgroundSize: '20px 20px'
      }
    : {};

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted overflow-hidden">
      <div className="w-96 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Riktim
            </h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/20 transition-all"
                onClick={() => setShowThemeSettings(!showThemeSettings)}
              >
                <Icon name="Palette" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/20 transition-all"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Icon name="User" size={20} />
              </Button>
            </div>
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

            <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-background/50 to-muted/20" style={wallpaperStyle}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md rounded-2xl ${
                        msg.isMine
                          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                          : 'bg-card/80 backdrop-blur-sm text-foreground rounded-bl-sm shadow-lg'
                      }`}
                    >
                      {msg.type === 'image' && msg.fileUrl && (
                        <img src={msg.fileUrl} alt="Изображение" className="rounded-t-2xl max-w-sm" />
                      )}
                      {msg.type === 'file' && msg.fileName && (
                        <div className="px-4 py-3 flex items-center gap-3">
                          <Icon name="File" size={24} />
                          <span className="text-sm">{msg.fileName}</span>
                        </div>
                      )}
                      {msg.type === 'text' && (
                        <div className="px-4 py-3">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      )}
                      <div className="px-4 pb-2">
                        <span className={`text-xs ${msg.isMine ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-primary/20 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                />
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-all">
                      <Icon name="Smile" size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-card/95 backdrop-blur-xl border-border/50">
                    <ScrollArea className="h-72">
                      {Object.entries(emojis).map(([category, emojiList]) => (
                        <div key={category} className="mb-4">
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">{category}</h4>
                          <div className="grid grid-cols-6 gap-2">
                            {emojiList.map((emoji, idx) => (
                              <button
                                key={idx}
                                onClick={() => addEmoji(emoji)}
                                className="text-2xl hover:bg-muted/30 rounded p-1 transition-all"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
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

      {showThemeSettings && (
        <div className="w-80 border-l border-border/50 bg-card/30 backdrop-blur-xl p-6 space-y-6 animate-in slide-in-from-right">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Настройки</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowThemeSettings(false)}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Тема оформления</h3>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyTheme(idx)}
                    className={`p-3 rounded-xl border transition-all ${
                      currentTheme === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${theme.primary})` }} />
                      <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${theme.secondary})` }} />
                      <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${theme.accent})` }} />
                    </div>
                    <p className="text-xs">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Обои чата</h3>
              <div className="space-y-2">
                {wallpapers.map((wallpaper, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentWallpaper(idx)}
                    className={`w-full p-3 rounded-xl border transition-all text-left ${
                      currentWallpaper === idx ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    {wallpaper.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
                {userName[0] || 'В'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{userName || 'Вы'}</h3>
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
