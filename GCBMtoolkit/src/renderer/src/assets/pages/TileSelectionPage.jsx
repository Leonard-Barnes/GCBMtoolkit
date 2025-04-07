import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import canadaMap from '../Map.png'

// Example tile positions (adjust based on real data)
const tileData = [
  { id: 943, x: 80, y: 25 },
  { id: 944, x: 95.9, y: 25 },
  //seconds row
  { id: 903, x: 65, y: 40 },
  { id: 904, x: 80, y: 40 },
  { id: 905, x: 95.9, y: 40},
  { id: 906, x: 110.9, y: 40},
  //third row
  { id: 863, x: 50, y: 55},
  { id: 864, x: 65, y: 55 },
  { id: 865, x: 80, y: 55 },
  { id: 866, x: 95.9, y: 55},
  { id: 867, x: 110.9, y: 55},
  { id: 868, x: 125.9, y: 55},
  //forth row
  { id: 823, x: 35, y: 70},
  { id: 824, x: 50, y: 70},
  { id: 825, x: 65, y: 70 },
  { id: 826, x: 80, y: 70 },
  { id: 827, x: 95.9, y: 70},
  { id: 828, x: 110.9, y: 70},
  { id: 829, x: 125.9, y: 70},
  //fifth row
  { id: 783, x: 19.5, y: 85.5},
  { id: 784, x: 35, y: 85.5},
  { id: 785, x: 50, y: 85.5},
  { id: 786, x: 65, y: 85.5},
  { id: 787, x: 80, y: 85.5},
  { id: 788, x: 95.5, y: 85.5},
  { id: 789, x: 110.5, y: 85.5},
  { id: 790, x: 126, y: 85.5},
  { id: 791, x: 141, y: 85.5},
  { id: 792, x: 156, y: 85.5},
  //sixth row
  { id: 744, x: 19.5, y: 100.5},
  { id: 745, x: 35, y: 100.5},
  { id: 746, x: 50, y: 100.5},
  { id: 747, x: 65.5, y: 100.5},
  { id: 748, x: 80.5, y: 100.5},
  { id: 749, x: 95.5, y: 100.5},
  { id: 750, x: 111, y: 100.5},
  { id: 751, x: 126, y: 100.5},
  { id: 752, x: 141, y: 100.5},
  { id: 753, x: 156, y: 100.5},
  { id: 754, x: 171.5, y: 100.5},
  //7th row
  { id: 705, x: 19.5, y: 115.5},
  { id: 706, x: 35, y: 115},
  { id: 707, x: 50, y: 115},
  { id: 708, x: 65, y: 115},
  { id: 709, x: 80.5, y: 115},
  { id: 710, x: 95.5, y: 115},
  { id: 711, x: 110.5, y: 115},
  { id: 712, x: 126, y: 115},
  { id: 713, x: 141, y: 115},
  { id: 714, x: 156, y: 115},
  { id: 715, x: 171.5, y: 115},
  //8th row
  { id: 667, x: 35, y: 130},
  { id: 668, x: 50, y: 130},
  { id: 669, x: 65, y: 130},
  { id: 670, x: 80, y: 130},
  { id: 671, x: 95.5, y: 130},
  { id: 672, x: 110.5, y: 130},
  { id: 673, x: 126, y: 130},
  { id: 674, x: 141, y: 130},
  { id: 675, x: 156, y: 130},
  { id: 676, x: 171.5, y: 130},
  { id: 677, x: 186.5, y: 130},
  { id: 678, x: 201.5, y: 130},
  { id: 679,x: 216.5, y: 130},
  //9th row
  { id: 628, x: 35, y: 145},
  { id: 629, x: 50, y: 145},
  { id: 630, x: 65, y: 145},
  { id: 631, x: 80, y: 145},
  { id: 632, x: 95.5, y: 145},
  { id: 633, x: 110.5, y: 145},
  { id: 634, x: 126, y: 145},
  { id: 635, x: 141, y: 145},
  { id: 636, x: 156, y: 145},
  { id: 637, x: 171.5, y: 145},
  { id: 638, x: 186.5, y: 145},
  { id: 639, x: 201.5, y: 145},
  { id: 640, x: 216.5, y: 145},
  //10th row
  { id: 589, x: 35, y: 160},
  { id: 590, x: 50, y: 160},
  { id: 591, x: 65, y: 160},
  { id: 592, x: 80, y: 160},
  { id: 593, x: 95.5, y: 160},
  { id: 594, x: 110.5, y: 160},
  { id: 595, x: 126, y: 160},
  { id: 596, x: 141, y: 160},
  { id: 597, x: 156, y: 160},
  { id: 598, x: 171.5, y: 160},
  { id: 599, x: 186.5, y: 160},
  { id: 600, x: 201.5, y: 160},
  { id: 601, x: 216.1, y: 160},
  { id: 602, x: 231.5, y: 160},
  { id: 603, x: 247, y: 160},
  { id: 612, x: 382, y: 160},
  { id: 614, x: 412, y: 160},
  { id: 615, x: 427, y: 160},
  { id: 616, x: 442, y: 160},
  //11th row
  { id: 549, x: 20, y: 175},
  { id: 550, x: 35, y: 175},
  { id: 551, x: 50, y: 175},
  { id: 552, x: 65, y: 175},
  { id: 553, x: 80, y: 175},
  { id: 554, x: 95.5, y: 175},
  { id: 555, x: 110.5, y: 175},
  { id: 556, x: 126, y: 175},
  { id: 557, x: 141, y: 175},
  { id: 558, x: 156, y: 175},
  { id: 559, x: 171.5, y: 175},
  { id: 560, x: 186.5, y: 175},
  { id: 561, x: 201.5, y: 175},
  { id: 562, x: 216.5, y: 175},
  { id: 563, x: 231.5, y: 175},
  { id: 564, x: 246.5, y: 175},
  { id: 572, x: 367, y: 175},
  { id: 573, x: 382, y: 175},
  { id: 574, x: 397, y: 175},
  { id: 575, x: 412, y: 175},
  { id: 576, x: 427, y: 175},
  { id: 577, x: 442, y: 175},
  { id: 578, x: 457, y: 175},
  { id: 579, x: 472, y: 175},
  { id: 580, x: 487, y: 175},
  //12th row
  { id: 510, x: 20, y: 190},
  { id: 511, x: 35, y: 190},
  { id: 512, x: 50, y: 190},
  { id: 513, x: 65, y: 190},
  { id: 514, x: 80, y: 190},
  { id: 515, x: 95.5, y: 190},
  { id: 516, x: 110.5, y: 190},
  { id: 517, x: 126, y: 190},
  { id: 518, x: 141, y: 190},
  { id: 519, x: 156, y: 190},
  { id: 520, x: 171.5, y: 190},
  { id: 521, x: 186.5, y: 190},
  { id: 522, x: 201.5, y: 190},
  { id: 523, x: 216.5, y: 190},
  { id: 524, x: 231.5, y: 190},
  { id: 525, x: 246.5, y: 190},
  { id: 532, x: 352, y: 190},
  { id: 533, x: 367, y: 190},
  { id: 534, x: 382, y: 190},
  { id: 535, x: 397, y: 190},
  { id: 536, x: 412, y: 190},
  { id: 537, x: 427, y: 190},
  { id: 538, x: 442, y: 190},
  {id: 539, x: 457, y: 190},
  {id: 540, x: 472, y: 190},
  {id: 541, x: 487, y: 190},
  {id: 542, x: 502, y: 190},
  //13th row
  { id: 471, x: 20, y: 205},
  { id: 472, x: 35, y: 205},
  { id: 473, x: 50, y: 205},
  { id: 474, x: 65, y: 205},
  { id: 475, x: 80, y: 205},
  { id: 476, x: 95.5, y: 205},
  { id: 477, x: 110.5, y: 205},
  { id: 478, x: 126, y: 205},
  { id: 479, x: 141, y: 205},
  { id: 480, x: 156, y: 205},
  { id: 481, x: 171.5, y: 205},
  { id: 482, x: 186.5, y: 205},
  { id: 483, x: 201.5, y: 205},
  { id: 484, x: 216.5, y: 205},
  { id: 485, x: 231.6, y: 205},
  { id: 486, x: 246.5, y: 205},
  { id: 487, x: 262, y: 205},
  { id: 493, x: 352, y: 205},
  { id: 494, x: 367, y: 205},
  { id: 495, x: 382, y: 205},
  { id: 496, x: 397, y: 205},
  { id: 497, x: 412, y: 205},
  { id: 498, x: 427, y: 205},
  { id: 499, x: 442, y: 205},
  {id: 500, x: 457, y: 205},
  {id: 501, x: 472, y: 205},
  {id: 502, x: 487, y: 205},
  {id: 503, x: 502, y: 205},
  {id: 504, x: 517, y: 205},
  {id: 505, x: 532, y: 205},
  //14th row
  { id: 432, x: 20, y: 220},
  { id: 433, x: 35, y: 220},
  { id: 434, x: 50, y: 220},
  { id: 435, x: 65, y: 220},
  { id: 436, x: 80, y: 220},
  { id: 437, x: 95.5, y: 220},
  { id: 438, x: 110.5, y: 220},
  { id: 439, x: 126, y: 220},
  { id: 440, x: 141, y: 220},
  { id: 441, x: 156, y: 220},
  { id: 442, x: 171.5, y: 220},
  { id: 443, x: 186.5, y: 220},
  { id: 444, x: 201.5, y: 220},
  { id: 445, x: 216.5, y: 220},
  { id: 446, x: 231.5, y: 220},
  { id: 447, x: 247, y: 220},
  { id: 448, x: 262, y: 220},
  { id: 449, x: 277, y: 220},
  { id: 450, x: 292, y: 220},
  { id: 454, x: 352, y: 220},
  { id: 455, x: 367, y: 220},
  { id: 456, x: 382, y: 220},
  { id: 457, x: 397, y: 220},
  { id: 458, x: 412, y: 220},
  { id: 459, x: 427, y: 220},
  { id: 460, x: 442, y: 220},
  {id: 461, x: 457, y: 220},
  {id: 462, x: 472, y: 220},
  {id: 463, x: 487, y: 220},
  {id: 464, x: 502, y: 220},
  {id: 465, x: 517, y: 220},
  {id: 466, x: 532, y: 220},
  {id: 467, x: 547.5, y: 220},
  //15th row
  { id: 393, x:20, y: 235},
  { id: 394, x: 35, y: 235},
  { id: 395, x: 50, y: 235},
  { id: 396, x: 65, y: 235},
  { id: 397, x: 80, y: 235},
  { id: 398, x: 95.5, y: 235},
  { id: 399, x: 110.5, y: 235},
  { id: 400, x: 126, y: 235},
  { id: 401, x: 141, y: 235},
  { id: 402, x: 156, y: 235},
  { id: 403, x: 171.5, y: 235},
  { id: 404, x: 186.5, y: 235},
  { id: 405, x: 201.5, y: 235},
  { id: 406, x: 216.5, y: 235},
  { id: 407, x: 231.5, y: 235},
  { id: 408, x: 246.5, y: 235},
  { id: 409, x: 262, y: 235},
  { id: 410, x: 277, y: 235},
  { id: 411, x: 292, y: 235},
  { id: 412, x: 307, y: 235},
  { id: 413, x: 322, y: 235},
  { id: 414, x: 337, y: 235},
  { id: 415, x: 352, y: 235},
  { id: 416, x: 367, y: 235},
  { id: 417, x: 382, y: 235},
  { id: 418, x: 397, y: 235},
  { id: 419, x: 412, y: 235},
  { id: 420, x: 427, y: 235},
  { id: 421, x: 442, y: 235},
  {id: 422, x: 457, y: 235},
  {id: 423, x: 472, y: 235},
  {id: 424, x: 487, y: 235},
  {id: 425, x: 502, y: 235},
  {id: 426, x: 517, y: 235},
  {id: 427, x: 532, y: 235},
  {id: 428, x: 547.5, y: 235},
  //16th row
  { id: 355, x: 35, y: 250},
  { id: 356, x: 50, y: 250},
  { id: 357, x: 65, y: 250},
  { id: 358,x: 80, y: 250},
  { id: 359, x: 95.5, y: 250},
  { id: 360,  x: 110.5, y: 250},
  { id: 361, x: 126, y: 250},
  { id: 362, x: 141, y: 250},
  { id: 363, x: 156, y: 250},
  { id: 364, x: 171.5, y: 250},
  { id: 365, x: 186.5, y: 250},
  { id: 366, x: 201.5, y: 250},
  { id: 367, x: 216.5, y: 250},
  { id: 368, x: 231.5, y: 250},
  { id: 369, x: 246.5, y: 250},
  { id: 370, x: 262, y: 250},
  { id: 371, x: 277, y: 250},
  { id: 372, x: 292, y: 250},
  { id: 373, x: 307, y: 250},
  { id: 374, x: 322, y: 250},
  { id: 375, x: 337, y: 250},
  { id: 376, x: 352, y: 250},
  { id: 377, x: 367, y: 250},
  { id: 378, x: 382, y: 250},
  { id: 379, x: 397, y: 250},
  { id: 380, x: 412, y: 250},
  { id: 381, x: 427, y: 250},
  { id: 382, x: 442, y: 250},
  {id: 383, x: 457, y: 250},
  {id: 384, x: 472, y: 250},
  {id: 385, x: 487, y: 250},
  {id: 386, x: 502, y: 250},
  {id: 387, x: 517, y: 250},
  //17th row
  { id: 316, x: 35, y: 265.5},
  { id: 317, x: 50, y: 265.5},
  { id: 318, x: 65, y: 265.5},
  { id: 319, x: 80, y: 265.5},
  { id: 320, x: 95.5, y: 265.5},
  { id: 321, x: 110.5, y: 265.5},
  { id: 325, x: 171.5, y: 265.5},
  { id: 326, x: 186.5, y: 265.5},
  { id: 327, x: 201.5, y: 265.5},
  { id: 328, x: 216.5, y: 265.5},
  { id: 329, x: 231.5, y: 265.5},
  { id: 330, x: 247, y: 265.5},
  { id: 331, x: 262, y: 265.5},
  { id: 332, x: 277, y: 265.5},
  { id: 333, x: 292, y: 265.5},
  { id: 334, x: 307, y: 265.5},
  { id: 335, x: 322, y: 265.5},
  { id: 336, x: 337, y: 265.5},
  { id: 337, x: 352, y: 265.5},
  { id: 338, x: 367, y: 265.5},
  { id: 339, x: 382, y: 265.5},
  { id: 340, x: 397, y: 265.5},
  { id: 341, x: 412, y: 265.5},
  { id: 342, x: 427, y: 265.5},
  { id: 343, x: 442, y: 265.5},
  { id: 344, x: 457, y: 265.5},
  { id: 345, x: 472, y: 265.5},
  { id: 346, x: 487, y: 265.5},
  { id: 347, x: 502, y: 265.5},
  { id: 348, x: 517, y: 265.5},
  //18th row
  { id: 279, x: 65, y: 280.5},
  { id: 280, x: 80, y: 280.5},
  { id: 281, x: 95.5, y: 280.5},
  { id: 282, x: 110.5, y: 280.5},
  { id: 288, x: 201.5, y: 280.5},
  { id: 289, x: 216.5, y: 280.5},
  { id: 290, x: 231.5, y: 280.5},
  { id: 291, x: 247, y: 280.5},
  { id: 292, x: 262, y: 280.5},
  { id: 293, x: 277, y: 280.5},
  { id: 294, x: 292, y: 280.5},
  { id: 295, x: 307, y: 280.5},
  { id: 296, x: 322, y: 280.5},
  { id: 297, x: 337, y: 280.5},
  { id: 298, x: 352, y: 280.5},
  { id: 299, x: 367, y: 280.5},
  { id: 300, x: 382, y: 280.5},
  { id: 301, x: 397, y: 280.5},
  { id: 302, x: 412, y: 280.5},
  { id: 303, x: 427, y: 280.5},
  { id: 304, x: 442, y: 280.5},
  { id: 305, x: 457, y: 280.5},
  { id: 306, x: 472, y: 280.5},
  { id: 307, x: 487, y: 280.5},
  { id: 308, x: 502, y: 280.5},
  { id: 309, x: 517, y: 280.5},
  { id: 310, x: 532, y: 280.5},
  //19th row
  { id: 243, x: 110.5, y: 296},
  { id: 250, x: 216.5, y: 296},
  { id: 251, x: 231.6, y: 296},
  { id: 252, x: 246.5, y: 296},
  { id: 253, x: 262, y: 296},
  { id: 254, x: 277, y: 296},
  { id: 255, x: 292, y: 296},
  { id: 256, x: 307, y: 296},
  { id: 257, x: 322, y: 296},
  { id: 258, x: 337, y: 296},
  { id: 259, x: 352, y: 296},
  { id: 260, x: 367, y: 296},
  { id: 261, x: 382, y: 296},
  { id: 262, x: 397, y: 296},
  { id: 263, x: 412, y: 296},
  { id: 264, x: 427, y: 296},
  { id: 265, x: 442, y: 296},
  { id: 266, x: 457, y: 296},
  { id: 267, x: 472, y: 296},
  { id: 268, x: 487, y: 296},
  { id: 269, x: 502, y: 296},
  { id: 270, x: 517, y: 296},
  //20th row
  { id: 212, x: 231.5, y: 311},
  { id: 213, x: 247, y: 311},
  { id: 214, x: 262, y: 311},
  { id: 215, x: 277, y: 311},
  { id: 216, x: 292, y: 311},
  { id: 217, x: 307, y: 311},
  { id: 218, x: 322, y: 311},
  { id: 219, x: 337, y: 311},
  { id: 220, x: 352, y: 311},
  { id: 221, x: 367, y: 311},
  { id: 222, x: 382, y: 311},
  { id: 223, x: 397, y: 311},
  { id: 224, x: 412, y: 311},
  { id: 225, x: 427, y: 311},
  { id: 226, x: 442, y: 311},
  { id: 227, x: 457, y: 311},
  { id: 228, x: 472, y: 311},
  { id: 229, x: 487, y: 311},
  //21th row
  { id: 179, x: 322, y: 326},
  { id: 180, x: 337, y: 326},
  { id: 181, x: 352, y: 326},
  { id: 182, x: 367, y: 326},
  { id: 183, x: 382, y: 326},
  { id: 184, x: 397, y: 326},
  { id: 185, x: 412, y: 326},
  { id: 186, x: 427, y: 326},
  { id: 187, x: 442, y: 326},
  //22th row
  { id: 143, x: 367, y: 341.5},
  { id: 144, x: 382, y: 341.5},
  { id: 145, x: 397, y: 341.5},
  // Add all tiles manually to form the shape of Canada
];

