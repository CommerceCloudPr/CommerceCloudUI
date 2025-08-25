"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function SignIn() {
  const { status, data: session } = useSession();
  const searchParams = useSearchParams();
  console.log(searchParams, "search params")
  const error = searchParams.get("error");

  // Giriş işlemini başlatan fonksiyon
  const handleLogin = () => {
    console.log("logine yönlendiriliyor.")
    // signIn fonksiyonu otomatik olarak backend'deki provider'a yönlendirecek.
    signIn('oauth-backend', { callbackUrl: '/dashboard' });
    console.log(session, "my session")
  };

  useEffect(() => {
    console.log(status, "status");
    console.log(error, "error")
    // Eğer bir hata yoksa ve kullanıcı giriş yapmamışsa,
    // otomatik olarak giriş akışını başlat.
    // Kullanıcı bir hatadan dolayı bu sayfaya düşmüşse, tekrar denemesi için butonu beklesin.
    if (status === 'unauthenticated') {
      handleLogin();
    }
  }, [status, error]);

  // Oturum durumu kontrol edilirken veya yönlendirme beklenirken gösterilecek ekran
  let content = (
    <>
      <h1 className="text-2xl font-bold text-white mb-4">
        Giriş Yapılıyor...
      </h1>
      <p className="text-gray-400 mb-6">
        Güvenli giriş sayfasına yönlendiriliyorsunuz. Lütfen bekleyin.
      </p>
      <div className="mt-6 w-16 h-16 mx-auto border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </>
  );

  // Eğer bir hata varsa, kullanıcıya tekrar deneme butonu göster
  if (error) {
    content = (
      <>
        <h1 className="text-2xl font-bold text-white mb-4">Bir Sorun Oluştu</h1>
        <div className="mb-4 bg-red-900 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
          <p className="font-bold mb-1">Giriş sırasında bir hata oluştu.</p>
          <p>Hata Kodu: {error}</p>
        </div>
        <p className="text-gray-400 my-6">
          Lütfen tekrar deneyin veya sistem yöneticinize başvurun.
        </p>
        <motion.button
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition transform"
        >
          Tekrar Giriş Yapmayı Dene
        </motion.button>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl p-8 text-center"
      >
        {content}
      </motion.div>
    </div>
  );
}
