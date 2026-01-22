import { useState, useEffect } from 'react'
import { Send, Phone, Video } from 'lucide-react'

export function ChatArea({ conversationIndex, users }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const conversation = users.find(user => user._id === conversationIndex) || {}

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || !currentUser) return
    const tempMessage = {
      text: inputValue,
      senderId: { _id: currentUser._id }
    }
    setMessages(prev => [...prev, tempMessage])
    setInputValue('')

    try {
      const response = await fetch(`http://localhost:3000/api/v1/message/send/${conversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId: currentUser._id, text: inputValue })
      })
      const data = await response.json()

    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  useEffect(() => {
    if (conversationIndex === null || !conversation._id) return

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/message/messages?receiverId=${conversation._id}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json()
        setMessages(data)

        console.log("Messages:", messages)
        console.log("Conversation", conversation)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    };
    fetchMessages()
  }, [conversationIndex, users])

  //Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/auth/me', {
          credentials: 'include',
        });
        const data = await response.json()
        setCurrentUser(data)
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }
    fetchCurrentUser()
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-600 text-foreground">{conversation.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-2 rounded-full transition-colors">
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex-col gap-3">
        {messages.map((message, index) => (
          <div
            className={`flex ${message.senderId._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-sm break-words whitespace-pre-wrap my-1 px-4 py-2 rounded-lg ${message.senderId._id === currentUser._id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
                }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${message.senderId._id === currentUser._id
                  ? 'text-primary-foreground/70'
                  : 'text-muted-foreground'
                  }`}
              >
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Message"
          className="flex-1 bg-muted text-foreground px-4 py-2 rounded-full outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-full transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
export default ChatArea