"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Icon from "./Icons";

// 3D preview is heavy (three.js) — load it lazily, client-only
const Shirt3D = dynamic(() => import("./Shirt3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-zinc-500">
      Loading 3D preview…
    </div>
  ),
});

/**
 * "Upload Your Design" + live mockup preview.
 * The uploaded image is rendered client-side onto a shirt/banner mockup —
 * a lightweight version of an AI preview tool, with zero backend needed.
 */
export default function UploadPreview({ onFile, garment = "shirt" }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [shirtColor, setShirtColor] = useState("Black");
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onFile?.(file);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload your design file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver
            ? "border-gold-400 bg-gold-400/10"
            : "border-ink-700 bg-ink-800/50 hover:border-gold-400/60"
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
          <Icon name="upload" className="h-6 w-6" />
        </span>
        <p className="font-bold text-white">
          {fileName ? fileName : "Drop your design here"}
        </p>
        <p className="text-sm text-zinc-500">
          or click to browse — PNG, JPG, SVG, PDF (max 25MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf,.ai,.eps,.svg"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Live mockup preview */}
      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-ink-700 bg-gradient-to-b from-ink-800 to-ink-900">
        {garment === "shirt" ? (
          <div className="h-[300px] w-full">
            <Shirt3D designUrl={preview} color={shirtColor} className="h-full w-full" />
            {/* shirt color swatches */}
            <div className="absolute right-3 top-3 flex flex-col gap-1.5" role="group" aria-label="Shirt color">
              {["Black", "White", "Gold", "Navy", "Red"].map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  aria-label={`Preview on ${c} shirt`}
                  aria-pressed={shirtColor === c}
                  onClick={() => setShirtColor(c)}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    shirtColor === c ? "border-gold-400 scale-110" : "border-zinc-600 hover:border-zinc-400"
                  }`}
                  style={{
                    backgroundColor: {
                      Black: "#1b1b1f", White: "#e8e8e8", Gold: "#f5b52e",
                      Navy: "#1f2a44", Red: "#8f2430",
                    }[c],
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative flex h-32 w-full items-center justify-center rounded-lg border-4 border-zinc-600 bg-zinc-100">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Your design previewed on a banner" className="max-h-full max-w-full object-contain p-1" />
            ) : (
              <p className="text-sm font-semibold text-zinc-400">Your banner preview</p>
            )}
            <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-zinc-400" aria-hidden="true" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-zinc-400" aria-hidden="true" />
            <span className="absolute bottom-1 left-1 h-2 w-2 rounded-full bg-zinc-400" aria-hidden="true" />
            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-zinc-400" aria-hidden="true" />
          </div>
        )}
        {garment !== "shirt" && (
          <p className="absolute bottom-3 text-[11px] uppercase tracking-widest text-zinc-500">
            Live mockup preview
          </p>
        )}
      </div>
    </div>
  );
}
