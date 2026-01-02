/**
 * SimpleDivider Component
 *
 * A clean, minimalist horizontal divider using the KAWAI brand red.
 * Provides visual separation between page sections with consistent styling.
 */

interface SimpleDividerProps {
  /** Custom className for additional styling */
  className?: string;
}

export function SimpleDivider({ className = "" }: SimpleDividerProps) {
  return (
    <div className={`w-full h-4 bg-[#A01829] ${className}`} />
  );
}
