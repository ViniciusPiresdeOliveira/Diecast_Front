import { Tooltip } from "antd";
import clsx from "clsx";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ModalAddItens } from "../ModalAddItens";
import { LabelProps } from "./types";

export const Label = ({
  text,
  className,
  required,
  iconAdd,
  handleForceRefreshLists,
}: LabelProps) => {
  const [modalFormVisible, setModalFormVisible] = useState(false);

  const handleVisibilityModalForm = () => {
    setModalFormVisible((e) => !e);
  };

  // useEffect(() => {
  //   alert("modalFormVisible " + text);
  // }, [modalFormVisible]);

  return (
    <div
      className={twMerge(
        clsx(
          "flex items-center justify-between text-sm font-medium text-gray-700",
          className,
        ),
      )}
    >
      <span className="flex items-center">
        {text}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>

      {iconAdd && (
        <>
          <Tooltip title={"Adicione " + text}>
            <button
              className="cursor-pointer transition-transform duration-200 -mt-2 hover:scale-110"
              onClick={handleVisibilityModalForm}
            >
              <CirclePlusIcon color="#25d366" size={18} />
            </button>
          </Tooltip>
          {modalFormVisible && (
            <ModalAddItens
              isVisible={modalFormVisible}
              handleVisibility={handleVisibilityModalForm}
              handleForceRefreshLists={handleForceRefreshLists}
              title={text}
              typeAdd={iconAdd}
            />
          )}
        </>
      )}
    </div>
  );
};
