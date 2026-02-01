import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { listenToMessage, clearMessage } from "../features/messageSlice.js"


const MessageList = () => {
    const dispatch=useDispatch()
    const activeChannel = useSelector(state=>state.channel.activeChannel)
    
    const messages = useSelector(state => state.message.list)
    useEffect(() => {
        if (!activeChannel) return 
        
        console.log("Listening to messages for channel:", activeChannel.id);
        const unsubscribe = dispatch(listenToMessage(activeChannel.id))
        return () => {
            if (unsubscribe) unsubscribe()
            dispatch(clearMessage())
        }
    }, [activeChannel, dispatch])
      if (!activeChannel) return <p>Select a channel</p>;
    return (
        <div>
            {messages && messages.map(message => 
                <p key={message.id}>
                    <strong>{message.userEmail}</strong>:{message.text}
                </p>
            )}

        </div>
    )
}

export default MessageList