import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAdmin?: boolean;
      username?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    username?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    username?: string;
    role?: string;
  }
}
