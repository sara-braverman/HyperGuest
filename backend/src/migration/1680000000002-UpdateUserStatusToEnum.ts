import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserStatusToEnum1680000000002 implements MigrationInterface {
  name = 'UpdateUserStatusToEnum1680000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new status_enum column
    await queryRunner.query(`ALTER TABLE users ADD COLUMN status_enum TEXT DEFAULT 'Enabled'`);

    // Migrate existing boolean status to enum
    await queryRunner.query(`
      UPDATE users SET status_enum = 
        CASE 
          WHEN status = 1 THEN 'Enabled'
          WHEN status = 0 THEN 'Disabled'
          ELSE 'Enabled'
        END
    `);

    // Create new table with enum status
    await queryRunner.query(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        roles TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Enabled'
      )
    `);

    // Copy data to new table
    await queryRunner.query(`
      INSERT INTO users_new (id, username, roles, status)
      SELECT id, username, roles, status_enum FROM users
    `);

    // Drop old table and rename new one
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back boolean status column
    await queryRunner.query(`ALTER TABLE users ADD COLUMN status_bool INTEGER`);

    // Migrate enum status back to boolean
    await queryRunner.query(`
      UPDATE users SET status_bool = 
        CASE 
          WHEN status = 'Enabled' THEN 1
          WHEN status = 'Disabled' THEN 0
          WHEN status = 'Deleted' THEN 0
          ELSE 1
        END
    `);

    // Create new table with boolean status
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
      SELECT id, username, roles, status_bool FROM users
    `);

    // Drop old table and rename new one
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }
}