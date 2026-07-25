"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { BackLink } from "@/components";
import { createClient } from "@/prismicio";
import { siteConfig } from "@/config";

// Load 24 photos at a time for performance
const BATCH_SIZE = 24;

const VIEW_MODES = [
  {
    icon: "ri-layout-grid-line",
    title: "Compact view (2 columns)",
    layout: "grid-2",
  },
  {
    icon: "ri-grid-line",
    title: "Standard view (3 columns)",
    layout: "grid-3",
  },
] as const;

type ViewIndex = 0 | 1;

const queryPhotos = async () => {
  const client = createClient();
  try {
    return await client.getSingle("photos");
  } catch (error) {
    console.error("Failed to fetch photos content from Prismic:", error);
    return null;
  }
};

export default function PhotosPage() {
  const [pageTitle, setPageTitle] = useState("Photos");
  const [pageSubtitle, setPageSubtitle] = useState("Moments captured through the lens.");
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [defaultView, setDefaultView] = useState<ViewIndex>(1);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [viewIndex, setViewIndex] = useState<ViewIndex>(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Prismic data on mount
  useEffect(() => {
    const loadPhotosData = async () => {
      setLoading(true);
      const photosPage = await queryPhotos();
      if (photosPage && photosPage.data) {
        setPageTitle(photosPage.data?.title || "Photos");
        setPageSubtitle(photosPage.data?.subtitle || "Moments captured through the lens.");
        
        // Set photos from Prismic
        if (Array.isArray(photosPage.data?.photos)) {
          setAllPhotos(photosPage.data.photos);
        }
        
        // Set default view
        const viewModeMap: Record<string, ViewIndex> = {
          "grid-2": 0,
          "grid-3": 1,
        };
        const viewMode = photosPage.data?.default_view as string;
        if (viewMode && viewModeMap[viewMode] !== undefined) {
          setDefaultView(viewModeMap[viewMode]);
          setViewIndex(viewModeMap[viewMode]);
        }
      }
      setLoading(false);
    };
    loadPhotosData();
  }, []);

  const viewMode = VIEW_MODES[viewIndex];

  const cycleView = () => {
    setViewIndex((prev) => ((prev + 1) % VIEW_MODES.length) as ViewIndex);
  };

  const visiblePhotos = allPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < allPhotos.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allPhotos.length));
  }, [allPhotos.length]);

  // Handle lightbox navigation
  const nextPhoto = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev !== null && prev < allPhotos.length - 1 ? prev + 1 : 0,
      );
    }
  }, [lightboxIndex, allPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev !== null && prev > 0 ? prev - 1 : allPhotos.length - 1,
      );
    }
  }, [lightboxIndex, allPhotos.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextPhoto, prevPhoto, closeLightbox]);

  if (loading) {
    return (
      <main className="px-7 py-10 relative z-10 flex-1 flex items-center justify-center">
        <p>Loading photos...</p>
      </main>
    );
  }

  return (
    <main className="px-7 py-10 of-x-hidden relative z-10 flex-1">
      <div className="relative">
        <button
          type="button"
          onClick={cycleView}
          className="photos-view-toggle slide-enter-50"
          title="Switch view"
          aria-label={viewMode.title}
        >
          <i className={`${viewMode.icon} text-lg`} aria-hidden="true" />
        </button>
      </div>

      {/* Page Header */}
      {/* Page Header */}
      <div className="prose m-auto mb-8 text-center">
        <h1 className="page-title slide-enter-50">{pageTitle}</h1>
        <p className="page-subtitle slide-enter-50">
          {pageSubtitle}
        </p>
      </div>

      <article>
        <div>
          <div
            className={`photos-grid photos-grid-${viewMode.layout} slide-enter-content`}
          >
            {visiblePhotos.map((photo: any, index: number) => (
              <div
                key={index}
                onClick={() => setLightboxIndex(index)}
                className={`photos-card group relative cursor-zoom-in rounded-lg overflow-hidden hover:scale-[1.01] transition-transform duration-300 aspect-square`}
              >
                <Image
                  src={photo.photo_image?.url || ""}
                  alt={photo.photo_alt || `Photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover opacity-0 group-hover:scale-105 transition-transform duration-500 absolute inset-0 h-full"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.remove(
                      "opacity-0",
                    );
                  }}
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-[10px] font-mono text-white/60 bg-black/40 px-2 py-0.5 rounded">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div
              className="flex justify-center mt-12 slide-enter"
              style={{ maxWidth: "var(--prose-max-width)", margin: "0 auto" }}
            >
              <button
                onClick={loadMore}
                className="px-6 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-sm font-medium"
              >
                Load More
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && allPhotos.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <p className="text-zinc-500">No photos yet. Add photos in Prismic.</p>
            </div>
          )}

          {/* Back navigation */}
          <BackLink href="/" className="mt-16" />
        </div>
      </article>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && allPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-sm p-4 animate-fade-in select-none">
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full text-white/80 p-2 z-10">
            <span className="font-mono text-sm">
              {lightboxIndex + 1} / {allPhotos.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <i className="ri-close-line text-2xl" />
            </button>
          </div>

          {/* Main Stage */}
          <div className="flex-1 flex items-center justify-center relative my-4">
            {/* Prev Button */}
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all z-10"
              title="Previous"
            >
              <i className="ri-arrow-left-s-line text-2xl" />
            </button>

            {/* Image */}
            <div className="relative max-w-full max-h-[75vh] sm:max-h-[80vh] w-full h-full flex items-center justify-center">
              <Image
                src={allPhotos[lightboxIndex]?.photo_image?.url || ""}
                alt={allPhotos[lightboxIndex]?.photo_alt || `Photo ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain rounded-md shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all z-10"
              title="Next"
            >
              <i className="ri-arrow-right-s-line text-2xl" />
            </button>
          </div>

          {/* Bottom Bar info */}
          <div className="text-center text-white/40 text-xs font-mono p-2 z-10">
            Use Left/Right arrows to navigate
          </div>
        </div>
      )}
    </main>
  );
}
