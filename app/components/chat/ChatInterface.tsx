"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Send, Phone, Video, Users, Plus, Search, MoreVertical, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react"
import type { RootState } from "@/store/store"

interface ChatRoom {
  id: string
  name: string
  type: "direct" | "group"
  participants: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    online: boolean
  }>
  lastMessage?: {
    content: string
    sender: string
    timestamp: string
  }
  unreadCount: number
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  type: "text" | "file" | "system"
}

interface CallState {
  active: boolean
  type: "audio" | "video"
  participants: string[]
  muted: boolean
  videoOff: boolean
}

export default function ChatInterface() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [callState, setCallState] = useState<CallState>({
    active: false,
    type: "audio",
    participants: [],
    muted: false,
    videoOff: false,
  })
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    fetchChatRooms()
    // Initialize WebSocket connection for real-time messaging
    initializeWebSocket()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id)
    }
  }, [selectedRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeWebSocket = () => {
    // WebSocket connection would be established here
    // For demo purposes, we'll simulate real-time updates
    console.log("WebSocket connection initialized")
  }

  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/chat/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setChatRooms(data.rooms || [])
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error)
    }
  }

  const fetchMessages = async (roomId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRoom) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/chat/rooms/${selectedRoom.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages(selectedRoom.id)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const startCall = async (type: "audio" | "video") => {
    if (!selectedRoom) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/chat/rooms/${selectedRoom.id}/call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        setCallState({
          active: true,
          type,
          participants: selectedRoom.participants.map((p) => p.id),
          muted: false,
          videoOff: type === "audio",
        })
      }
    } catch (error) {
      console.error("Failed to start call:", error)
    }
  }

  const endCall = () => {
    setCallState({
      active: false,
      type: "audio",
      participants: [],
      muted: false,
      videoOff: false,
    })
  }

  const toggleMute = () => {
    setCallState((prev) => ({ ...prev, muted: !prev.muted }))
  }

  const toggleVideo = () => {
    setCallState((prev) => ({ ...prev, videoOff: !prev.videoOff }))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredRooms = chatRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.participants.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Chat & Communication</h2>
          <p className="text-gray-600">Real-time messaging and video calls</p>
        </div>
        <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat Room</DialogTitle>
              <DialogDescription>Start a new conversation or group chat</DialogDescription>
            </DialogHeader>
            <CreateRoomForm
              onSubmit={() => {
                fetchChatRooms()
                setShowCreateRoom(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chat Rooms Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-4">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id ? "bg-blue-50 border-blue-200 border" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={room.participants[0]?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {room.type === "group" ? <Users className="h-4 w-4" /> : room.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{room.name}</span>
                      </div>
                      {room.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {room.lastMessage && (
                      <div className="text-xs text-gray-500 ml-10">
                        <p className="truncate">{room.lastMessage.content}</p>
                        <p>{new Date(room.lastMessage.timestamp).toLocaleTimeString()}</p>
                      </div>
                    )}
                  </div>
                ))}

                {filteredRooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-3">
          {selectedRoom ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedRoom.participants[0]?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedRoom.type === "group" ? <Users className="h-5 w-5" /> : selectedRoom.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedRoom.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedRoom.participants.length} participant
                        {selectedRoom.participants.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => startCall("audio")} disabled={callState.active}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => startCall("video")} disabled={callState.active}>
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-[400px]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender.id === user?.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.sender.id !== user?.id && (
                            <p className="text-xs font-medium mb-1">{message.sender.name}</p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender.id === user?.id ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Users className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a chat room to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Active Call Overlay */}
      {callState.active && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">{callState.type === "video" ? "Video Call" : "Audio Call"}</CardTitle>
              <CardDescription className="text-center">{selectedRoom?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                {callState.type === "video" && !callState.videoOff ? (
                  <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center mb-4">
                    <p className="text-white">Video feed would appear here</p>
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedRoom?.participants[0]?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">{selectedRoom?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <p className="text-lg font-medium">Connected</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant={callState.muted ? "destructive" : "outline"} size="lg" onClick={toggleMute}>
                  {callState.muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                {callState.type === "video" && (
                  <Button variant={callState.videoOff ? "destructive" : "outline"} size="lg" onClick={toggleVideo}>
                    {callState.videoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                )}

                <Button variant="destructive" size="lg" onClick={endCall}>
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function CreateRoomForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "direct",
    participants: [""],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSubmit()
      }
    } catch (error) {
      console.error("Failed to create room:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Room Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter room name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Room Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="direct">Direct Message</option>
          <option value="group">Group Chat</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Participants (Email)</label>
        {formData.participants.map((participant, index) => (
          <Input
            key={index}
            value={participant}
            onChange={(e) => {
              const newParticipants = [...formData.participants]
              newParticipants[index] = e.target.value
              setFormData({ ...formData, participants: newParticipants })
            }}
            placeholder="participant@example.com"
            className="mb-2"
            required
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setFormData({
              ...formData,
              participants: [...formData.participants, ""],
            })
          }
        >
          Add Participant
        </Button>
      </div>

      <Button type="submit" className="w-full">
        Create Room
      </Button>
    </form>
  )
}
