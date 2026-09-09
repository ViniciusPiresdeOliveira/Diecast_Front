import { act, renderHook } from "@testing-library/react";
import { TypeDeviceProvider } from "../../contexts/TypeDevice";
import { useTypeDevice } from "../../hooks/useTypeDevice";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TypeDeviceProvider initialIsMobile={false}>{children}</TypeDeviceProvider>
);

describe("useTypeDevice", () => {
  it("lança erro quando usado fora do TypeDeviceProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTypeDevice())).toThrow(
      "useTypeDevice deve ser usado dentro de TypeDeviceProvider",
    );
    spy.mockRestore();
  });

  it("respeita o initialIsMobile informado", () => {
    const { result } = renderHook(() => useTypeDevice(), { wrapper });
    expect(result.current.isMobile).toBe(false);
  });

  it("setMobile define isMobile como true", () => {
    const { result } = renderHook(() => useTypeDevice(), { wrapper });

    act(() => {
      result.current.setMobile();
    });

    expect(result.current.isMobile).toBe(true);
  });

  it("setDesktop define isMobile como false", () => {
    const { result } = renderHook(() => useTypeDevice(), {
      wrapper: ({ children }) => (
        <TypeDeviceProvider initialIsMobile={true}>
          {children}
        </TypeDeviceProvider>
      ),
    });

    act(() => {
      result.current.setDesktop();
    });

    expect(result.current.isMobile).toBe(false);
  });
});
