import { useState } from "react";
import { useSelector } from "react-redux";
import { addChannel } from "../features/channelSlice";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";


const AddChannel = () => {
    const [name, setName] = useState("")
    
    const user = useSelector(state =>state.auth.user)
   

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !user) return;
        await addChannel({ name, userId: user.uid }); 
        setName("");
    };
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Add Channel</button>
        </form>
        <button
          onClick={async () => {
            await addDoc(collection(db, "ui-proof"), {
              proof: "visible in console",
              time: Date.now(),
            });
            alert("written");
          }}
        >
          Write Proof
        </button>
      </div>
    );

}
export default AddChannel