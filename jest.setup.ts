import "@testing-library/jest-dom";
import { MessageChannel } from "worker_threads";

// MessageChannel polyfill (rc-component/antd usa isso internamente para agendar tasks)
global.MessageChannel = MessageChannel as any;

// matchMedia mock (antd / responsive components costumam depender disso)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// IntersectionObserver mock (usado por alguns componentes de UI/carousel)
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
// @ts-expect-error - mock simplificado para o ambiente de testes
window.IntersectionObserver = MockIntersectionObserver;

// ResizeObserver mock
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
// @ts-expect-error - mock simplificado para o ambiente de testes
window.ResizeObserver = MockResizeObserver;
