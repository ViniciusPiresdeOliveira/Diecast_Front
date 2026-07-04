"use client";

import { getAllLinksAffiliate } from "@/app/api/link_afiliado";
import { useLoading } from "@/app/hooks/useLoading";
import { getErrorMessage } from "@/app/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LinkAfiliado, Preview } from "./types";

export default function Afiliado() {
  const { showLoading, hideLoading } = useLoading();
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [linksAffiliate, setLinksAffiliate] = useState<LinkAfiliado[]>([]);

  // 🔥 array de URLs (mockado por enquanto)

  const fetchAllLinksAffiliate = async () => {
    try {
      showLoading();
      const { data } = await getAllLinksAffiliate();
      setLinksAffiliate(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    const urls = linksAffiliate.map((item) => item.link);
    if (urls.length === 0) {
      return;
    }
    showLoading();
    async function load() {
      // const links = ["https://meli.la/214921q"];
      console.log("ee eff links", urls);

      const res = await fetch("/api/preview", {
        method: "POST",
        body: JSON.stringify({ urls }),
      });

      const data = await res.json();
      setPreviews(Array.isArray(data) ? data : []);
      hideLoading();
    }

    load();
  }, [linksAffiliate]);

  useEffect(() => {
    fetchAllLinksAffiliate();
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
