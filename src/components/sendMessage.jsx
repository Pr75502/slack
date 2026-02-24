import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect,useRef } from "react";
import { addMessage } from "../features/messageSlice";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const SendMessage = () => {
  const [text, setText] = useState("");
  const activeChannel = useSelector((state) => state.channel.activeChannel);
  const user = useSelector((state) => state.auth.user);

  const  typingTimeoutRef=useRef()
  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef);
    };
  }, [typingTimeoutRef]);

  const handleTyping = async () => {
    if (!activeChannel || !user) return;
    const typingRef = doc(db, "channels", activeChannel.id, "typing", user.uid);
    await setDoc(typingRef, {
      username: user.username,
      createdAt: serverTimestamp(),
    });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      await deleteDoc(typingRef);
    }, 2000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeChannel) return;
    try {
      console.log("Sending message to channel:", activeChannel.id);
      await addMessage({
        channelId: activeChannel.id,
        text,
        userId: user.uid,
        userEmail: user.email,
        username: user.username,
      });
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  if (!activeChannel) return null;
  return (
    <div className="px-6 py-6 bg-slate-950">
      <form 
        onSubmit={handleSend}
        className="relative group bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-2xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all duration-300"
      >
        <div className="flex items-center">
          <button type="button" className="p-2.5 text-slate-500 hover:text-slate-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-slate-200 placeholder-slate-500 focus:ring-0 py-3 px-2 text-sm lg:text-base selection:bg-indigo-500/30"
            placeholder={`Message #${activeChannel.name}`}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
          />

          <div className="flex items-center space-x-1 px-1">
            <button type="button" className="p-2 text-slate-500 hover:text-slate-300 transition-colors hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </button>
            <button 
              type="submit" 
              disabled={!text.trim()}
              className={`p-2 rounded-xl transition-all duration-300 ${
                text.trim() 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-105 active:scale-95" 
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </form>
      <div className="mt-2 text-[10px] text-slate-600 text-center flex items-center justify-center space-x-1 uppercase tracking-widest font-bold">
        <span>Press</span>
        <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-500">Enter</span>
        <span>to send message</span>
      </div>
    </div>
  );
};

export default SendMessage;