"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import socket from "../socket";

interface Message {
  user: string;
  message: string;
}

const Chat: React.FC = () => {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    socket.on("reconnect_messages", (msgs: Message[]) => {
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
    if (message.trim() !== "" && username.trim() !== "") {
      socket.emit("message", { user: username, message });
      setUsername("");
      setMessage("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <input
        className="text-gray-950"
        value={username}
        onChange={handleUsername}
        type="text"
        placeholder="ユーザー名"
      />

      <input
        className="text-gray-950"
        value={message}
        onChange={handleInputChange}
        type="text"
        placeholder="メッセージ"
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
};

export default Chat;
