import type { Session } from "next-auth"
import SignOutButton from "./SignOutButton"

export default function Header({ session }: { session: Session }) {
  const name = session?.user?.name || session?.user?.email || ""
  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">{name}</div>
        <SignOutButton />
      </div>
    </header>
  )
}
