"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const PALETTE_COLORS = [
  "#FF9D14",
  "#ED7D2B",
  "#FADE69",
  "#E2B91A",
  "#71CE7E",
  "#336B3B",
  "#D8B9FF",
  "#7A1EB1",
  "#51321A",
  "#1C1B1B",
];

interface TextBox {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface EbookCanvasProps {
  isActive: boolean;
  onCloseTool: () => void;
  pageId: string | number;
}

export default function EbookCanvas({ isActive, onCloseTool, pageId }: EbookCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const [activeTool, setActiveTool] = useState<"brush" | "text" | "highlighter" | "pen" | "eraser">("brush");
  const [color, setColor] = useState("#71CE7E");
  const [lineWidth, setLineWidth] = useState(14);
  const [mode, setMode] = useState<"draw" | "eraser">("draw");

  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(4);

  const modeRef = useRef(mode);
  const colorRef = useRef(color);
  const widthRef = useRef(lineWidth);

  const canvasStorageKey = `ebook_canvas_data_page_${pageId}`;
  const textStorageKey = `ebook_text_boxes_page_${pageId}`;

  useEffect(() => {
    modeRef.current = mode;
    colorRef.current = color;
    widthRef.current = lineWidth;
  }, [mode, color, lineWidth]);

  // Load drawings and text specific to current pageId
  const loadPageContent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Force clear canvas pixels completely
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 2. Clear current text box state
    setTextBoxes([]);

    // 3. Restore text boxes for THIS specific pageId
    const savedBoxes = sessionStorage.getItem(textStorageKey);
    if (savedBoxes) {
      try {
        setTextBoxes(JSON.parse(savedBoxes));
      } catch (e) {
        console.error("Failed to restore text boxes", e);
      }
    }

    // 4. Restore canvas image for THIS specific pageId
    const savedData = sessionStorage.getItem(canvasStorageKey);
    if (savedData) {
      const img = new window.Image();
      img.src = savedData;
      img.onload = () => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      };
    }
  }, [canvasStorageKey, textStorageKey]);

  // Reload canvas immediately whenever pageId changes
  useEffect(() => {
    loadPageContent();
  }, [pageId, loadPageContent]);

  // Save text boxes per page
  useEffect(() => {
    if (textBoxes.length > 0) {
      sessionStorage.setItem(textStorageKey, JSON.stringify(textBoxes));
    } else {
      sessionStorage.removeItem(textStorageKey);
    }
  }, [textBoxes, textStorageKey]);

  // Canvas size and resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    loadPageContent();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      loadPageContent();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loadPageContent]);

  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, rawX: 0, rawY: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      rawX: clientX,
      rawY: clientY,
    };
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isActive || activeTool === "text") return;

    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawingRef.current = true;
    setIsPointerDown(true);
    setCursorPos({ x: coords.rawX, y: coords.rawY });

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isActive || activeTool === "text") return;
    const coords = getCanvasCoords(e);
    setCursorPos({ x: coords.rawX, y: coords.rawY });

    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = modeRef.current === "eraser" ? "rgba(0,0,0,1)" : colorRef.current;
    ctx.lineWidth = widthRef.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (modeRef.current === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      setIsPointerDown(false);

      const canvas = canvasRef.current;
      if (canvas) {
        sessionStorage.setItem(canvasStorageKey, canvas.toDataURL());
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || activeTool !== "text") return;
    if ((e.target as HTMLElement).tagName === "INPUT") return;

    const coords = getCanvasCoords(e);
    const newBox: TextBox = {
      id: Date.now().toString(),
      x: coords.rawX,
      y: coords.rawY,
      text: "",
      color: color,
    };

    setTextBoxes((prev) => [...prev, newBox]);
  };

  const handleTextChange = (id: string, newText: string) => {
    setTextBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, text: newText } : box))
    );
  };

  const removeTextBox = (id: string) => {
    setTextBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  const getToolIconSrc = () => {
    switch (activeTool) {
      case "brush":
        return "/lessons/brushes/Brush_Cartoon.svg";
      case "text":
        return "/lessons/brushes/Text_Cartoon.svg";
      case "highlighter":
        return "/lessons/brushes/Highlighter_Cartoon.svg";
      case "pen":
        return "/lessons/brushes/Pen_Cartoon.svg";
      case "eraser":
        return "/lessons/brushes/Eraser_Cartoon.svg";
      default:
        return "/lessons/brushes/Brush_Cartoon.svg";
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ width: "100vw", height: "100vh" }}
        className={`fixed inset-0 z-[9998] touch-none ${
          isActive
            ? activeTool === "text"
              ? "pointer-events-none"
              : "pointer-events-auto cursor-crosshair"
            : "pointer-events-none"
        }`}
      />

      <div
        onClick={handleOverlayClick}
        className={`fixed inset-0 z-[9999] ${
          isActive && activeTool === "text" ? "pointer-events-auto cursor-text" : "pointer-events-none"
        }`}
      >
        {textBoxes.map((box) => (
          <div
            key={box.id}
            className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${box.x}px`,
              top: `${box.y}px`,
            }}
          >
            <input
              type="text"
              autoFocus={isActive}
              disabled={!isActive}
              value={box.text}
              onChange={(e) => handleTextChange(box.id, e.target.value)}
              onBlur={() => {
                if (!box.text.trim()) {
                  removeTextBox(box.id);
                }
              }}
              placeholder="text"
              style={{
                borderColor: box.color,
                color: box.color,
              }}
              className="px-7 py-3 min-w-[140px] w-auto max-w-[340px] text-center font-bold text-xl rounded-[24px] border-4 bg-white/95 shadow-xl focus:outline-none placeholder:text-gray-400 placeholder:font-normal disabled:bg-transparent disabled:border-transparent"
            />
          </div>
        ))}
      </div>

      {isActive && cursorPos && isPointerDown && activeTool !== "text" && (
        <div
          className="fixed pointer-events-none z-[10005] transition-transform duration-75"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: "translate(-20%, -85%) rotate(-15deg)",
          }}
        >
          <Image
            src={getToolIconSrc()}
            alt="Tool Cursor"
            width={96}
            height={96}
            className="w-24 h-24 object-contain drop-shadow-xl"
          />
        </div>
      )}

      {isActive && (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-[10010] flex flex-col items-center gap-6 select-none pointer-events-auto">
          {!showPalette ? (
            <div className="bg-[#FFE3C8] w-44 py-10 px-6 rounded-[80px] shadow-2xl flex flex-col items-center gap-7 border-[6px] border-[#F9A870]">
              <button
                type="button"
                onClick={() => {
                  setActiveTool("brush");
                  setMode("draw");
                  setLineWidth(14);
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTool === "brush" ? "bg-white shadow-xl scale-105" : "hover:bg-white/40"
                }`}
                title="Paint Brush"
              >
                <Image
                  src="/lessons/brushes/Brush_Cartoon.svg"
                  alt="Brush"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("text")}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTool === "text" ? "bg-white shadow-xl scale-105" : "hover:bg-white/40"
                }`}
                title="Text Tool"
              >
                <Image
                  src="/lessons/brushes/Text_Cartoon.svg"
                  alt="Text"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTool("highlighter");
                  setMode("draw");
                  setLineWidth(32);
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTool === "highlighter" ? "bg-white shadow-xl scale-105" : "hover:bg-white/40"
                }`}
                title="Highlighter"
              >
                <Image
                  src="/lessons/brushes/Highlighter_Cartoon.svg"
                  alt="Highlighter"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTool("pen");
                  setMode("draw");
                  setLineWidth(6);
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTool === "pen" ? "bg-white shadow-xl scale-105" : "hover:bg-white/40"
                }`}
                title="Pen"
              >
                <Image
                  src="/lessons/brushes/Pen_Cartoon.svg"
                  alt="Pen"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTool("eraser");
                  setMode("eraser");
                  setLineWidth(32);
                  setShowPalette(false);
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTool === "eraser" ? "bg-white shadow-xl scale-105" : "hover:bg-white/40"
                }`}
                title="Eraser"
              >
                <Image
                  src="/lessons/brushes/Eraser_Cartoon.svg"
                  alt="Eraser"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </button>

              <button
                type="button"
                disabled={activeTool === "eraser"}
                onClick={() => {
                  if (activeTool !== "eraser") {
                    setShowPalette(true);
                  }
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-transform ${
                  activeTool === "eraser" ? "opacity-40 cursor-not-allowed" : "hover:scale-105 cursor-pointer"
                }`}
                title={activeTool === "eraser" ? "Color selection unavailable for Eraser" : "Open Color Palette"}
              >
                <Image
                  src="/lessons/brushes/draw-palette.png"
                  alt="Color Palette"
                  width={96}
                  height={96}
                  className="w-24 h-24 object-contain"
                />
              </button>
            </div>
          ) : (
            <div className="bg-[#FFE3C8] w-44 border-[6px] border-[#F9A870] rounded-[75px] px-6 py-9 shadow-2xl flex flex-col items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPalette(false)}
                className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-6 hover:scale-105 transition-transform cursor-pointer"
                title="Return to Tools"
              >
                <Image
                  src={getToolIconSrc()}
                  alt="Active Tool"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </button>

              <div className="grid grid-cols-2 gap-5">
                {PALETTE_COLORS.map((hex, idx) => {
                  const isSelected = selectedColorIdx === idx;

                  return (
                    <button
                      key={`${hex}-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setColor(hex);
                        setSelectedColorIdx(idx);

                        if (mode === "eraser" || activeTool === "eraser") {
                          setMode("draw");
                          setActiveTool("brush");
                        }
                      }}
                      style={{ backgroundColor: isSelected ? "transparent" : hex }}
                      className={`relative w-14 h-14 rounded-full cursor-pointer transition-all flex items-center justify-center ${
                        isSelected ? "scale-110" : "hover:scale-110 active:scale-95 shadow-inner"
                      }`}
                      title={`Select Color ${hex}`}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 100 100"
                          className="w-16 h-16 pointer-events-none fill-current drop-shadow-md scale-125"
                          style={{ color: hex }}
                        >
                          <path d="M42 8 C50 4, 58 10, 56 18 C64 12, 74 16, 72 26 C82 22, 90 32, 82 40 C92 46, 88 58, 78 58 C84 68, 74 78, 64 72 C64 82, 50 88, 44 78 C36 86, 24 82, 26 70 C16 74, 8 64, 16 54 C6 48, 10 36, 20 36 C14 26, 24 16, 34 22 C36 12, 40 8, 42 8 Z M28 42 C24 42, 22 46, 25 48 C28 50, 30 46, 28 42 Z M70 30 C68 28, 64 30, 66 34 C68 36, 72 34, 70 30 Z M62 66 C60 64, 58 66, 59 69 C60 72, 64 70, 62 66 Z" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setShowPalette(false);
              onCloseTool();
            }}
            className="w-28 h-28 rounded-full bg-[#7A1EB1] text-white flex items-center justify-center font-bold text-4xl shadow-2xl hover:scale-110 transition-transform cursor-pointer border-4 border-white"
            title="Close Toolbar"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}