import Chat from "../model/chat.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

// Get or create a chat between two users for a specific item
export const getOrCreateChat = async (req, res) => {
  try {
    const { other_user_id, product_id, service_id } = req.body;
    const current_user_id = req.user.sub; // from JWT token

    if (!other_user_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: "Other user ID is required" 
      });
    }

    if (!product_id && !service_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: "Either product_id or service_id is required" 
      });
    }

    const item_type = product_id ? 'product' : 'service';
    const item_id = product_id || service_id;

    // Check if chat already exists
    const queryField = item_type === 'product' ? 'product_id' : 'service_id';
    let chat = await Chat.findOne({
      participants: { $all: [current_user_id, other_user_id] },
      [queryField]: item_id
    }).populate('participants', 'name universityMail contact');

    if (!chat) {
      // Create new chat
      const newChat = {
        participants: [current_user_id, other_user_id],
        item_type,
        messages: []
      };
      
      if (item_type === 'product') {
        newChat.product_id = item_id;
      } else {
        newChat.service_id = item_id;
      }

      chat = await Chat.create(newChat);
      chat = await Chat.findById(chat._id).populate('participants', 'name universityMail contact');
    }

    console.log('Chat participants:', chat.participants?.map(p => ({ id: p._id, name: p.name })));
    console.log('Returning chat with', chat.messages?.length || 0, 'messages');

    res.status(HTTP_STATUS.OK).json({ 
      data: chat,
      message: "Chat loaded successfully" 
    });
  } catch (error) {
    console.error('Get or create chat error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: "Error creating chat" 
    });
  }
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const user_id = req.user.sub;

    const chats = await Chat.find({
      participants: user_id
    })
    .populate('participants', 'name universityMail contact')
    .sort({ last_message_at: -1 });

    res.status(HTTP_STATUS.OK).json({ 
      data: chats,
      message: "Chats fetched successfully" 
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: "Error fetching chats" 
    });
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const user_id = req.user.sub;

    console.log('=== GET CHAT MESSAGES API CALLED ===');
    console.log('chat_id:', chat_id);
    console.log('user_id:', user_id);

    const chat = await Chat.findOne({
      _id: chat_id,
      participants: user_id
    }).populate('participants', 'name universityMail contact');

    if (!chat) {
      console.error('Chat not found or user not a participant');
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        message: "Chat not found" 
      });
    }

    console.log('Chat found with', chat.messages.length, 'messages');
    if (chat.messages.length > 0) {
      console.log('Sample message:', {
        sender_id: chat.messages[0].sender_id,
        message: chat.messages[0].message,
        timestamp: chat.messages[0].timestamp,
        read: chat.messages[0].read
      });
    }

    res.status(HTTP_STATUS.OK).json({ 
      data: chat,
      message: "Messages fetched successfully" 
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: "Error fetching messages" 
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { chat_id, message } = req.body;
    const sender_id = req.user.sub;

    console.log('=== SEND MESSAGE API CALLED ===');
    console.log('chat_id:', chat_id);
    console.log('sender_id:', sender_id);
    console.log('message:', message);

    if (!chat_id || !message) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: "Chat ID and message are required" 
      });
    }

    const chat = await Chat.findOne({
      _id: chat_id,
      participants: sender_id
    });

    if (!chat) {
      console.error('Chat not found or user not a participant');
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        message: "Chat not found" 
      });
    }

    const newMessage = {
      sender_id,
      message,
      timestamp: new Date(),
      read: false
    };

    chat.messages.push(newMessage);
    chat.last_message = message;
    chat.last_message_at = new Date();

    await chat.save();
    console.log('Message saved to database');

    const updatedChat = await Chat.findById(chat_id)
      .populate('participants', 'name universityMail contact');

    res.status(HTTP_STATUS.OK).json({ 
      data: {
        chat: updatedChat,
        message: newMessage 
      },
      message: "Message sent successfully" 
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: "Error sending message" 
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const user_id = req.user.sub;

    console.log('=== MARK AS READ API CALLED ===');
    console.log('chat_id:', chat_id);
    console.log('user_id:', user_id);

    const chat = await Chat.findOne({
      _id: chat_id,
      participants: user_id
    });

    if (!chat) {
      console.error('Chat not found or user not a participant');
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        message: "Chat not found" 
      });
    }

    let markedCount = 0;
    // Mark all messages from other participants as read
    chat.messages.forEach(msg => {
      if (msg.sender_id.toString() !== user_id && !msg.read) {
        msg.read = true;
        markedCount++;
      }
    });

    await chat.save();
    console.log(`Marked ${markedCount} messages as read`);

    res.status(HTTP_STATUS.OK).json({ 
      data: { markedCount },
      message: "Messages marked as read" 
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      message: "Error marking messages as read" 
    });
  }
};
