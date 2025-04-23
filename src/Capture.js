import React, { useRef, useState, useEffect } from 'react'
import { saveImage, getImages } from './db'

function Capture() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    startCamera()
    loadImages()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      console.error('Camera access denied', err)
    }
  }

  const capturePhoto = async () => {
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(async (blob) => {
        if (blob) {
          await saveImage(blob)
          loadImages()
        }
      }, 'image/jpeg', 0.95)
    }
  }

  const loadImages = async () => {
    const imgs = await getImages()
    setImages(imgs)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Capture Photo from Camera</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 400 }} />
      <button onClick={capturePhoto} style={{ marginTop: 10 }}>📸 Capture</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
        {images.map((img, idx) => {
          const url = URL.createObjectURL(img.blob)
          return (
            <img
              key={idx}
              src={url}
              alt="snapshot"
              style={{ height: 100, margin: 10 }}
              onLoad={() => URL.revokeObjectURL(url)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Capture;
