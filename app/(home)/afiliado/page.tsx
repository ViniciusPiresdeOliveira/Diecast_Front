"use client";

import {
  deleteLinksAffiliateById,
  getAllLinksAffiliate,
  postLinksAffiliate,
} from "@/app/api/link_afiliado";
import { DeleteButton } from "@/app/components/Buttons/Delete";
import { DeleteConfirmModal } from "@/app/components/Modal/Delete";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { getErrorMessage } from "@/app/utils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LinkAfiliado, Preview } from "./types";

export default function Afiliado() {
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [linksAffiliate, setLinksAffiliate] = useState<LinkAfiliado[]>([]);
  const [newLink, setNewLink] = useState("");
  const [linkToDelete, setLinkToDelete] = useState<LinkAfiliado | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPreviews = async (links: LinkAfiliado[]) => {
    const urls = links.map((item) => item.link);
    if (urls.length === 0) {
      setPreviews([]);
      return;
    }

    try {
      showLoading();
      const res = await fetch("/api/preview", {
        method: "POST",
        body: JSON.stringify({ urls }),
      });

      const data = await res.json();
      setPreviews(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const fetchAllLinksAffiliate = async () => {
    try {
      showLoading();
      const { data } = await getAllLinksAffiliate();
      setLinksAffiliate(data);
      await fetchPreviews(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleAddLink = async () => {
    if (!newLink.trim()) {
      return;
    }
    try {
      showLoading();
      await postLinksAffiliate({ link: newLink });
      setNewLink("");
      await fetchAllLinksAffiliate();
      toast.success("Link de Afiliado cadastrado com sucesso");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteLinksAffiliateById(linkToDelete.id);
      toast.success("Link de Afiliado removido com sucesso");
      setLinkToDelete(null);
      await fetchAllLinksAffiliate();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const findLinkAffiliateByUrl = (url: string) =>
    linksAffiliate.find((item) => item.link === url) ?? null;

  useEffect(() => {
    fetchAllLinksAffiliate();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center">Preview de Links</h1>

      {user && (
        <div className="flex items-center gap-2 mb-6 max-w-xl mx-auto">
          <input
            type="text"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddLink();
              }
            }}
            placeholder="Cole o link de afiliado aqui"
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            type="button"
            onClick={handleAddLink}
            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-green-600 transition-all duration-300 hover:scale-110 hover:bg-green-50"
          >
            <Plus size={22} color="#07ac5a" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative group block border rounded-xl overflow-hidden hover:shadow transition-all duration-300"
          >
            {user && (
              <DeleteButton
                onClick={(e) => {
                  e.preventDefault();
                  const link = findLinkAffiliateByUrl(preview.url);
                  if (link) {
                    setLinkToDelete(link);
                  }
                }}
                // variant="table"
                className="cursor-pointer absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8"
              />
            )}

            <a href={preview.url} target="_blank" className="block">
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
          </div>
        ))}
      </div>

      <DeleteConfirmModal
        open={!!linkToDelete}
        title="Excluir link"
        message="Tem certeza que deseja excluir este link de afiliado ?"
        confirmText="Excluir"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setLinkToDelete(null)}
      />
    </div>
  );
}
