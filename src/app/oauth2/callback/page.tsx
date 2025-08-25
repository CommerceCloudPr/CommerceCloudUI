"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function OAuth2CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // next-auth işlemi tamamladığında genellikle otomatik yönlendirme yapar.
    // Ancak bir sorun olursa veya yönlendirme gecikirse diye
    // birkaç saniye sonra kullanıcıyı ana sayfaya yönlendirebiliriz.
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000) // 3 saniye sonra yönlendir

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-gray-700 dark:text-gray-300">Giriş işlemi tamamlanıyor, lütfen bekleyin...</p>
    </div>
  )
}
