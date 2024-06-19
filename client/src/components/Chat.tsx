"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import socket from "../socket";

// interface Message {
//   user: string;
//   content: string;
// }

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    socket.on("reconnect_messages", (msgs) => {
      setMessages(msgs);
    });

    // 再接続時にメッセージを取得
    socket.emit("reconnect");
    return () => {
      socket.off("message");
      socket.off("reconnect_messages");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.send(message);
      setMessage("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        className="text-gray-950"
        value={message}
        onChange={handleInputChange}
        type="text"
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
};

export default Chat;
