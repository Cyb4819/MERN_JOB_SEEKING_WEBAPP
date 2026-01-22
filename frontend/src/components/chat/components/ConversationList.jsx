import { Search } from 'lucide-react'
import { ConversationItem } from './ConversationItem'
import { useEffect, useState } from 'react'

export function ConversationList({
  users,
  selectedConversation,
  onSelectConversation,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [chats, setChats] = useState([])

  const filteredUser = searchTerm.trim() ? users.filter(
    u => u.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  console.log('Filtered Conversations:', filteredUser);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/message/all-chats', {
          credentials: 'include',
        });
        const data = await response.json()
        console.log(data)
        setChats(data)
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }
    fetchChats()
  }, [])

  return (
    <div className="w-80 border-r border-border flex flex-col bg-card">

      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-4">Messaging</h1>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-full px-3">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search user"
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUser.length !== 0 ? filteredUser.map((conversation, index) => (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            isSelected={selectedConversation === conversation._id}
            onClick={() => onSelectConversation(conversation._id)}
          />
        )) : chats.map((conversation, index) => (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            isSelected={selectedConversation === conversation._id}
            onClick={() => onSelectConversation(conversation._id)}
          />
        ))
        }
      </div>
    </div>
  )
}
