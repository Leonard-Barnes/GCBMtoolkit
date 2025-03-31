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

        for (let i = 0; i < data.length; i++) {
          const value = data[i];

          if (value === nodata) {
            // NoData pixels should be transparent
            imageData.data[i * 4] = 0;
            imageData.data[i * 4 + 1] = 0;
            imageData.data[i * 4 + 2] = 0;
            imageData.data[i * 4 + 3] = 0; // Fully transparent
          } else if (value === 0) {
            // Show 0 as white
            imageData.data[i * 4] = 255;
            imageData.data[i * 4 + 1] = 255;
            imageData.data[i * 4 + 2] = 255;
            imageData.data[i * 4 + 3] = 255; // Fully visible
          } else {
            // Show other values in grayscale
            const grayValue = value; // Adjust if necessary (scaling)
            imageData.data[i * 4] = grayValue;
            imageData.data[i * 4 + 1] = grayValue;
            imageData.data[i * 4 + 2] = grayValue;
            imageData.data[i * 4 + 3] = 255; // Fully visible
          }
        }

        ctx.putImageData(imageData, 0, 0);
        console.log("Successfully rendered TIFF:", filePath);
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
              maxWidth: "100%",
              border: "1px solid black",
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