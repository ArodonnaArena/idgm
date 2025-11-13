import { redirect } from 'next/navigation'

export default function Index() {
  redirect('/protected/dashboard')
}
