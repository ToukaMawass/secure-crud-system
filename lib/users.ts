export type UserRole = "admin" | "user";

export type AppUser = {
  username: string;
  password: string;
  role: UserRole;
};

export const users: AppUser[] = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    username: "user",
    password: "user123",
    role: "user",
  },
];

export function findUserByUsername(username: string) {
  return users.find((user) => user.username === username);
}