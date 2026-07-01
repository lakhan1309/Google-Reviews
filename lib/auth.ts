import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { debugLog } from "@/lib/debug-log";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const hasSecret = !!(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
        const hasAdminEmail = !!process.env.ADMIN_EMAIL;
        const hasAdminPassword = !!process.env.ADMIN_PASSWORD;
        const emailMatch = email === process.env.ADMIN_EMAIL;
        const passwordMatch = password === process.env.ADMIN_PASSWORD;

        // #region agent log
        debugLog(
          "lib/auth.ts:authorize",
          "Login attempt",
          {
            hasSecret,
            hasAdminEmail,
            hasAdminPassword,
            emailMatch,
            passwordMatch,
            emailProvided: !!email,
          },
          "B-C"
        );
        // #endregion

        if (emailMatch && passwordMatch) {
          return {
            id: "admin",
            email: process.env.ADMIN_EMAIL,
            name: "Admin",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      // #region agent log
      debugLog(
        "lib/auth.ts:authorized",
        "Middleware auth check",
        {
          path: request.nextUrl.pathname,
          isLoggedIn,
          isAdminRoute,
          isLoginPage,
        },
        "E"
      );
      // #endregion

      if (isAdminRoute && !isLoginPage) {
        return isLoggedIn;
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      return true;
    },
  },
});
