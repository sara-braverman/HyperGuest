import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRolesToMultiple1680000000001 implements MigrationInterface {
  name = 'UpdateUserRolesToMultiple1680000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN roles TEXT`);

    await queryRunner.query(`
      UPDATE users SET roles = 
        CASE 
          WHEN role = 'Admin' THEN '["admin"]'
          WHEN role = 'Editor' THEN '["editor"]'
          WHEN role = 'User' THEN '["regular"]'
          ELSE '["regular"]'
        END
    `);

    await queryRunner.query(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        roles TEXT NOT NULL,
        status INTEGER NULL
      )
    `);

    await queryRunner.query(`
      INSERT INTO users_new (id, username, roles, status)
      SELECT id, username, roles, status FROM users
    `);

    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'User'`);

    await queryRunner.query(`
      UPDATE users SET role = 
        CASE 
          WHEN roles LIKE '%"admin"%' THEN 'Admin'
          WHEN roles LIKE '%"editor"%' THEN 'Editor'
          ELSE 'User'
        END
    `);

    await queryRunner.query(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'User',
        status INTEGER NULL
      )
    `);

    await queryRunner.query(`
      INSERT INTO users_new (id, username, role, status)
      SELECT id, username, role, status FROM users
    `);

    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }
}