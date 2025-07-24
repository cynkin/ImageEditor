'use client'
import {useSearchParams} from "next/navigation";
import React, {useEffect, useRef, useState} from "react";

export default function WhiteBoard() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ctxRef.current = canvas.getContext('2d');
        const ctx = ctxRef.current;
        if (!ctx) return;

        const generate = ()=>{
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const handleResize = () => {
            canvas.width = window.innerWidth - 30;
            canvas.height = window.innerHeight - 140;
            generate();
        };

        window.addEventListener('resize', handleResize)

        handleResize();

        return ()=>{
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas || !ctxRef.current) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !ctxRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctxRef.current.lineTo(x, y);
        ctxRef.current.strokeStyle = "white";
        ctxRef.current.lineWidth = 3;
        ctxRef.current.stroke();
    };

    const stopDrawing = () => {
        ctxRef.current?.closePath();
        setIsDrawing(false);
    };

    return(
        <div>
            <div>{code}</div>
            <canvas
                ref={canvasRef}
                className="fixed  "
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
            />
        </div>
    )
}