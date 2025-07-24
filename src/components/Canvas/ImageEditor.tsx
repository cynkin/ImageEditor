'use client'
import {useCallback, useEffect, useRef, useState} from "react";

type CropRect = {
    x: number;
    y: number;
    w: number;
    h: number;
}

export default function ImageEditor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef(null);
    const [settings, setSettings] = useState({
        brightness: 100,
        contrast: 100,
        blur: 0,
        opacity: 100,
        grayScale: 0,
        hueRotate: 0,
        invert: 0,
        sepia: 0,
        saturate: 100,
    });

    const [cropRect, setCropRect] = useState<CropRect>();
    const [isDragging, setIsDragging] = useState(false);
    const [start, setStart] = useState({ x: 0, y: 0 });
    const [end, setEnd] = useState({ x: 0, y: 0 });

    const resetSettings = () => {
        setSettings({
            brightness: 100,
            contrast: 100,
            blur: 0,
            opacity: 100,
            grayScale: 0,
            hueRotate: 0,
            invert: 0,
            sepia: 0,
            saturate: 100,
        });
    }

    const generateFilter = useCallback(() => {
        const brightness = settings.brightness;
        const contrast = settings.contrast;
        const blur = settings.blur;
        const grayScale = settings.grayScale;
        const hueRotate = settings.hueRotate;
        const invert = settings.invert;
        const sepia = settings.sepia;
        const saturate = settings.saturate;
        
        return `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) grayscale(${grayScale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) sepia(${sepia}%) saturate(${saturate}%)`;
    }, [settings.blur, settings.brightness, settings.contrast, settings.grayScale, settings.hueRotate, settings.invert, settings.saturate, settings.sepia])
    
    const renderImage = useCallback(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const c = canvas.getContext('2d');
        const image = imageRef.current;
        if(!image || !c) return;

        canvas.width = image.width;
        canvas.height = image.height;

        const filter = generateFilter();
        const opacity = settings.opacity;

        c.clearRect(0, 0, canvas.width, canvas.height);
        c.filter = filter + ` opacity(${opacity}%)`;
        c.drawImage(image, 0, 0);

    },[generateFilter, settings.opacity])

    const handleUpload = (e:any) =>{
        const image = new Image();
        image.src = URL.createObjectURL(e.target.files[0]);

        if(!image) return;

        image.onload = () => {
            imageRef.current = image;
            resetSettings();
            renderImage();
        }
    }

    const handleSave = () => {
        console.log("HELLO");
        const image = imageRef.current;
        if(!image) return;

        if(cropRect){
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = cropRect.w;
            tempCanvas.height = cropRect.h;
            const tempCtx = tempCanvas.getContext('2d');
            if(!tempCtx) return;

            tempCtx.filter = generateFilter();
            tempCtx.drawImage(image, cropRect.x, cropRect.y, cropRect.w, cropRect.h, 0, 0, cropRect.w, cropRect.h);
            const dataUrl = tempCanvas.toDataURL();
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'image.png';
            a.click();
            return;
        }

        const canvas = canvasRef.current;
        if(!canvas) return;

        const dataUrl = canvas.toDataURL();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'image.png';
        a.click();

    }

    const handleMouseDown = (e:any) => {
        console.log("HELLO");
        const canvas = canvasRef.current;
        if(!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStart({ x, y });
        setIsDragging(true);
    }

    const handleMouseMove = (e:any) => {
        if(!isDragging) return;

        const image = imageRef.current;
        if(!image) return;

        const canvas = canvasRef.current;
        if(!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setEnd({ x, y });

        const c = canvas.getContext('2d');
        if(!c) return;

        c.clearRect(0, 0, canvas.width, canvas.height);
        c.drawImage(image, 0, 0);


        c.fillStyle = "rgba(0, 0, 0, 0.5)";
        c.fillRect(0, 0, canvas.width, canvas.height);

        const w = x - start.x;
        const h = y - start.y;

        const cropX = Math.min(start.x, x);
        const cropY = Math.min(start.y, y);
        const cropW = Math.abs(x - start.x);
        const cropH = Math.abs(y - start.y);

        c.clearRect(cropX, cropY, cropW, cropH);
        c.drawImage(image, cropX, cropY, cropW, cropH, cropX, cropY, cropW, cropH);

        c.strokeStyle = "black";
        c.lineWidth = 1.5;
        c.strokeRect(start.x, start.y, w, h);

    }

    const handleMouseUp = () => {
        if(!isDragging) return;
        setIsDragging(false);

        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const w = Math.abs(end.x - start.x);
        const h = Math.abs(end.y - start.y);

        setCropRect({ x, y, w, h });
    }

    useEffect(() => {
        if (imageRef.current) renderImage();
    }, [renderImage, settings]);
    

    return (
        <div className="p-4 space-y-4 bg-gray-100 min-h-screen">

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
            />

            <div className="bg-white p-4 rounded-xl shadow">

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Brightness</label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={settings.brightness}
                            onChange={(e) => setSettings((prev) => ({...prev, brightness: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Contrast</label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={settings.contrast}
                            onChange={(e) => setSettings((prev) => ({...prev, contrast: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Blur</label>
                        <input
                            type="range"
                            min="0"
                            max="25"
                            value={settings.blur}
                            onChange={(e) => setSettings((prev) => ({...prev, blur: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Opacity</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.opacity}
                            onChange={(e) => setSettings((prev) => ({...prev, opacity: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">GrayScale</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.grayScale}
                            onChange={(e) => setSettings((prev) => ({...prev, grayScale: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Hue Rotate</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.hueRotate}
                            onChange={(e) => setSettings((prev) => ({...prev, hueRotate: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Invert</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.invert}
                            onChange={(e) => setSettings((prev) => ({...prev, invert: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Saturate</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.saturate}
                            onChange={(e) => setSettings((prev) => ({...prev, saturate: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Sepia</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.sepia}
                            onChange={(e) => setSettings((prev) => ({...prev, sepia: Number(e.target.value)}))}
                            className="range-input"
                        />
                    </div>
                </div>

                <div className="flex mt-10 justify-end items-center gap-4">
                    <button className="ml-auto cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={resetSettings}>
                        RESET
                    </button>
                    <button className="ml-auto cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleSave}>
                        SAVE
                    </button>
                </div>
            </div>

            <div className="relative p-4 flex justify-center bg-white rounded-xl shadow overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className=""
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
            </div>
        </div>
    );
}