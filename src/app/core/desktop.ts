/** API exposed by electron/preload.js. Undefined when running in a browser. */
export interface DesktopApi {
  platform: string;
  minimize(): void;
  toggleMaximize(): void;
  close(): void;
  onMaximizedChange(callback: (maximized: boolean) => void): void;
}

export const desktop: DesktopApi | undefined = (window as { desktop?: DesktopApi }).desktop;
