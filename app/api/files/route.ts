import { type NextRequest, NextResponse } from "next/server"

// Mock files data
const mockFiles = [
  {
    id: "file_1",
    name: "document.pdf",
    type: "application/pdf",
    size: 1024000,
    url: "/api/files/file_1/download",
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    uploadedBy: "John Doe",
    isPublic: false,
    downloadCount: 5,
    tags: ["document", "important"],
  },
  {
    id: "file_2",
    name: "image.jpg",
    type: "image/jpeg",
    size: 512000,
    url: "/api/files/file_2/download",
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    uploadedBy: "Jane Smith",
    isPublic: true,
    downloadCount: 12,
    tags: ["image", "profile"],
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ files: mockFiles })
  } catch (error) {
    console.error("Files fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch files" }, { status: 500 })
  }
}
