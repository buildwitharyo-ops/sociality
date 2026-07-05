"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreatePost } from "./use-create-post";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ["image/png", "image/jpeg"];

export function CreatePost() {
  const router = useRouter();
  const createPost = useCreatePost();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Revoke the object URL if the user leaves with an image still selected.
  const previewUrlRef = useRef<string | null>(null);
  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);
  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  function chooseFile(next: File | undefined) {
    if (!next) return;
    if (!ACCEPTED.includes(next.type)) {
      setImageError("Please choose a PNG or JPG image.");
      return;
    }
    if (next.size > MAX_SIZE) {
      setImageError("Image must be 5 MB or smaller.");
      return;
    }
    setImageError(null);
    setFile(next);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(next);
    });
  }

  function openPicker() {
    if (inputRef.current) {
      inputRef.current.value = ""; // allow re-picking the same file
      inputRef.current.click();
    }
  }

  function removeImage() {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setImageError("Please choose an image to share.");
      return;
    }
    createPost.mutate({ image: file, caption: caption.trim() });
  }

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <header className="mb-5 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Add Post</h1>
      </header>

      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium">Photo</p>
          {previewUrl ? (
            <div className="space-y-2">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={previewUrl}
                  alt="Selected image preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={openPicker}>
                  <RefreshCw className="size-4" />
                  Change Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                  Delete Image
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openPicker}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                chooseFile(event.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center transition-colors hover:border-primary/60",
                dragOver && "border-primary bg-primary/5",
                imageError && "border-destructive",
              )}
            >
              <ImagePlus className="size-6 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </span>
              <span className="text-xs text-muted-foreground">PNG or JPG (max. 5mb)</span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          {imageError ? <p className="text-sm text-destructive">{imageError}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="caption" className="text-sm font-medium">
            Caption
          </label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Create your caption"
            rows={4}
          />
        </div>

        <Button
          type="submit"
          disabled={!file || createPost.isPending}
          className="w-full rounded-full"
        >
          {createPost.isPending ? "Sharing…" : "Share"}
        </Button>
      </form>
    </div>
  );
}
