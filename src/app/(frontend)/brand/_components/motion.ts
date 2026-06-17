export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1]
export const EASE_IN_OUT_CUBIC: [number, number, number, number] = [0.65, 0, 0.35, 1]

/**
 * Build an opacity window for a scroll-coupled scene.
 * Returns the input/output pairs for useTransform that fade in,
 * hold, then fade out across the [start, end] range.
 */
export function sceneWindow(start: number, end: number, fadePortion = 0.18) {
  const span = end - start
  const fade = span * fadePortion
  return {
    input: [start, start + fade, end - fade, end] as const,
    output: [0, 1, 1, 0] as const,
  }
}
