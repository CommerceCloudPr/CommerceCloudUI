import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";

// Ortam değişkenlerini kontrol et
if (!process.env.OAUTH_CLIENT_ID) {
  throw new Error("Missing OAUTH_CLIENT_ID environment variable");
}
if (!process.env.OAUTH_CLIENT_SECRET) {
  throw new Error("Missing OAUTH_CLIENT_SECRET environment variable");
}
if (!process.env.OAUTH_ISSUER) {
  throw new Error("Missing OAUTH_ISSUER environment variable");
}
if (!process.env.OAUTH_SCOPES) {
  throw new Error("Missing OAUTH_SCOPES environment variable. Please add it to your .env.local file.");
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable. Generate one with: openssl rand -hex 32 or similar.");
}

export const authOptions  = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    {
      id: "oauth-backend", 
      name: "Şirket Hesabı",
      type: "oauth",
      checks: ["pkce"],
      issuer: process.env.OAUTH_ISSUER,
      jwks_endpoint: `${process.env.OAUTH_ISSUER}/oauth2/jwks`,

      authorization: {
        url: `${process.env.OAUTH_ISSUER}/oauth2/authorize`,
        params: {
          scope: process.env.OAUTH_SCOPES,
        },
      },
      token: `${process.env.OAUTH_ISSUER}/oauth2/token`,
      userinfo: `${process.env.OAUTH_ISSUER}/info/me`,

      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,

      async profile(profile, tokens) {
        if (tokens.access_token) {
          try {
            const userinfoResponse = await axios.get(
              `${process.env.OAUTH_ISSUER}/info/me`,
              {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                },
              }
            );
            
            const userData = userinfoResponse.data.data || userinfoResponse.data;

            if (!userData || !userData.uuid) {
              throw new Error("Userinfo response is missing 'uuid'.");
            }

            return {
              id: userData.uuid,
              name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
              email: userData.email,
              idToken: tokens.id_token
            };
          } catch (error) {
            console.error("[AUTH PROFILE] Failed to fetch userinfo:", error);
            return { id: profile.sub, idToken: tokens.id_token };
          }
        }
        return null;
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = (user).idToken || account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        // ÇÖZÜM: id_token'ı session'a ekleyerek client-side'da erişilebilir yapıyoruz.
        (session).idToken = token.idToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
