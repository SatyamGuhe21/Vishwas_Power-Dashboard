"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void
  initialDataUrl?: string
  width?: number
  height?: number
  className?: string
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSave,
  initialDataUrl,
  width = 300,
  height = 100,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  const getCanvas = useCallback(() => canvasRef.current, [])
  const getContext = useCallback(() => getCanvas()?.getContext("2d"), [getCanvas])

  const clearCanvas = useCallback(() => {
    const canvas = getCanvas()
    const ctx = getContext()
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setIsEmpty(true)
      onSave("") // Clear saved signature data
    }
  }, [getCanvas, getContext, onSave])

  const saveSignature = useCallback(() => {
    const canvas = getCanvas()
    if (canvas) {
      onSave(canvas.toDataURL())
    }
  }, [getCanvas, onSave])

  useEffect(() => {
    const canvas = getCanvas()
    const ctx = getContext()

    if (canvas && ctx) {
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Set drawing properties
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.strokeStyle = "#000"

      // Load initial signature if provided
      if (initialDataUrl) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          setIsEmpty(false)
        }
        img.src = initialDataUrl
      } else {
        clearCanvas() // Ensure canvas is clear if no initial data
      }
    }
  }, [width, height, initialDataUrl, getCanvas, getContext, clearCanvas])

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = getCanvas()
      const ctx = getContext()
      if (!canvas || !ctx) return

      setIsDrawing(true)
      setIsEmpty(false)
      ctx.beginPath()
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      const rect = canvas.getBoundingClientRect()
      ctx.moveTo(clientX - rect.left, clientY - rect.top)
    },
    [getCanvas, getContext],
  )

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return
      const canvas = getCanvas()
      const ctx = getContext()
      if (!canvas || !ctx) return

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      const rect = canvas.getBoundingClientRect()
      ctx.lineTo(clientX - rect.left, clientY - rect.top)
      ctx.stroke()
    },
    [isDrawing, getCanvas, getContext],
  )

  const endDrawing = useCallback(() => {
    setIsDrawing(false)
    saveSignature()
  }, [saveSignature])

  return (
    <div className={`signature-canvas-container ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        style={{ border: "1px solid #ccc", touchAction: "none" }}
      />
      <div className="signature-actions" style={{ marginTop: "5px" }}>
        <button
          type="button"
          onClick={clearCanvas}
          disabled={isEmpty}
          style={{
            padding: "5px 10px",
            fontSize: "0.8rem",
            cursor: "pointer",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#f0f0f0",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default SignatureCanvas
