import { auth, db } from "../firebase";
import Login from "./login";
import SignUp from "./signUp";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, clearUser } from "../features/authSlice";
import { listenToUsers } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import AddChannel from "./addChannels";
import ChannelList from "./channelList";
import MessageList from "./messageList";
import SendMessage from "./sendMessage";
import { deleteChannel, setActiveChannel } from "../features/channelSlice";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function MainApp() {
  const dispatch = useDispatch();
  const activeChannel = useSelector((state) => state.channel.activeChannel);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;
    const handleOffline = async () => {
      await setDoc(doc(db, "users", user.uid), {
        isOnline: false,
        lastSeen: serverTimestamp()
      }, { merge: true })
    }
    window.addEventListener("beforeunload", handleOffline)
    return () => {
      window.removeEventListener("beforeunload", handleOffline)
    }
  }, [user]);

  useEffect(() => {
    dispatch(listenToUsers());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), {
          isOnline: true
        }, { merge: true });
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            username: currentUser.displayName
          }),
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 space-y-8">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-slate-400 mt-2">Sign in or create an account to get started</p>
          </div>
          <Login />
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or</span></div>
          </div>
          <SignUp />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 bg-slate-950 border-r border-slate-800/50 flex flex-col shrink-0 shadow-2xl z-20">
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white tracking-tight">Slack Clone</h2>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
          <div className="px-3 py-6 space-y-6">
            <div className="space-y-3 px-3">
              <div className="flex items-center justify-between text-slate-500 uppercase tracking-[0.2em] font-bold text-[15px]">
                <span>Channels</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              </div>
              <AddChannel />
            </div>
            <div className="px-1">
              <ChannelList />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              {user.username?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username || user.email}</p>
              <p className="text-xs text-slate-500 truncate">Online</p>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {activeChannel ? (
          <>
            <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md z-10">
              <div className="flex items-center space-x-2">
                <span className="text-xl text-slate-400">#</span>
                <h2 className="text-lg font-bold text-white tracking-tight">{activeChannel.name}</h2>
              </div>
              <div className="flex items-center space-x-2">
                {activeChannel.createdBy === user.uid ? (
                  <button 
                    onClick={() => dispatch(deleteChannel({ channelId: activeChannel.id, userId: user.uid }))}
                    className="px-3 py-1.5 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 rounded-lg transition-all border border-rose-400/20"
                  >
                    Delete Channel
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      const hiddenChannels = JSON.parse(localStorage.getItem("hiddenChannels")) || [];
                      hiddenChannels.push(activeChannel.id);
                      localStorage.setItem("hiddenChannels", JSON.stringify(hiddenChannels));
                      dispatch(setActiveChannel(null));
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                  >
                    Leave
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col relative">
              <MessageList />
              <SendMessage />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-950">
            <div className="text-center space-y-4 max-w-sm px-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 shadow-xl">
                <svg className="w-10 h-10 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Select a channel</h2>
              <p className="text-slate-500">Choose a channel from the sidebar to start collaborating with your team.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainApp;
