// jest-dom adds custom jest matchers for asserting on DOM nodes.
// Allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Automatically clean up after each test (already done by @testing-library/react)
// but we import it for clarity and to ensure the environment is set.
import '@testing-library/react';

// (Optional) If you use user-event, you may want to import it globally
// import userEvent from '@testing-library/user-event';

// Mock `window.matchMedia` for components that use media queries (e.g., MUI, responsive hooks).
// Many UI libraries rely on this, and it's not implemented in JSDOM.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated, but still used in some older code
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock `ResizeObserver` which is not available in JSDOM.
// Many modern components (e.g., charts, virtualized lists) use it.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock `IntersectionObserver` (used for lazy loading, infinite scroll, etc.)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: jest.fn(),
}));

// (Optional) Increase the default timeout for async tests if needed
// jest.setTimeout(15000);

// (Optional) Suppress specific console errors/warnings during tests
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (/Warning: ReactDOM.render is no longer supported/.test(args[0])) {
//       return;
//     }
//     originalError.call(console, ...args);
//   };
// });
// afterAll(() => {
//   console.error = originalError;
// });

// (Optional) Add a custom matcher example (extend expect)
// expect.extend({
//   toBeWithinRange(received, floor, ceiling) {
//     const pass = received >= floor && received <= ceiling;
//     if (pass) {
//       return {
//         message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
//         pass: true,
//       };
//     } else {
//       return {
//         message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
//         pass: false,
//       };
//     }
//   },
// });
