import React, { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import sticker1 from "./assets/sticker1.jpg";
import sticker2 from "./assets/sticker2.jpg";
import sticker3 from "./assets/sticker3.jpg";

const Sticker = ({ src, x, y, onDelete, onDragEnd }) => {
  const [image] = useImage(src);
  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      width={40}
      height={40}
      draggable
      onDblClick={onDelete}
      onDragEnd={(e) => onDragEnd(e)}
    />
  );
};

const App = () => {
  const stageRef = useRef();
  const [stickers, setStickers] = useState([]);
  const stickerSources = [sticker1, sticker2, sticker3];

  const addSticker = (src) => {
    setStickers([...stickers, { id: Date.now(), src, x: 60, y: 60 }]);
  };

  const snapToGrid = (pos) => ({
    x: Math.round(pos.x / 40) * 40,
    y: Math.round(pos.y / 40) * 40,
  });

  const handleDragEnd = (id, e) => {
    const pos = snapToGrid(e.target.position());
    setStickers(
      stickers.map((s) => (s.id === id ? { ...s, x: pos.x, y: pos.y } : s))
    );
  };

  const handleDelete = (id) => {
    setStickers(stickers.filter((s) => s.id !== id));
  };

  const handleDownload = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = uri;
    link.click();
  };

  return (
    <div className=" min-h-screen bg-gray-100 p-6 flex justify-center items-center gap-6">
      {/* Toolbar */}
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Stickers</h2>
        {stickerSources.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`sticker-${i}`}
            className="w-10 h-10 cursor-pointer hover:scale-110 transition"
            onClick={() => addSticker(src)}
          />
        ))}
      </div>

      {/* Canvas */}
      <div>
        <Stage
          width={600}
          height={400}
          ref={stageRef}
          className="bg-white border-2 border-gray-400 rounded"
        >
          <Layer>
            {stickers.map((s) => (
              <Sticker
                key={s.id}
                src={s.src}
                x={s.x}
                y={s.y}
                onDelete={() => handleDelete(s.id)}
                onDragEnd={(e) => handleDragEnd(s.id, e)}
              />
            ))}
          </Layer>
        </Stage>
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default App;
