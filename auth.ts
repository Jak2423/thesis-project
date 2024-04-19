import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from "siwe"

declare module "next-auth" {
   interface Session {
      user: {
         address: string
      } & DefaultSession["user"]
   }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
   pages: {
      signIn: '/connect',
   },
   providers: [Credentials({
      id: "web3",
      name: "web3",
      credentials: {
         message: {
            label: 'Message',
            type: 'text',
            placeholder: '0x0',
         },
         signature: {
            label: 'Signature',
            type: 'text',
            placeholder: '0x0',
         },
      },
      authorize: async (credentials) => {
         if (!credentials?.signature || !credentials?.message) {
            return null;
         }

         try {
            const siwe = new SiweMessage(JSON.parse(credentials?.message as string))
            const nextAuthUrl = new URL(process.env.AUTH_URL)

            const result = await siwe.verify({
               signature: credentials?.signature as string || '',
               domain: nextAuthUrl.host,
               nonce: await getCsrfToken(),
            })

            if (result.success) {
               return {
                  id: siwe.address,
               }
            }

            return null
         } catch (error) {
            return null
         }
      },
   }
   ),],
   session: {
      strategy: 'jwt',
   },
   secret: process.env.AUTH_SECRET,
   callbacks: {
      async session({ session, token }) {
         session.user.address = token.sub;
         return session;
      },
      authorized({ request: { nextUrl }, auth }) {
         const isConnected = !!auth?.user;
         const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

         if (isOnDashboard) {
            if (isConnected) return true;
            return false;
         } else if (isConnected) {
            return Response.redirect(new URL('/dashboard', nextUrl));
         }
         return true;
      },
   },
} satisfies NextAuthConfig)