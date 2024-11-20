import type { Sql } from 'postgres';
import { z } from 'zod';

export type Task = {
  id: number;
  userId: number;
  textContent: string;
  checked: boolean;
};

export const taskSchema = z.object({
  text_content: z.string().min(1).max(40),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE tasks (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      text_content varchar(40) NOT NULL,
      checked boolean DEFAULT FALSE NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE tasks`;
}
