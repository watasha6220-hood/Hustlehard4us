"use client";

// #4 — Artwork uploads to Supabase Storage (free 1GB tier).
// Creates public URLs the owner can open straight from the admin panel.
// In demo mode (no Supabase keys) we skip upload and return null —
// the order still saves with the design's file name.

import { supabase, isSupabaseConfigured } from "./supabase";

const BUCKET = "artwork";

const safeName = (name) =>
  name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Upload a File (or a dataURL string) to the artwork bucket.
 * @returns public URL string, or null in demo mode / on failure
 */
export async function uploadArtwork(fileOrDataUrl, prefix = "design") {
  if (!isSupabaseConfigured || !fileOrDataUrl) return null;

  try {
    let blob = fileOrDataUrl;
    let ext = "png";

    if (typeof fileOrDataUrl === "string") {
      // dataURL → Blob
      const res = await fetch(fileOrDataUrl);
      blob = await res.blob();
      ext = (blob.type.split("/")[1] || "png").split("+")[0];
    } else {
      ext = (fileOrDataUrl.name?.split(".").pop() || "png").toLowerCase();
    }

    const path = `${prefix}/${Date.now()}-${
      typeof fileOrDataUrl === "string" ? `design.${ext}` : safeName(fileOrDataUrl.name)
    }`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (err) {
    console.error("Artwork upload failed (order still saves):", err);
    return null;
  }
}
