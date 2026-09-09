import { headers } from "next/headers";
import { getDeviceType, isMobileDevice } from "../../hooks/useIsMobileDevice";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

const mockedHeaders = headers as jest.Mock;

describe("useIsMobileDevice", () => {
  const mockUserAgent = (ua: string | null) => {
    mockedHeaders.mockResolvedValue({
      get: (key: string) => (key === "user-agent" ? ua : null),
    });
  };

  it("identifica user agents mobile (Android)", async () => {
    mockUserAgent("Mozilla/5.0 (Linux; Android 10)");
    await expect(isMobileDevice()).resolves.toBe(true);
  });

  it("identifica user agents mobile (iPhone)", async () => {
    mockUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)");
    await expect(isMobileDevice()).resolves.toBe(true);
  });

  it("identifica user agents desktop", async () => {
    mockUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    await expect(isMobileDevice()).resolves.toBe(false);
  });

  it("trata ausência de user-agent como não mobile", async () => {
    mockUserAgent(null);
    await expect(isMobileDevice()).resolves.toBe(false);
  });

  it("getDeviceType retorna 'mobile' ou 'desktop' de acordo com o user agent", async () => {
    mockUserAgent("Mozilla/5.0 (Linux; Android 10)");
    await expect(getDeviceType()).resolves.toBe("mobile");

    mockUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    await expect(getDeviceType()).resolves.toBe("desktop");
  });
});
