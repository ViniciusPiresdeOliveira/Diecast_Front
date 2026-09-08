import { Button, Dropdown, Grid } from "antd";
import { Navigation } from "lucide-react";
import Link from "next/link";

const { useBreakpoint } = Grid;

const baseClassName = "text-gray-200 font-medium";

const buildItems = (isAdmin: boolean) => [
  ...(isAdmin
    ? [{ key: "clientes", label: <Link href="/clientes">Clientes</Link> }]
    : []),
  { key: "afiliado", label: <Link href="/afiliado">Afiliado</Link> },
  { key: "eventos", label: <Link href="/eventos">Eventos</Link> },
];

export const OptionsOfNavigate = ({ isAdmin }: { isAdmin: boolean }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  if (!isMobile) {
    return (
      <>
        {isAdmin && (
          <div className={`gap-6 ${baseClassName}`}>
            <Link href={"/clientes"}>Clientes</Link>
          </div>
        )}
        <div className={`gap-6 ${baseClassName}`}>
          <Link href={"/afiliado"}>Afiliado</Link>
        </div>
        <div className={`gap-6 ${baseClassName}`}>
          <Link href={"/eventos"}>Eventos</Link>
        </div>
      </>
    );
  }

  return (
    <Dropdown menu={{ items: buildItems(isAdmin) }} trigger={["click"]}>
      <Button type="text" icon={<Navigation color="white" />} />
    </Dropdown>
  );
};
