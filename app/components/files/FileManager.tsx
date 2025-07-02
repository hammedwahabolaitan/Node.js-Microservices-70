"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Upload,
  Download,
  Trash2,
  Search,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  File,
  Plus,
  Share,
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
  uploadedBy: string
  isPublic: boolean
  downloadCount: number
  tags: string[]
}

interface UploadProgress {
  fileName: string
  progress: number
  status: "uploading" | "completed" | "error"
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (selectedFiles: FileList) => {
    const uploads: UploadProgress[] = Array.from(selectedFiles).map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploadProgress(uploads)

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const formData = new FormData()
      formData.append("file", file)

      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/files/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })

        if (response.ok) {
          setUploadProgress((prev) =>
            prev.map((upload, index) => (index === i ? { ...upload, progress: 100, status: "completed" } : upload)),
          )
        } else {
          setUploadProgress((prev) =>
            prev.map((upload, index) => (index === i ? { ...upload, status: "error" } : upload)),
          )
        }
      } catch (error) {
        setUploadProgress((prev) =>
          prev.map((upload, index) => (index === i ? { ...upload, status: "error" } : upload)),
        )
      }
    }

    // Clear upload progress after 3 seconds
    setTimeout(() => {
      setUploadProgress([])
      fetchFiles()
    }, 3000)
  }

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/files/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to download file:", error)
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchFiles()
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }

  const shareFile = async (fileId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/files/${fileId}/share`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        navigator.clipboard.writeText(data.shareUrl)
        // Show success message
      }
    } catch (error) {
      console.error("Failed to share file:", error)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-blue-600" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4 text-purple-600" />
    if (type.startsWith("audio/")) return <Music className="h-4 w-4 text-green-600" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-4 w-4 text-red-600" />
    if (type.includes("zip") || type.includes("rar")) return <Archive className="h-4 w-4 text-orange-600" />
    return <File className="h-4 w-4 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === "all" || file.type.startsWith(typeFilter)
    return matchesSearch && matchesType
  })

  const totalStorage = files.reduce((sum, file) => sum + file.size, 0)
  const storageLimit = 5 * 1024 * 1024 * 1024 // 5GB limit

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">File Management</h2>
          <p className="text-gray-600">Upload, organize, and share your files</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files)
              }
            }}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Create a new folder to organize your files</DialogDescription>
              </DialogHeader>
              <CreateFolderForm
                onSubmit={() => {
                  fetchFiles()
                  setShowUploadDialog(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadProgress.map((upload, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{upload.fileName}</span>
                    <span
                      className={
                        upload.status === "completed"
                          ? "text-green-600"
                          : upload.status === "error"
                            ? "text-red-600"
                            : "text-blue-600"
                      }
                    >
                      {upload.status === "completed"
                        ? "Completed"
                        : upload.status === "error"
                          ? "Error"
                          : `${upload.progress}%`}
                    </span>
                  </div>
                  <Progress value={upload.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-gray-600">Files uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Archive className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalStorage)}</div>
            <Progress value={(totalStorage / storageLimit) * 100} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">{formatFileSize(storageLimit - totalStorage)} remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.reduce((sum, file) => sum + file.downloadCount, 0)}</div>
            <p className="text-xs text-gray-600">Total downloads</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="application">Documents</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>Files ({filteredFiles.length})</CardTitle>
          <CardDescription>Your uploaded files and folders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{file.type.split("/")[0]}</Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(file.uploadedAt).toLocaleDateString()}</div>
                      <div className="text-gray-500">by {file.uploadedBy}</div>
                    </div>
                  </TableCell>
                  <TableCell>{file.downloadCount}</TableCell>
                  <TableCell>
                    <Badge variant={file.isPublic ? "default" : "secondary"}>
                      {file.isPublic ? "Public" : "Private"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => downloadFile(file.id, file.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => shareFile(file.id)}>
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No files found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CreateFolderForm({ onSubmit }: { onSubmit: () => void }) {
  const [folderName, setFolderName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/files/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: folderName }),
      })

      if (response.ok) {
        onSubmit()
      }
    } catch (error) {
      console.error("Failed to create folder:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Folder Name</label>
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Folder
      </Button>
    </form>
  )
}
