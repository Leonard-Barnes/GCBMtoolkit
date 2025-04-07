import React, { useEffect, useRef, useState } from "react";
import * as GeoTIFF from "geotiff";
import { Play, Pause } from "lucide-react";

const TiffViewer = ({ files }) => {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [rasterData, setRasterData] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [clickedValue, setClickedValue] = useState(null);
  const [clickedCoords, setClickedCoords] = useState(null); // ← new state

  useEffect(() => {
    console.log("TiffViewer mounted with files:", files);

    const loadTiff = async (filePath) => {
      try {
        console.log("Loading TIFF:", filePath);
        const buffer = await window.electron.ipcRenderer.invoke("get-tiff-file", filePath);

        if (buffer.error) {
          console.error("Error fetching TIFF file:", buffer.error);
          setError(buffer.error);
          return;
        }

        const tiff = await GeoTIFF.fromArrayBuffer(buffer);
        const image = await tiff.getImage();
        console.log("TIFF Metadata:", {
          width: image.getWidth(),
          height: image.getHeight(),
          samplesPerPixel: image.getSamplesPerPixel(),
          compression: image.fileDirectory.Compression,
        });

        const width = image.getWidth();
        const height = image.getHeight();
        setImageWidth(width);
        setImageHeight(height);

        const raster = await image.readRasters();
        const data = raster[0];
        setRasterData(data);

        console.log("First 100 raster values:", data.slice(0, 100));

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        const imageData = ctx.createImageData(width, height);

        const nodata = image.getGDALNoData() ?? -9999;
        console.log("NoData Value:", nodata);

        const min = Math.min(...data.filter((v) => v !== nodata));
const max = Math.max(...data.filter((v) => v !== nodata));

for (let i = 0; i < data.length; i++) {
  const value = data[i];

  if (value === nodata) {
    imageData.data[i * 4] = 0;
    imageData.data[i * 4 + 1] = 0;
    imageData.data[i * 4 + 2] = 0;
    imageData.data[i * 4 + 3] = 0;
  } else {
    // Normalize value to [0, 1]
    const normalized = (value - min) / (max - min);

    // Blue to red gradient
    const r = Math.floor(255 * normalized);
    const g = Math.floor(255 * (1 - normalized));
    const b = Math.floor(255 * (0.5 - Math.abs(normalized - 0.5)) * 2); // peak green at mid values
    imageData.data[i * 4] = r;
    imageData.data[i * 4 + 1] = g;
    imageData.data[i * 4 + 2] = b;
    imageData.data[i * 4 + 3] = 255;
  }
}

        ctx.putImageData(imageData, 0, 0);
        console.log("Successfully rendered TIFF:", filePath);

        // ⬇️ Recalculate clicked value from saved coords
        if (clickedCoords) {
          const { x, y } = clickedCoords;
          const index = y * width + x;
          const value = data[index];
          if (value <= -1000) {
            setClickedValue(`Value at (${x}, ${y}): No Data`);
          } else {
            setClickedValue(`Value at (${x}, ${y}): ${value.toFixed(2)}`);
          }
        }

      } catch (err) {
        console.error("Error loading TIFF:", err);
        setError("Failed to load TIFF file.");
      }
    };

    if (files.length > 0 && currentFileIndex < files.length) {
      loadTiff(files[currentFileIndex]);
    }
  }, [files, currentFileIndex]);

  const playAnimation = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    console.log("Starting animation");
    const id = setInterval(() => {
      setCurrentFileIndex((prevIndex) => (prevIndex + 1) % files.length);
    }, 1000);
    setIntervalId(id);
    setAnimationPlaying(true);
  };

  const pauseAnimation = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    console.log("Pausing animation");
    setAnimationPlaying(false);
  };

  const handleCanvasClick = (event) => {
    if (!rasterData) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * imageWidth);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * imageHeight);

    const index = y * imageWidth + x;
    const value = rasterData[index];

    setClickedCoords({ x, y }); // ← track last clicked coords

    if (value <= -1000) {
      setClickedValue(`Value at (${x}, ${y}): No Data`);
    } else {
      setClickedValue(`Value at (${x}, ${y}): ${value.toFixed(2)}`);
    }
    console.log(`Clicked at (${x}, ${y}) -> Value: ${value}`);
  };

  return (
    <div>
      {error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {console.log("Rendering TIFF Viewer with files:", files)}
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
              minwidth: "800px",
              Width: "100",
              backgroundColor: "transparent",
              cursor: "crosshair",
            }}
          />
          <div className="flex justify-center items-center mt-2 space-x-4 border-t pt-2 w-full max-w-[400px]">
            <p className="text-gray-700">{clickedValue || "Click on the image"}</p>
            <button
              onClick={animationPlaying ? pauseAnimation : playAnimation}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center"
            >
              {animationPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiffViewer;
