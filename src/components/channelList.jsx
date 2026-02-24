import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { listenToChannels } from "../features/channelSlice";
import { logoutUser } from "../features/authSlice";
import { setActiveChannel } from "../features/channelSlice";

const ChannelList = () => {
  const dispatch = useDispatch();
  const { list, loading, activeChannel } = useSelector((state) => state.channel);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    const unsubscribe = dispatch(listenToChannels());

    return () => unsubscribe && unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const hiddenChannels = JSON.parse(localStorage.getItem("hiddenChannels")) || [];
    setFilteredList(list.filter(channel => !hiddenChannels.includes(channel.id)));
  }, [list]);

  if (loading) {
    return (
      <div className="px-4 py-4 space-y-3 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-slate-800 rounded-md w-3/4"></div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {filteredList &&
        !loading &&
        filteredList.map((item) => (
          <button
            key={item.id}
            onClick={() => dispatch(setActiveChannel(item))}
            className={`w-full text-left px-4 py-2.5 rounded-xl group flex items-center space-x-3 transition-all duration-200 ${
              activeChannel?.id === item.id 
                ? "bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-900/10" 
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            }`}
          >
            <span className={`text-xl font-light tracking-tighter ${activeChannel?.id === item.id ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400"}`}>#</span>
            <span className="truncate text-base font-semibold tracking-tight">{item.name}</span>
          </button>
        ))}
    </div>
  );
};

export default ChannelList;

