"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Check, Loader2 } from "lucide-react"
import ImageCropper from "./imageCropper"
import { backdropBackground } from "@/app/utils/stylingConstants"
import { updateCurrentUserProfilePic } from "./imageUploaderService"

export enum ImageUploadType {
    PROFILE,
    SHOW
}

interface ImageUploaderProps {
  path: string,
  uploadType: ImageUploadType
}

export default function ImageUploader({ path, uploadType }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setIsSuccess(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setIsSuccess(false)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleUpload = async () => {
    if (!croppedImage) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", croppedImage, "cropped-image.jpg")
      // Add path to form data instead of URL query parameter
      formData.append("path", path)

      const endpoint = `/api/imageUploader`
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        // Ensure credentials are included (although they should be by default for same-origin requests)
        credentials: 'same-origin',
      })

      if (response.status === 401) {
        console.error("Authentication required. Please log in.")
        alert("You must be logged in to upload images.")
        setIsUploading(false)
        return
      }

      const responseData = await response.json()
      if (response.status !== 200) {
        console.error("Error uploading image:", responseData.error)
        return
      }
      if (responseData.success) {
        console.log("Image uploaded successfully:", responseData);
        if (uploadType === ImageUploadType.PROFILE) {
          const saveResponse = await updateCurrentUserProfilePic(responseData.fileName);
            if (!saveResponse) {
                console.error("Error saving image URL to user profile");
                return;
            } 
            setIsSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`space-y-6 ${backdropBackground}`}>
      {!selectedImage ? (
        <Card>
          <CardContent className="p-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Upload an image</h3>
              <p className="text-sm text-gray-500 mb-4">Drag and drop or click to select a file</p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Select Image
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <ImageCropper image={selectedImage} onCropComplete={(croppedBlob) => setCroppedImage(croppedBlob)} />

          <div className="flex justify-between">
            <Button
              variant="outline"
              className={`bg-red-700 hover:bg-white hover:text-red-700 hover:border-red-700 text-white`}
              onClick={() => {
                setSelectedImage(null)
                setCroppedImage(null)
                setIsSuccess(false)
              }}
            >
              Cancel Editing Photo
            </Button>

            <Button 
                variant="outline"
                className={`${backdropBackground} hover:bg-white hover:text-black`}
                onClick={handleUpload} 
                disabled={!croppedImage || isUploading || isSuccess}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Uploaded. Refresh the page to see changes.
                </>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

