"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import socket from "../socket";

interface Message {
  user: string;
  message: string;
}

const Chat: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    socket.on("reconnect_messages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.emit("reconnect");
    return () => {
      socket.off("message");
      socket.off("reconnect_messages");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "" && username.trim() !== "") {
      socket.emit("message", { user: username, message });
      setMessage("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 mb-16">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 border-t flex items-center fixed bottom-0 w-full"
      >
        <input
          className="flex-2 border p-2 mr-2 rounded text-gray-950"
          value={username}
          onChange={handleUsername}
          type="text"
          placeholder="ユーザー名"
        />

        <input
          className="flex-1 border p-2 mr-2 rounded text-gray-950"
          value={message}
          onChange={handleMessageChange}
          type="text"
          placeholder="メッセージ"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          送信
        </button>
      </form>
    </div>
  );
};

export default Chat;
