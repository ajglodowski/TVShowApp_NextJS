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
        width: 90,
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
      // This is to get a blob from the crop
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height

      canvasRef.current.width = completedCrop.width * scaleX
      canvasRef.current.height = completedCrop.height * scaleY

      ctx.scale(scaleX, scaleY)
      ctx.translate(-completedCrop.x, -completedCrop.y)

      if (rotate) {
        ctx.translate(imgRef.current.width / 2, imgRef.current.height / 2)
        ctx.rotate((rotate * Math.PI) / 180)
        ctx.translate(-imgRef.current.width / 2, -imgRef.current.height / 2)
      }

      ctx.drawImage(
        imgRef.current,
        0,
        0,
        imgRef.current.width,
        imgRef.current.height,
        0,
        0,
        imgRef.current.width,
        imgRef.current.height,
      )

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob)
        }
      }, "image/jpeg")
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

