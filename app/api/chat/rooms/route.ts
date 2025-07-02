import { type NextRequest, NextResponse } from "next/server"

// Mock chat rooms data
const mockRooms = [
  {
    id: "room_1",
    name: "General Discussion",
    type: "group",
    participants: [
      { id: "user_1", name: "John Doe", email: "john@example.com", online: true },
      { id: "user_2", name: "Jane Smith", email: "jane@example.com", online: false },
    ],
    lastMessage: {
      content: "Hello everyone!",
      sender: "John Doe",
      timestamp: new Date().toISOString(),
    },
    unreadCount: 2,
  },
  {
    id: "room_2",
    name: "Support Chat",
    type: "direct",
    participants: [
      { id: "user_1", name: "John Doe", email: "john@example.com", online: true },
      { id: "support_1", name: "Support Agent", email: "support@example.com", online: true },
    ],
    lastMessage: {
      content: "How can I help you?",
      sender: "Support Agent",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    unreadCount: 0,
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ rooms: mockRooms })
  } catch (error) {
    console.error("Chat rooms fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch chat rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const roomData = await request.json()

    const newRoom = {
      id: "room_" + Date.now(),
      ...roomData,
      participants: [], // Would populate from user lookup
      unreadCount: 0,
    }

    return NextResponse.json({ room: newRoom }, { status: 201 })
  } catch (error) {
    console.error("Chat room creation error:", error)
    return NextResponse.json({ message: "Failed to create chat room" }, { status: 500 })
  }
}
