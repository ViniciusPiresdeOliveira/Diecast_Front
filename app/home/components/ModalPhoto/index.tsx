import { useTypeDevice } from "@/app/contexts/TypeDevice";
import Image from "next/image";
import { useState } from "react";
import { ModalPhotoProps } from "./types";

export const ModalPhoto = ({
  selectedImage,
  handleSelectedImage,
}: ModalPhotoProps) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const { isMobile } = useTypeDevice();
  console.log("isMobile", isMobile);

  const zoom = 1.5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    setCursorPos({ x, y });
    setImgSize({ width, height });
  };

  return (
    <button
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={() => handleSelectedImage(null)}
    >
      <button
        className="relative max-w-4xl w-full max-h-[95vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="cursor-pointer absolute top-4 right-14 text-white text-3xl hover:text-red-400 z-50"
          onClick={() => handleSelectedImage(null)}
        >
          ✕
        </button>

        <div
          className="relative inline-block"
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={selectedImage}
            alt="Preview"
            width={650}
            height={650}
            className="max-w-full"
          />

          {!isMobile && showMagnifier && (
            <div
              className="absolute pointer-events-none border border-white rounded-full"
              style={{
                width: 250,
                height: 250,
                top: cursorPos.y - 90,
                left: cursorPos.x - 90,
                backgroundImage: `url(${selectedImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${imgSize.width * zoom}px ${
                  imgSize.height * zoom
                }px`,
                backgroundPosition: `
                  -${cursorPos.x * zoom - 90}px
                  -${cursorPos.y * zoom - 90}px
                `,
              }}
            />
          )}
        </div>
      </button>
    </button>
  );
};
