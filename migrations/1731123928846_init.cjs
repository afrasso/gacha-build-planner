/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_users_email ON users(email);

    CREATE TABLE plans (
      id UUID PRIMARY KEY,
      user_id UUID UNIQUE NOT NULL,
      plan_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_plans_user_id ON plans(user_id);
    CREATE INDEX idx_plans_plan_data ON plans USING GIN (plan_data);
    
    -- Add a trigger to update the updated_at column
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_plans_modtime
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS update_plans_modtime ON plans;
    DROP FUNCTION IF EXISTS update_modified_column();
    DROP INDEX IF EXISTS idx_plans_user_id;
    DROP INDEX IF EXISTS idx_plans_plan_data;
    DROP TABLE IF EXISTS plans;
    DROP INDEX IF EXISTS idx_users_email;
    DROP TABLE IF EXISTS users;
  `);
};
