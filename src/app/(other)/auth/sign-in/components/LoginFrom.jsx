"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';


const errorMessages = {
  CredentialsSignin: "Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.",
  OAuthSignin: "OAuth ile giriş başlatılırken bir sorun oluştu.",
  OAuthCallback: "OAuth sağlayıcısından geri dönüş sırasında bir sorun oluştu.",
  OAuthCreateAccount: "OAuth ile hesap oluşturulurken bir sorun oluştu.",
  Default: "Giriş yaparken bir hata oluştu. Lütfen tekrar deneyin."
};

const getErrorMessage = (errorCode) => {
  if (!errorCode) return '';
  return errorMessages[errorCode] || errorMessages.Default;
};

export default function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const loggedOut = searchParams.get("logout") === "true";
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setLoginError(getErrorMessage(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError(getErrorMessage(result.error));
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      setLoginError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = () => {
    signIn('oauth-backend', { callbackUrl: '/dashboard' });
  };


  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mb-4"></div>
        <h2 className="text-2xl font-bold text-center text-white">Yükleniyor...</h2>
      </div>
    );
  }

  if (loggedOut && status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 antialiased">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-sm text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Başarıyla çıkış yapıldı
          </h2>
          <p className="text-gray-400 mb-6">
            Tekrar görüşmek üzere!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition transform hover:scale-105"
          >
            Tekrar Giriş Yap
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-gray-200 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl p-8">

          {/* Password Buddy Animation */}


          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Giriş Yap</h1>
            <p className="text-gray-400 mt-2">Hesabınıza giriş yapmak için bilgilerinizi girin</p>
          </div>

          {/* Error Messages */}
          {loginError && (
            <div className="mb-4 bg-red-900 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg text-center">
              {loginError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
                autoFocus
                placeholder="Kullanıcı adınızı girin"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                  required
                  placeholder="Şifrenizi girin"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >

                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">VEYA</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* OAuth Login */}
          <motion.button
            onClick={handleOAuthLogin}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C42.022,35.426,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            <span className="font-bold">OAuth ile Giriş Yap</span>
          </motion.button>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-bold text-blue-400 hover:underline">
              Hemen Kayıt Olun
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
