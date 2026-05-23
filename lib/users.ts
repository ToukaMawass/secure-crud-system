export type UserRole = "admin" | "user";

export type AppUser = {
  username: string;
  password: string;
  email: string;
  role: UserRole;
};

export const users: AppUser[] = [
  {
    username: "admin",
    password: "admin123",
    email: "toukamawasss7@gmail.com",
    role: "admin",
  },
  {
    username: "user",
    password: "user123",
    email: "toukamawasss7@gmail.com",
    role: "user",
  },
];

export function findUserByUsername(username: string) {
  return users.find((user) => user.username === username);
}