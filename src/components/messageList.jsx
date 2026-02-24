import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToMessage, clearMessage } from "../features/messageSlice.js";
import { editMessage,deleteMessage } from "../features/messageSlice.js";
import { listenToTyping } from "../features/messageSlice.js"

const formatLastSeen = (timestamp) => {
  if (!timestamp) return "";
  // Ensure we handle numeric timestamps
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return date.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
};

const MessageList = () => {
  const dispatch = useDispatch();
  const activeChannel = useSelector((state) => state.channel.activeChannel);
  const bottomRef=useRef()
  const messages = useSelector((state) => state.message.list);
  const typingUsers = useSelector((state) => state.message.typingUsers);
  const users=useSelector(state=>state.user.list)
  const currentUser = useSelector((state) => state.auth.user);
  const otherUsers = typingUsers.filter(u => u.username != currentUser.username)

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEditSave = (messageId) => {
    if (editText.trim()) {
      dispatch(editMessage({ 
        channelId: activeChannel.id, 
        messageId: messageId, 
        newText: editText 
      }));
    }
    setEditingId(null);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  
  useEffect(() => {
    if (!activeChannel) return;

    const unsubscribeMessages = dispatch(
      listenToMessage(activeChannel.id)
    );

    const unsubscribeTyping = dispatch(
      listenToTyping(activeChannel.id)
    );

    return () => {
      unsubscribeMessages && unsubscribeMessages();
      unsubscribeTyping && unsubscribeTyping();
      dispatch(clearMessage());
    };
  }, [activeChannel, dispatch]);


  if (!activeChannel)
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Select a channel to start chatting
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-6">
      <div className="flex flex-col justify-end min-h-full">
        <div className="mb-8 p-8 border-b border-slate-800/50">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-800 shadow-xl">
            <span className="text-3xl text-slate-400 font-light">#</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome to #{activeChannel.name}!</h1>
          <p className="text-slate-400 max-w-lg">This is the start of the #{activeChannel.name} channel. Use it to collaborate with your team and keep discussions organized.</p>
        </div>

        <div className="space-y-4">
          {messages &&
            messages.map((message) => {
              const messageUser = users.find(user => user.uid === message.userId);
              const isCurrentUser = message.userId === currentUser.uid;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
                >
                  <div className={`group relative flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse space-x-reverse" : "flex-row"} space-x-3`}>
                    {/* Avatar */}
                    <div className="shrink-0 mt-auto">
                      <div className={`w-8 h-8 rounded-lg ${isCurrentUser ? "bg-indigo-600" : "bg-slate-800"} flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-sm`}>
                        {message.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                      {/* Name & Time */}
                      <div className={`flex items-baseline space-x-2 mb-1 px-1 ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                        <span className="text-xs font-bold text-slate-300">
                          {isCurrentUser ? "You" : message.username}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                        isCurrentUser 
                          ? "bg-indigo-600 text-white rounded-tr-none border border-indigo-500/50" 
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                      }`}>
                        {editingId === message.id ? (
                          <div className="min-w-[200px] space-y-2 py-1">
                            <input
                              autoFocus
                              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleEditSave(message.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                            />
                            <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
                              <button onClick={() => handleEditSave(message.id)} className="text-white hover:underline">Save</button>
                              <button onClick={() => setEditingId(null)} className="text-white/60 hover:text-white">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="break-words leading-relaxed">
                            {message.text}
                            {message.edited && (
                              <span className="ml-2 text-[10px] opacity-50 italic">(edited)</span>
                            )}
                          </div>
                        )}

                        {/* Status Indicator inside bubble or next to it */}
                        {!isCurrentUser && messageUser && (
                           <div className={`absolute -left-1 bottom-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${messageUser.isOnline ? "bg-green-500" : "bg-slate-600"}`}></div>
                        )}
                      </div>
                    </div>

                    {/* Actions Menu - Appears on hover */}
                    <div className={`absolute top-0 ${isCurrentUser ? "-left-12" : "-right-12"} opacity-0 group-hover:opacity-100 flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1 transition-all duration-200 z-10`}>
                      {isCurrentUser && (
                        <button 
                          onClick={() => {
                            setEditingId(message.id);
                            setEditText(message.text);
                          }}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      )}
                      {(isCurrentUser || activeChannel.createdBy === currentUser.uid) && (
                        <button 
                          onClick={() => dispatch(deleteMessage({ channelId: activeChannel.id, messageId: message.id }))}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {otherUsers.length > 0 && (
          <div className="px-3 py-2 text-xs font-medium text-slate-500 animate-pulse flex items-center space-x-2">
            <div className="flex space-x-0.5">
              <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></span>
            </div>
            <span>
              <span className="text-slate-400">{otherUsers.map(u => u.username).join(", ")}</span> is typing...
            </span>
          </div>
        )}
      </div>

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};
 


export default MessageList;