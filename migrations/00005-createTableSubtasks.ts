import type { Sql } from 'postgres';
import { z } from 'zod';

export type Subtask = {
  id: number;
  taskId: number;
  textContent: string;
  checked: boolean;
};

export const subtaskSchema = z.object({
  taskId: z.number(),
  text_content: z.string().min(1).max(40),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE subtasks (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      task_id integer NOT NULL REFERENCES tasks (id) ON DELETE cascade,
      text_content varchar(40) NOT NULL,
      checked boolean DEFAULT FALSE NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE subtasks`;
}
