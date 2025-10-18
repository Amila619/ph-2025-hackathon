import React, { useState, useRef, useEffect } from "react";
import { Send, Image, Paperclip, Phone, Video, MoreVertical, ArrowLeft, User } from "lucide-react";

function Contact() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});
    const messagesEndRef = useRef(null);

    // Sample chat list data
    const chatList = [
        {
            id: 1,
            name: "Artisan Kamal",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%236b1d1d' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3EK%3C/text%3E%3C/svg%3E",
            product: "Handwoven Basket",
            lastMessage: "Yes, I can customize the size",
            time: "2m ago",
            unread: 2,
            online: true,
        },
        {
            id: 2,
            name: "Craftsman Nimal",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23805ad5' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3EN%3C/text%3E%3C/svg%3E",
            product: "Wooden Sculpture",
            lastMessage: "The shipping will take 3-5 days",
            time: "1h ago",
            unread: 0,
            online: false,
        },
        {
            id: 3,
            name: "Designer Sita",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23d97706' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3ES%3C/text%3E%3C/svg%3E",
            product: "Traditional Jewelry Set",
            lastMessage: "I can offer a 10% discount for bulk orders",
            time: "3h ago",
            unread: 1,
            online: true,
        },
    ];

    // Sample messages data
    const initialMessages = {
        1: [
            {
                id: 1,
                sender: "artisan",
                text: "Hello! Thank you for your interest in my handwoven basket.",
                time: "10:30 AM",
            },
            {
                id: 2,
                sender: "user",
                text: "Hi! Can you tell me more about the materials used?",
                time: "10:32 AM",
            },
            {
                id: 3,
                sender: "artisan",
                text: "Of course! I use natural palm leaves and bamboo. All materials are locally sourced and eco-friendly.",
                time: "10:33 AM",
            },
            {
                id: 4,
                sender: "user",
                text: "That sounds great! Can you customize the size?",
                time: "10:35 AM",
            },
            {
                id: 5,
                sender: "artisan",
                text: "Yes, I can customize the size. What dimensions do you need?",
                time: "10:36 AM",
            },
        ],
        2: [
            {
                id: 1,
                sender: "artisan",
                text: "Welcome! I specialize in traditional wooden sculptures.",
                time: "9:15 AM",
            },
            {
                id: 2,
                sender: "user",
                text: "How long does shipping usually take?",
                time: "9:20 AM",
            },
            {
                id: 3,
                sender: "artisan",
                text: "The shipping will take 3-5 days depending on your location.",
                time: "9:22 AM",
            },
        ],
        3: [
            {
                id: 1,
                sender: "artisan",
                text: "Hello! I'm glad you're interested in my jewelry collection.",
                time: "8:00 AM",
            },
            {
                id: 2,
                sender: "user",
                text: "Do you offer discounts for bulk orders?",
                time: "8:05 AM",
            },
            {
                id: 3,
                sender: "artisan",
                text: "I can offer a 10% discount for bulk orders of 5 items or more.",
                time: "8:07 AM",
            },
        ],
    };

    useEffect(() => {
        setMessages(initialMessages);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (message.trim() && selectedChat) {
            const newMessage = {
                id: messages[selectedChat].length + 1,
                sender: "user",
                text: message,
                time: new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => ({
                ...prev,
                [selectedChat]: [...prev[selectedChat], newMessage],
            }));
            setMessage("");

            // Simulate artisan response after 2 seconds
            setTimeout(() => {
                const artisanResponse = {
                    id: messages[selectedChat].length + 2,
                    sender: "artisan",
                    text: "Thank you for your message! I'll get back to you shortly with more details.",
                    time: new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };
                setMessages((prev) => ({
                    ...prev,
                    [selectedChat]: [...prev[selectedChat], artisanResponse],
                }));
            }, 2000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Chat List */}
            <div
                className={`${selectedChat ? "hidden md:flex" : "flex"
                    } w-full md:w-1/3 bg-white border-r flex-col`}
            >
                {/* Header */}
                <div className="p-4 border-b bg-[#8A1717]">
                    <h2 className="text-2xl font-bold text-white">Messages</h2>
                    <p className="text-sm text-gray-200 mt-1">
                        Chat with artisans before purchase
                    </p>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {chatList.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedChat === chat.id ? "bg-purple-50" : ""
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="relative">
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    {chat.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {chat.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-purple-600 mt-1">{chat.product}</p>
                                    <p className="text-sm text-gray-600 truncate mt-1">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="bg-[#6b1d1d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div
                className={`${selectedChat ? "flex" : "hidden md:flex"
                    } flex-1 flex-col bg-gray-50`}
            >
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setSelectedChat(null)}
                                    className="md:hidden text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <img
                                    src={chatList.find((c) => c.id === selectedChat)?.avatar}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {chatList.find((c) => c.id === selectedChat)?.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {chatList.find((c) => c.id === selectedChat)?.online
                                            ? "Online"
                                            : "Offline"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <Video className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages[selectedChat]?.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === "user"
                                                ? "bg-[#8A1717] text-white"
                                                : "bg-white text-gray-900 border"
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <p
                                            className={`text-xs mt-1 ${msg.sender === "user"
                                                    ? "text-gray-200"
                                                    : "text-gray-500"
                                                }`}
                                        >
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t p-4">
                            <div className="flex items-end space-x-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <Paperclip className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <Image className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        className="w-full border rounded-2xl px-4 py-2 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows="1"
                                        style={{ minHeight: "40px", maxHeight: "120px" }}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-[#8A1717] text-white p-3 rounded-full hover:bg-[#561818] transition disabled:opacity-50"
                                    disabled={!message.trim()}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                No Chat Selected
                            </h3>
                            <p className="text-gray-500">
                                Select a conversation to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Contact;