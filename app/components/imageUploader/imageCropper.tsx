"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { backdropBackground } from "@/app/utils/stylingConstants"

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedBlob: Blob) => void
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ image, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }, [])

  useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && canvasRef.current) {
      const image = imgRef.current
      const canvas = canvasRef.current
      const crop = completedCrop
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        return
      }

      // Calculate pixel ratio for high DPI displays
      const pixelRatio = window.devicePixelRatio || 1
      
      // Calculate the source dimensions (taking into account the scale)
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      
      // Set canvas size to match the output dimensions
      canvas.width = crop.width * scaleX * pixelRatio
      canvas.height = crop.height * scaleY * pixelRatio
      
      // Scale the canvas according to the device pixel ratio
      ctx.scale(pixelRatio, pixelRatio)
      
      // Draw the cropped image
      const cropX = crop.x * scaleX
      const cropY = crop.y * scaleY
      const cropWidth = crop.width * scaleX
      const cropHeight = crop.height * scaleY
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Handle rotation if needed
      if (rotate > 0) {
        ctx.save()
        // Translate to center, rotate, and translate back
        const cropCenterX = cropWidth / 2
        const cropCenterY = cropHeight / 2
        
        ctx.translate(cropWidth / 2, cropHeight / 2)
        ctx.rotate((rotate * Math.PI) / 180)
        ctx.translate(-cropWidth / 2, -cropHeight / 2)
        
        // Draw the image
        ctx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        )
        
        ctx.restore()
      } else {
        // Draw without rotation
        ctx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        )
      }
      
      // Convert to blob
      canvas.toBlob(blob => {
        if (blob) {
          onCropComplete(blob)
        }
      }, 'image/jpeg', 0.95)
    }
  }, [completedCrop, onCropComplete, rotate])

  return (
    <Card className={`w-full ${backdropBackground} border-none shadow-lg rounded-lg text-white`}>
      <CardContent className="p-6 ${backdropBackground}">
        <div className="space-y-6">
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={false}
            >
              <img
                ref={imgRef}
                src={image || "/placeholder.svg"}
                alt="Upload"
                style={{
                  maxHeight: "400px",
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                }}
                onLoad={onImageLoad}
                className="max-w-full"
              />
            </ReactCrop>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="scale">Zoom</Label>
                <span className="text-sm text-white/70">{scale.toFixed(1)}x</span>
              </div>
              <Slider
                id="scale"
                min={0.5}
                max={2}
                step={0.1}
                value={[scale]}
                onValueChange={(value) => setScale(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rotate">Rotate</Label>
                <span className="text-sm text-white/70">{rotate}°</span>
              </div>
              <Slider
                id="rotate"
                min={0}
                max={360}
                step={1}
                value={[rotate]}
                onValueChange={(value) => setRotate(value[0])}
              />
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </CardContent>
    </Card>
  )
}

