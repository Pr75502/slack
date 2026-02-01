import { useSelector, useDispatch } from "react-redux"
import { use, useEffect } from "react"
import { fetchChannels } from "../features/channelSlice"
import { logoutUser } from "../features/authSlice"
import { listenToChannel } from "../features/channelSlice"
import { setActiveChannel } from "../features/channelSlice"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"

const ChannelList = () => {
    const dispatch = useDispatch()
    const { list, loading } = useSelector(state => state.channel)
    const activeChannel=useSelector(state=>state.channel.activeChannel)
    useEffect(() => {
       
        const unsubscribe = dispatch(listenToChannel())
        
        return ()=>unsubscribe && unsubscribe()
    }, [dispatch])
    
    if (loading) {
      return <h1>Loading Channels...</h1>
    }
    return (
      <div>
        <button onClick={() => dispatch(logoutUser())}>Logout</button>

        {list &&
          !loading &&
          list.map((item) => (
            <ul key={item.id}>
              <li
                onClick={() => dispatch(setActiveChannel(item))}
                style={{
                  cursor: "pointer",
                  fontWeight:
                    activeChannel?.id === item.id ? "bold" : "normal",
                }}
              >
                {item.name}
              </li>
            </ul>
          ))}
              
      </div>
    );
}

export default ChannelList
