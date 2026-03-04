import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc, arrayUnion, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MoreVertical, Trash2, Edit3, Check, X } from "lucide-react";

const EMOJIS = ["❤️", "👍", "🔥", "😂", "😮", "😢"];

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const isMe = message.uid === user?.uid;

  // States for Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  // --- Handlers ---
  const handleReaction = async (emoji) => {
    try {
      const messageRef = doc(db, "messages", message.id);
      await updateDoc(messageRef, {
        [`reactions.${emoji}`]: arrayUnion(user.uid)
      });
    } catch (error) {
      toast.error("Failed to add reaction");
    }
  };

  const handleUpdate = async () => {
    if (!editText.trim() || editText === message.text) return setIsEditing(false);
    try {
      await updateDoc(doc(db, "messages", message.id), {
        text: editText,
        editedAt: serverTimestamp(),
      });
      setIsEditing(false);
    } catch (error) { toast.error("Update failed"); }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", message.id));
      } catch (error) { toast.error("Delete failed"); }
    }
  };

  return (
    <div className={`flex items-end gap-3 mb-6 group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 border shrink-0 shadow-sm">
        <AvatarImage src={message.avatar} />
        <AvatarFallback>{message.name?.[0]}</AvatarFallback>
      </Avatar>

      {/* Message Content Container */}
      <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && <span className="text-[10px] mb-1 font-bold text-muted-foreground uppercase">{message.name}</span>}
        
        <div className="flex items-center gap-1 group/bubble">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={`relative px-4 py-2 rounded-2xl text-sm shadow-sm cursor-pointer transition-all ${
                  isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-white border rounded-bl-none"
                }`}
              >
                {/* Editing Mode */}
                {isEditing ? (
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <Input 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)} 
                      className="h-8 text-xs text-black" 
                      autoFocus 
                    />
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditing(false)}><X className="h-3 w-3"/></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleUpdate}><Check className="h-3 w-3 text-emerald-500"/></Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Image Render */}
                    {message.imageURL && (
                      <img 
                        src={message.imageURL} 
                        alt="Sent" 
                        className="rounded-lg max-h-60 w-auto mb-2 object-cover cursor-pointer hover:brightness-95"
                        onClick={(e) => { e.stopPropagation(); window.open(message.imageURL, '_blank'); }}
                      />
                    )}
                    {/* Text Render */}
                    {message.text && <p className="leading-relaxed">{message.text}</p>}
                    {message.editedAt && <span className="text-[8px] opacity-70 italic block mt-1">(edited)</span>}
                  </>
                )}

                {/* Reactions Display */}
                {message.reactions && (
                  <div className={`absolute -bottom-3 flex gap-1 ${isMe ? "right-0" : "left-0"}`}>
                    {Object.entries(message.reactions).map(([emoji, uids]) => (
                      uids.length > 0 && (
                        <span key={emoji} className="flex items-center bg-white border text-black rounded-full px-1.5 py-0.5 text-[10px] shadow-sm animate-in zoom-in duration-300">
                          {emoji} <span className="ml-1 text-slate-500">{uids.length}</span>
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
            </PopoverTrigger>

            {/* Reaction Picker */}
            {!isEditing && (
              <PopoverContent className="w-fit p-1 rounded-full flex gap-1 bg-white/90 backdrop-blur-md border shadow-lg" side="top" align={isMe ? "end" : "start"}>
                {EMOJIS.map((emoji) => (
                  <Button key={emoji} variant="ghost" className="h-8 w-8 p-0 rounded-full text-lg hover:scale-125 transition-transform" onClick={() => handleReaction(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </PopoverContent>
            )}
          </Popover>

          {/* Edit/Delete Menu */}
          {isMe && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                  <MoreVertical className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setIsEditing(true)}><Edit3 className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[9px] mt-4 text-muted-foreground/60 px-1 font-medium">
          {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default Message;
