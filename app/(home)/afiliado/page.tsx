"use client";

import { useLoading } from "@/app/hooks/useLoading";
import { useEffect, useState } from "react";

type Preview = {
  title: string;
  summary: string;
  thumbnail?: string;
  url: string;
};

export default function Afiliado() {
  const { showLoading, hideLoading } = useLoading();
  const [previews, setPreviews] = useState<Preview[]>([]);

  // 🔥 array de URLs (mockado por enquanto)
  const urls = ["https://meli.la/214921q"];

  useEffect(() => {
    showLoading();
    async function load() {
      const res = await fetch("/api/preview", {
        method: "POST",
        body: JSON.stringify({ urls }),
      });

      const data = await res.json();
      setPreviews(Array.isArray(data) ? data : []);
      hideLoading();
    }

    load();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Preview de Links</h1>

      <div className="flex flex-col gap-4">
        {previews.map((preview, index) => (
          <a
            key={index}
            href={preview.url}
            target="_blank"
            className="block border rounded-xl overflow-hidden hover:shadow"
          >
            {preview.thumbnail && (
              <img
                src={preview.thumbnail}
                className="w-full h-48 object-contain"
              />
            )}

            <div className="p-3">
              <h2 className="font-semibold">{preview.title}</h2>

              <p className="text-sm text-gray-500">{preview.summary}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