function TileSelectionPage() {
  const [selectedTiles, setSelectedTiles] = useState([]);

  const toggleTileSelection = (id) => {
    setSelectedTiles((prevSelectedTiles) => {
      if (prevSelectedTiles.includes(id)) {
        return prevSelectedTiles.filter((tileId) => tileId !== id);
      } else {
        return [...prevSelectedTiles, id];
      }
    });
  };

  const selectAllTiles = () => {
    setSelectedTiles(tileData.map((tile) => tile.id));
    saveSelection(tileData.map((tile) => tile.id));
  };

  const clearAllTiles = () => {
    setSelectedTiles([]); // Clears all selections
    saveSelection([]); // Saves the empty selection
  };

  const saveSelection = async (tiles) => {
    try {
      await window.electron.ipcRenderer.invoke("save-selected-tiles", tiles);
      console.log("Tile selection saved:", tiles);
    } catch (error) {
      console.error("Error saving tile selection:", error);
    }
  };

  const handleSubmit = async () => {
    if (selectedTiles.length > 0) {
      await saveSelection(selectedTiles);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Header */}
      <div className="hero bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-8 w-full text-center rounded-lg">
        <h1 className="text-3xl font-bold">Tile Selection</h1>
        <p className="text-lg">Select tiles corresponding to the TIFF data.</p>
      </div>

      {/* Tile Selection Area */}
      <div className="relative mt-6 border border-gray-300 shadow-lg rounded-lg overflow-hidden bg-white w-full h-[380px]">
        <img src={canadaMap} alt="Logo" className="w-[570px] pt-8 pl-4 opacity-100" />
        {tileData.map((tile) => (
          <div
            key={tile.id}
            className={`absolute w-4 h-4 border border-opacity-10 cursor-pointer transition-all opacity-50 duration-200 ${
              selectedTiles.includes(tile.id)
                ? "bg-blue-600 border-blue-700 opacity-70"
                : "bg-gray-200 border-gray-800 hover:bg-gray-600"
            }`}
            style={{ top: tile.y, left: tile.x }}
            onClick={() => toggleTileSelection(tile.id)}
          ></div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-5">
        <button
          onClick={selectAllTiles}
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
        >
          Select All
        </button>
        <button
          onClick={clearAllTiles}
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
        >
          Clear
        </button>
        <NavLink to={selectedTiles.length > 0 ? "/Simulation/Setup" : "#"}>
          <button
            onClick={handleSubmit}
            disabled={selectedTiles.length === 0}
            className={`px-4 py-2 rounded-md shadow-md ${
              selectedTiles.length > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default TileSelectionPage;
