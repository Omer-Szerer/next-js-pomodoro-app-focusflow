import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
  CREATE TABLE exercises (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL,
  visualization VARCHAR(250) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category VARCHAR(20) NOT NULL
)
`;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE exercises`;
}
