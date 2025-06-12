// SignatureCanvas.js
import React, { useRef, useState, useEffect } from "react";
import "./SignatureCanvas.css"; // You might want a separate CSS file for the canvas
import { useLanguage } from "../../LanguageContext";

const SignatureCanvas = ({ onSave, onClear, width = 500, height = 150 }) => {
    const { translate: t } = useLanguage();

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
    }, []);

    const startDrawing = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsDrawing(true);
        setHasDrawn(false); // Reset hasDrawn when starting a new drawing
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
        setHasDrawn(true);
    };

    const endDrawing = () => {
        setIsDrawing(false);
        if (hasDrawn) {
            onSave(canvasRef.current.toDataURL());
        } else {
            onSave(null); // If no drawing, pass null
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        onClear(); // Notify parent that canvas is cleared
        onSave(null); // Also clear the signature data in parent
    };

    return (
        <div className="signature-pad">
            <canvas
                ref={canvasRef}
                className="signature-canvas"
                width={width}
                height={height}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
            />
            <button type="button" className="clear-btn" onClick={clearCanvas}>
                <i className="fas fa-eraser">{t('clearSignature')}</i>
            </button>
        </div>
    );
};

export default SignatureCanvas;