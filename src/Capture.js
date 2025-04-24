import React, { useRef, useState, useEffect } from 'react';
import { saveImage, getImages } from './db';

function Capture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    loadImages();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera access denied', err);
      alert('Camera access denied or not available.');
    }
  };

  const capturePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !cameraReady) {
      alert('Camera not ready');
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Video dimensions are not available');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob && blob.size > 0) {
          let fileName = `photo-${Date.now()}.jpg`;
          let mimeType = blob.type || 'image/jpeg';
          let file= new File([blob],fileName, { type: mimeType });
          await saveImage(file);
          loadImages();
        } else {
          alert('Captured blob is empty.');
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const loadImages = async () => {
    const imgs = await getImages();
    setImages(imgs);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Capture Photo from Camera</h2>
      {!cameraReady && <p>Initializing camera...</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', maxWidth: 400, background: '#000' }}
      />
      <button
        onClick={capturePhoto}
        style={{ marginTop: 10 }}
        disabled={!cameraReady}
      >
        📸 Capture
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
        {images.map((img, idx) => {
          const url = URL.createObjectURL(img.blob);
          return (
            <img
              key={idx}
              src={url}
              alt="snapshot"
              style={{ height: 100, margin: 10 }}
              onLoad={() => URL.revokeObjectURL(url)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Capture;
