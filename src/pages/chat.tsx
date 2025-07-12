import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Match {
  spotify_id: string;
  display_name: string;
  profile_image: string;
  shared_artists: string[];
}

interface Message {
  _id?: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  timestamp: string;
}

const Chat = () => {
  const { spotify_id } = useParams<{ spotify_id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUserSpotifyId = localStorage.getItem("spotify_id");

  // Fetch existing chat messages
  useEffect(() => {
    const fetchChats = async () => {
      try {
        console.log("📡 Fetching chats between", currentUserSpotifyId, "and", spotify_id);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/chats?sender_id=${currentUserSpotifyId}&receiver_id=${spotify_id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Retrieved chats:", data.chats);
          setMessages(data.chats);
        } else {
          console.error("❌ Failed to fetch chats:", await response.text());
        }
      } catch (error) {
        console.error("❌ Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    // Get match info from localStorage
    const matchesString = localStorage.getItem("matches");
    if (matchesString) {
      const matches: Match[] = JSON.parse(matchesString);
      const foundMatch = matches.find((m) => m.spotify_id === spotify_id);
      setMatch(foundMatch || null);
    }

    fetchChats();
  }, [spotify_id, currentUserSpotifyId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !currentUserSpotifyId) return;

    const messagePayload = {
      sender_id: currentUserSpotifyId,
      receiver_id: spotify_id,
      message: newMessage.trim(),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        const savedChat = await response.json();
        console.log("✅ Message saved:", savedChat);

        setMessages((prev) => [
          ...prev,
          {
            _id: savedChat.chat_id,
            sender_id: currentUserSpotifyId,
            receiver_id: spotify_id!,
            message: newMessage.trim(),
            timestamp: new Date().toISOString(),
          },
        ]);

        setNewMessage("");
      } else {
        console.error("❌ Failed to send message:", await response.text());
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-gray-900 border-b border-gray-700">
        {match?.profile_image && (
          <img
            src={match.profile_image}
            alt={match.display_name}
            className="w-12 h-12 rounded-full border-2 border-green-500 mr-4"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{match?.display_name}</h2>
          <p className="text-gray-400 text-sm">
            Shared Artists: {match?.shared_artists?.join(", ") || "None"}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <p className="text-center text-gray-400">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender_id === currentUserSpotifyId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs ${
                  msg.sender_id === currentUserSpotifyId
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                <p className="font-semibold">
                  {msg.sender_id === currentUserSpotifyId ? "You" : match?.display_name}
                </p>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-300">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message…"
          className="flex-1 p-2 rounded-lg text-black"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
