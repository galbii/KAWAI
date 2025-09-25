import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Kawai ES60 Cinematic Experience | Concert Grand Heritage Revealed',
  description: 'Experience the revolutionary ES60 digital piano through an immersive cinematic presentation. Discover how concert grand heritage meets modern innovation at just $499.',
  robots: {
    index: true,
    follow: true,
  },
};

// Full-screen layout without header/footer for immersive cinematic experience
export default function CinematicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {children}
    </div>
  );
}