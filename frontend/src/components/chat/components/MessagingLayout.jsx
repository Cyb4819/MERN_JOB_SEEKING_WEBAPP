import { ConversationList } from './ConversationList'
import { ChatArea } from './ChatArea'
import { useState, useEffect, useInsertionEffect } from 'react'

export function MessagingLayout() {
  const [selectedConversation, setSelectedConversation] = useState(-1)
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/message/all-users')
        const data = await response.json()
        setConversations(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="flex h-screen bg-background" id='message-layout'>
      {/* Left Sidebar - Conversations */}
      <ConversationList
        users={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />

      {/* Main Chat Area */}
      <ChatArea
        conversationIndex={selectedConversation}
        users={conversations}
      />
    </div>
  )
}
