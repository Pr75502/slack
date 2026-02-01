import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addMessage } from "../features/messageSlice";

const SendMessage = () => {
    
    const [text, setText] = useState("")
     const activeChannel = useSelector((state) => state.channel.activeChannel);
     const user = useSelector((state) => state.auth.user);

    
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
            });
            setText("");
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally, you could show a user-friendly error message here
        }
    }
    if (!activeChannel) return null;
    return (
      <div>
        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder={`Message #${activeChannel.name}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">send</button>
        </form>
      </div>
    );
}

export default SendMessage