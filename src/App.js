import React, { useState, useEffect } from 'react';
import { saveImage, getImages } from './db';

function App() {
  const [images, setImages] = useState([]);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    for (let file of files) {
      if (file.type.startsWith('image/')) {
        await saveImage(file);
      }
    }
    loadImages();
  };

  const loadImages = async () => {
    const imgs = await getImages();
    setImages(imgs);
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Offline Image PWA</h1>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
        {images.map((img, idx) => {
          const url = URL.createObjectURL(img.blob);
          return (
            <img
              key={idx}
              src={url}
              alt="offline"
              style={{ height: 100, margin: 10 }}
              onLoad={() => URL.revokeObjectURL(url)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
