import { createUserInDb, getUserFromDb, updateUserInDb } from './database';
import { User } from './models';

export async function authenticateUser(email: string, password: string) {
  return await getUserFromDb({ email, password });
}

export async function registerUser(name: string, email: string, password: string) {
  await createUserInDb({ name, email, password });
}

export async function updateUser(user: typeof User) {
  await updateUserInDb(user);
};

export async function getUser(id: number) {
  return await getUserFromDb({ _id: id });
};
