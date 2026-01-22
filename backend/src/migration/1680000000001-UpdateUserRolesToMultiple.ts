import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRolesToMultiple1680000000001 implements MigrationInterface {
  name = 'UpdateUserRolesToMultiple1680000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new roles column
    await queryRunner.query(`ALTER TABLE users ADD COLUMN roles TEXT`);

    // Migrate existing single role to roles array
    await queryRunner.query(`
      UPDATE users SET roles = 
        CASE 
          WHEN role = 'Admin' THEN '["admin"]'
          WHEN role = 'Editor' THEN '["editor"]'
          WHEN role = 'User' THEN '["regular"]'
          ELSE '["regular"]'
        END
    `);

    // Create new table without role column
    await queryRunner.query(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        roles TEXT NOT NULL,
        status INTEGER NULL
      )
    `);

    // Copy data to new table
    await queryRunner.query(`
      INSERT INTO users_new (id, username, roles, status)
      SELECT id, username, roles, status FROM users
    `);

    // Drop old table and rename new one
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back single role column
    await queryRunner.query(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'User'`);

    // Migrate roles array back to single role
    await queryRunner.query(`
      UPDATE users SET role = 
        CASE 
          WHEN roles LIKE '%"admin"%' THEN 'Admin'
          WHEN roles LIKE '%"editor"%' THEN 'Editor'
          ELSE 'User'
        END
    `);

    // Create new table without roles column
    await queryRunner.query(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'User',
        status INTEGER NULL
      )
    `);

    // Copy data to new table
    await queryRunner.query(`
      INSERT INTO users_new (id, username, role, status)
      SELECT id, username, role, status FROM users
    `);

    // Drop old table and rename new one
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }
}