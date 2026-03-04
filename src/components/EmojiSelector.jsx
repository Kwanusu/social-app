import EmojiPicker from 'emoji-picker-react';
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from './ui/button';

const EmojiSelector = ({ onEmojiClick }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-none shadow-xl mb-2" side="top" align="start">
        <EmojiPicker 
          onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
          autoFocusSearch={false}
          theme="auto" // Syncs with your ThemeContext
          width={350}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiSelector