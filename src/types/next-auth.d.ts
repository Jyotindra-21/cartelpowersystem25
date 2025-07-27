import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAdmin?: boolean;
      username?: string;
      role?: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    username?: string;
    role?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    username?: string;
    role?: string;
    image?: string;
  }
}
