// Shared Calendly type declarations

declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        utm?: Record<string, string>;
        prefill?: Record<string, unknown>;
      }) => void;
      initPopupWidget: (options: {
        url: string;
        utm?: Record<string, string>;
        prefill?: Record<string, unknown>;
      }) => void;
    };
  }
}

// Export empty object to make this a module
export {};