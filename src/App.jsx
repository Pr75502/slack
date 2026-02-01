import { auth, db } from "./firebase";
import Login from "./components/login";
import SignUp from "./components/signUp";
import { onAuthStateChanged } from "firebase/auth";
import { setUser,clearUser } from "./features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import AddChannel from "./components/addChannels";
import ChannelList from "./components/channelList";
import MessageList from "./components/messageList";
import SendMessage from "./components/sendMessage";


function App() {
  console.log("Auth:", auth);
  console.log("DB:", db);

  const dispatch = useDispatch()
   const activeChannel = useSelector((state) => state.channel.activeChannel);
  const user = useSelector((state) => state.auth.user)
  const [showLogin, setShowLogin] = useState(true)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
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
      <div>
        {showLogin ? <Login /> : <SignUp />}

        <button onClick={() => setShowLogin(!showLogin)}>
          {" "}
          {showLogin ? "Go to Signup" : "Go to Login"}
        </button>
        {activeChannel ? (
          <h2>Channel: #{activeChannel.name}</h2>
        ) : (
          <p>Select a channel</p>
        )}
       
      </div>
    );
  }
  
  return (
    <div>
      <h1>Slack Clone</h1>
      <p>Logged in as: {user.email}</p>
      <AddChannel />
      <ChannelList />
      <MessageList />
      <SendMessage />
    </div>
  );
}

export default App;

