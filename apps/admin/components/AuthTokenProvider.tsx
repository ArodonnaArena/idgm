"use client"

import { useEffect } from "react"
import { setAuthToken } from "@idgm/lib"

export default function AuthTokenProvider({ token }: { token: string | null }) {
  useEffect(() => {
    setAuthToken(token || null)
  }, [token])
  return null
}
