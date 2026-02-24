import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChannel } from "../features/channelSlice";

const AddChannel = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !user) return;
    dispatch(addChannel({ name, userId: user.uid }));
    setName("");
  };
    return (
      <div className="group/add">
        <form 
          onSubmit={handleSubmit}
          className="flex items-center bg-indigo-950/20 border border-slate-800/50 rounded-xl p-1 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-indigo-950/40 transition-all duration-300 shadow-lg"
        >
          <input
            type="text"
            placeholder="Create new channel..."
            className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 py-2.5 px-4 text-sm font-medium tracking-tight"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!name.trim()}
            className={`p-2.5 rounded-lg transition-all mr-1 ${
              name.trim() 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95" 
                : "text-slate-700 bg-slate-900/50 cursor-not-allowed"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </form>
      </div>
    );
  };
  export default AddChannel;
  