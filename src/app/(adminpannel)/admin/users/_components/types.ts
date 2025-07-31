export type User = {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  position: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};
