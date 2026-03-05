import { TSDGlobalSearch } from './_components/TSDGlobalSearch'

export default function TSDLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TSDGlobalSearch />
      {children}
    </>
  )
}
