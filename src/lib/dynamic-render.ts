import { connection } from "next/server";

export async function ensureDynamic(): Promise<void> {
  await connection();
}
