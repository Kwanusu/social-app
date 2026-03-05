import React, { useState, useEffect, useRef } from 'react';
import { db, auth, storage, rtdb } from '../firebase'; 
import { 
    query, collection, orderBy, onSnapshot, 
    limit, addDoc, serverTimestamp, doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref, set, onValue, onDisconnect } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast, Toaster } from 'react-hot-toast';
import { 
    Paperclip, Loader2, SendHorizontal, Search, X, 
    ArrowDown, MoreVertical, Trash2, Edit3, Check 
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmojiSelector from './EmojiSelector';

// --- Sub-Component: Individual Message ---
const Message = ({ message }) => {
    const [user] = useAuthState(auth);
    const isMe = message.uid === user?.uid;
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);

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
        if (window.confirm("Delete message?")) {
            try {
                await deleteDoc(doc(db, "messages", message.id));
            } catch (error) { toast.error("Delete failed"); }
        }
    };

    return (
        <div className={`flex items-end gap-2 mb-4 group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
            <Avatar className="h-8 w-8 border shrink-0">
                <AvatarImage src={message.avatar} />
                <AvatarFallback>{message.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && <span className="text-[10px] mb-1 font-bold text-muted-foreground uppercase">{message.name}</span>}
                <div className="flex items-center gap-1 group/bubble">
                    {/* UPDATED: Added explicit text-slate-900 (dark) for messages from others and ensured text-white for your messages */}
                    <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        isMe 
                        ? "bg-primary text-primary-foreground rounded-br-none" 
                        : "bg-white border border-slate-200 text-slate-900 rounded-bl-none" 
                    }`}>
                        {isEditing ? (
                            <div className="flex flex-col gap-2 min-w-[150px]">
                                <Input 
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)} 
                                    className="h-7 text-xs text-slate-900 bg-white" 
                                    autoFocus 
                                />
                                <div className="flex justify-end gap-1">
                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => setIsEditing(false)}><X className="h-3 w-3"/></Button>
                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={handleUpdate}><Check className="h-3 w-3 text-emerald-500"/></Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {message.imageURL && <img src={message.imageURL} className="rounded-lg mb-2 max-h-48 object-cover" alt="sent" />}
                                {message.text && <p className="leading-relaxed">{message.text}</p>}
                                {message.editedAt && <span className="text-[8px] opacity-60 italic block mt-1">(edited)</span>}
                            </>
                        )}
                    </div>
                    {isMe && !isEditing && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                                    <MoreVertical className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => setIsEditing(true)}><Edit3 className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Component: ChatBox ---
function ChatBox() {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollRef = useRef();
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = [];
            snapshot.forEach((doc) => msgs.push({ ...doc.data(), id: doc.id }));
            setMessages(msgs.reverse());
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const typingRef = ref(rtdb, 'typing/');
        onValue(typingRef, (snapshot) => {
            const data = snapshot.val() || {};
            const list = Object.entries(data).filter(([uid, typing]) => typing && uid !== user?.uid).map(([uid]) => uid);
            setTypingUsers(list);
        });
    }, [user]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (!user) return;
        const myTypingRef = ref(rtdb, `typing/${user.uid}`);
        set(myTypingRef, true);
        onDisconnect(myTypingRef).set(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => set(myTypingRef, false), 3000);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
        setUploading(true);
        const fileRef = storageRef(storage, `chat_images/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on("state_changed", null, () => setUploading(false), async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, "messages"), { imageURL: url, uid: user.uid, name: user.displayName, avatar: user.photoURL, createdAt: serverTimestamp() });
            setUploading(false);
        });
    };

    const submitMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || uploading) return;
        const textToSend = input;
        setInput("");
        await addDoc(collection(db, "messages"), { text: textToSend, uid: user.uid, name: user.displayName, avatar: user.photoURL, createdAt: serverTimestamp() });
    };

    const filteredMessages = messages.filter(m => m.text?.toLowerCase().includes(searchTerm.toLowerCase()));

    const addEmoji = (emoji) => {
        setInput((prev) => prev + emoji);
        };

    return (
        <div className="flex flex-col h-[650px] w-full max-w-2xl mx-auto border rounded-2xl bg-background shadow-2xl overflow-hidden relative">
            <Toaster />
            <header className="p-4 border-b bg-muted/40 backdrop-blur-md flex items-center justify-between">
                {!isSearching ? (
                    <>
                        <div className="font-bold text-sm">Community Chat</div>
                        <Button variant="ghost" size="icon" onClick={() => setIsSearching(true)}><Search className="h-4 w-4"/></Button>
                    </>
                ) : (
                    <div className="flex w-full gap-2 items-center animate-in slide-in-from-top duration-200">
                        <Input placeholder="Search messages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 text-xs" autoFocus />
                        <Button variant="ghost" size="sm" onClick={() => { setIsSearching(false); setSearchTerm(""); }}><X className="h-4 w-4"/></Button>
                    </div>
                )}
            </header>

            <ScrollArea className="flex-1 p-4 bg-slate-50/20 relative" onScroll={handleScroll}>
                <div className="space-y-4">
                    {filteredMessages.map((msg) => <Message key={msg.id} message={msg} />)}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {showScrollButton && (
                <Button variant="secondary" size="icon" className="absolute bottom-28 right-6 rounded-full shadow-xl z-20" onClick={() => scrollRef.current?.scrollIntoView({ behavior: "smooth" })}><ArrowDown className="h-4 w-4"/></Button>
            )}

            <div className="p-4 border-t bg-background">
                <div className="h-5 mb-1 text-[10px] text-muted-foreground uppercase flex items-center gap-2">
                    {typingUsers.length > 0 && <><Loader2 className="h-3 w-3 animate-spin"/> Someone is typing...</>}
                </div>
                <form onSubmit={submitMessage} className="flex gap-2 items-center">
                    {/* Attachment Button */}
                    <label className="cursor-pointer hover:bg-muted p-2 rounded-full shrink-0 transition-colors">
                        {uploading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Paperclip className="h-5 w-5"/>}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>

                    {/* Input Wrapper for Input + Emoji Button */}
                    <div className="flex-1 flex items-center bg-muted/50 rounded-lg pr-2 focus-within:ring-1 focus-within:ring-ring">
                        <Input 
                            placeholder="Message..." 
                            value={input} 
                            onChange={handleInputChange} 
                            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0" 
                        />
                        
                        {/* The Emoji Selector Component */}
                        <EmojiSelector onEmojiClick={addEmoji} />
                    </div>

                    <Button type="submit" size="icon" disabled={!input.trim() || uploading}>
                        <SendHorizontal className="h-4 w-4"/>
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ChatBox;


