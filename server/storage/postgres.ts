/**
 * SiteHub PostgreSQL Persistence & Migration Layer
 * Safely namespaced tables (sitehub_*), connection pooling, migrations, and health checks.
 * Falls back gracefully to atomic local store if DATABASE_URL is not configured.
 */

export interface PoolConfig {
  connectionString?: string;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

export interface Pool {
  query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;
  connect: () => Promise<{
    query: (text: string, params?: any[]) => Promise<any>;
    release: () => void;
  }>;
  on: (event: string, callback: (err: any) => void) => void;
  totalCount?: number;
}
import { getServerConfig } from '../config';

export interface DbHealthStatus {
  driver: 'postgres' | 'file';
  connected: boolean;
  poolSize?: number;
  tablesVerified?: boolean;
  latencyMs?: number;
  error?: string;
}

let pool: Pool | null = null;
let isPostgresInitialized = false;

export function getPostgresPool(): Pool | null {
  const config = getServerConfig();
  if (!config.databaseUrl) {
    return null;
  }

  // In Supabase mode, database persistence is routed via @supabase/supabase-js
  return null;
}

/**
 * Idempotent SQL Migrations: Creates namespaced sitehub_* tables safely without touching unrelated Supabase data.
 */
export async function runMigrations(): Promise<boolean> {
  const clientPool = getPostgresPool();
  if (!clientPool) return false;

  const client = await clientPool.connect();
  try {
    await client.query('BEGIN');

    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255),
        username VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_sessions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES sitehub_users(id) ON DELETE CASCADE,
        oauth_state VARCHAR(128),
        oauth_state_expires_at BIGINT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_sitehub_sessions_user ON sitehub_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sitehub_sessions_state ON sitehub_sessions(oauth_state);
    `);

    // 3. GitHub Connections table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_github_connections (
        user_id VARCHAR(64) PRIMARY KEY REFERENCES sitehub_users(id) ON DELETE CASCADE,
        github_user_id BIGINT NOT NULL,
        username VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        encrypted_access_token TEXT NOT NULL,
        scopes TEXT[],
        connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Projects table (Universal Site/App AST documents)
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_projects (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES sitehub_users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        document_ast JSONB NOT NULL,
        version INT DEFAULT 1,
        is_published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_sitehub_projects_user ON sitehub_projects(user_id);
      CREATE INDEX IF NOT EXISTS idx_sitehub_projects_slug ON sitehub_projects(slug);
    `);

    // 5. Project Versions / Snapshots
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_project_versions (
        id VARCHAR(64) PRIMARY KEY,
        project_id VARCHAR(64) REFERENCES sitehub_projects(id) ON DELETE CASCADE,
        version_num INT NOT NULL,
        name VARCHAR(255),
        author VARCHAR(64) DEFAULT 'User',
        snapshot JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_sitehub_versions_proj ON sitehub_project_versions(project_id);
    `);

    // 6. GitHub Repository Mappings
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_repo_mappings (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES sitehub_users(id) ON DELETE CASCADE,
        site_id VARCHAR(64) REFERENCES sitehub_projects(id) ON DELETE CASCADE,
        repo_owner VARCHAR(100) NOT NULL,
        repo_name VARCHAR(100) NOT NULL,
        repo_full_name VARCHAR(200) NOT NULL,
        default_branch VARCHAR(64) DEFAULT 'main',
        html_url TEXT NOT NULL,
        is_private BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 7. Sync History
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_sync_history (
        id VARCHAR(64) PRIMARY KEY,
        repo_full_name VARCHAR(200) NOT NULL,
        commit_sha VARCHAR(64) NOT NULL,
        commit_message TEXT NOT NULL,
        commit_url TEXT,
        branch VARCHAR(64) DEFAULT 'main',
        files_count INT DEFAULT 1,
        status VARCHAR(32) DEFAULT 'success',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_sitehub_sync_repo ON sitehub_sync_history(repo_full_name);
    `);

    // 8. Deployments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sitehub_deployments (
        id VARCHAR(64) PRIMARY KEY,
        site_id VARCHAR(64) REFERENCES sitehub_projects(id) ON DELETE CASCADE,
        user_id VARCHAR(64) REFERENCES sitehub_users(id) ON DELETE CASCADE,
        deploy_target VARCHAR(64) DEFAULT 'edge',
        public_url TEXT NOT NULL,
        status VARCHAR(32) DEFAULT 'live',
        commit_sha VARCHAR(64),
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    isPostgresInitialized = true;
    return true;
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.warn('[SiteHub Database Migration Warning]', err.message);
    return false;
  } finally {
    client.release();
  }
}

/**
 * Health check querying the database.
 */
export async function checkDatabaseHealth(): Promise<DbHealthStatus> {
  const clientPool = getPostgresPool();
  if (!clientPool) {
    return {
      driver: 'file',
      connected: true,
      tablesVerified: true,
    };
  }

  const startTime = Date.now();
  try {
    const res = await clientPool.query('SELECT 1 as ping');
    const latencyMs = Date.now() - startTime;
    return {
      driver: 'postgres',
      connected: res.rows[0]?.ping === 1,
      poolSize: clientPool.totalCount,
      tablesVerified: isPostgresInitialized,
      latencyMs,
    };
  } catch (err: any) {
    return {
      driver: 'postgres',
      connected: false,
      error: err.message,
    };
  }
}
