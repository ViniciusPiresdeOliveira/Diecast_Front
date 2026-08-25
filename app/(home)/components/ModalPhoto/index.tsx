import { Image } from "antd";
import { formatImage } from "../../utils";
import { ModalPhotoProps } from "./types";

export const ModalPhoto = ({
  selectedMini,
  handleSelectedMini,
}: ModalPhotoProps) => {
  return (
    <div className="relative inline-block hover:cursor-none">
      <Image
        wrapperStyle={{ display: "none" }}
        preview={{
          open: true,
          onOpenChange: () => handleSelectedMini(null),
        }}
        src={formatImage(selectedMini?.imagem) ?? ""}
      />
    </div>
  );
};
