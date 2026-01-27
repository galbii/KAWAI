// Simple layout for Pages collection
// Storefronts now use /store/[storeslug] with their own layout
export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
