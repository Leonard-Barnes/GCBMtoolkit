import React from 'react'

export default function TopBar() {

    const handleClose=()=>{
        window.electron.ipcRenderer.send("close-window")
    }

    const handleMinimize=()=>{
        window.electron.ipcRenderer.send("minimize-window")
    }

  return (
    <div>
        <div className="rounded-t-xl bg-gray-700 w-screem h-8 shadow-md" style={{webkitAppRegion:"drag"}}></div>
        <div className="absolute top-0.5 left-2 text-white font-bold text-xl">GCBM Toolkit</div>
        <div id="control-buttons" className="text-stone-200 absolute top-1 right-0 pe-2">
            <button id="minimize-button" className="px-2 hover:text-white" style={{ webkitAppRegion: "no-drag" }} onClick={handleMinimize}>&#128469;</button>
            <button id="close-button" className="px-1 hover:text-white" style={{ webkitAppRegion: "no-drag" }} onClick={handleClose}>&#x2715;</button>
        </div>
    </div>
  )
}
