/**
 * Unified Repository Layer for SiteHub
 * Provides high-level data access for Projects, Versions, Sessions, GitHub Connections,
 * Deployments, and Audit Logs. Supports PostgreSQL and atomic file storage seamlessly.
 */

import { getPostgresPool, runMigrations } from './postgres';
import { DatabaseStore, GitHubConnectionRecord, RepoAssociationRecord, SessionRecord, SyncHistoryRecord } from './db';

export interface ProjectRecord {
  id: string;
  userId: string;
  name: string;
  slug: string;
  category: string;
  documentAst: any;
  version: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentRecord {
  id: string;
  siteId: string;
  userId: string;
  deployTarget: string;
  publicUrl: string;
  status: 'live' | 'building' | 'failed';
  commitSha?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface VersionRecord {
  id: string;
  projectId: string;
  versionNum: number;
  name: string;
  author: string;
  snapshot: any;
  createdAt: string;
}

class UniversalRepository {
  private fileDb: DatabaseStore;

  constructor() {
    this.fileDb = DatabaseStore.getInstance();
    // Initialize PostgreSQL migrations in the background if pool is available
    runMigrations().catch(err => {
      console.warn('[Repository Init Note] PostgreSQL migrations skipped or running in file mode:', err.message);
    });
  }

  // --- SESSIONS ---
  async getSession(sessionId: string): Promise<SessionRecord | null> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        const res = await pool.query('SELECT * FROM sitehub_sessions WHERE id = $1', [sessionId]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            userId: row.user_id,
            oauthState: row.oauth_state,
            oauthStateExpiresAt: row.oauth_state_expires_at ? Number(row.oauth_state_expires_at) : undefined,
            createdAt: row.created_at.toISOString(),
            lastActiveAt: row.last_active_at.toISOString(),
          };
        }
      } catch (err) {
        // Fallback to file store on error
      }
    }
    return this.fileDb.getSession(sessionId);
  }

  async createSession(sessionId: string, userId: string): Promise<SessionRecord> {
    const pool = getPostgresPool();
    const now = new Date().toISOString();
    if (pool) {
      try {
        // Ensure user exists first
        await pool.query(
          'INSERT INTO sitehub_users (id, username) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
          [userId, `user_${userId.slice(-6)}`]
        );
        await pool.query(
          'INSERT INTO sitehub_sessions (id, user_id, created_at, last_active_at) VALUES ($1, $2, $3, $4)',
          [sessionId, userId, now, now]
        );
      } catch (err) {
        // Fallback
      }
    }
    return this.fileDb.createSession(sessionId, userId);
  }

  async setOAuthState(sessionId: string, state: string, expiresInMs: number = 600000): Promise<void> {
    const pool = getPostgresPool();
    const expiry = Date.now() + expiresInMs;
    if (pool) {
      try {
        await pool.query(
          'UPDATE sitehub_sessions SET oauth_state = $1, oauth_state_expires_at = $2 WHERE id = $3',
          [state, expiry, sessionId]
        );
      } catch (err) {
        // Fallback
      }
    }
    this.fileDb.setOAuthState(sessionId, state, expiresInMs);
  }

  async verifyAndConsumeOAuthState(state: string): Promise<{ valid: boolean; session?: SessionRecord }> {
    const pool = getPostgresPool();
    const now = Date.now();
    if (pool) {
      try {
        const res = await pool.query(
          'SELECT * FROM sitehub_sessions WHERE oauth_state = $1',
          [state]
        );
        if (res.rows[0]) {
          const row = res.rows[0];
          const isExpired = row.oauth_state_expires_at && Number(row.oauth_state_expires_at) < now;
          await pool.query(
            'UPDATE sitehub_sessions SET oauth_state = NULL, oauth_state_expires_at = NULL WHERE id = $1',
            [row.id]
          );
          if (!isExpired) {
            return {
              valid: true,
              session: {
                id: row.id,
                userId: row.user_id,
                createdAt: row.created_at.toISOString(),
                lastActiveAt: new Date().toISOString(),
              },
            };
          }
          return { valid: false };
        }
      } catch (err) {
        // Fallback
      }
    }
    return this.fileDb.verifyAndConsumeOAuthState(state);
  }

  // --- GITHUB CONNECTIONS ---
  async saveGitHubConnection(conn: GitHubConnectionRecord): Promise<void> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        await pool.query(
          'INSERT INTO sitehub_users (id, username) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
          [conn.userId, conn.username]
        );
        await pool.query(
          `INSERT INTO sitehub_github_connections (user_id, github_user_id, username, avatar_url, encrypted_access_token, scopes, connected_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (user_id) DO UPDATE SET
             username = EXCLUDED.username,
             avatar_url = EXCLUDED.avatar_url,
             encrypted_access_token = EXCLUDED.encrypted_access_token,
             scopes = EXCLUDED.scopes,
             updated_at = EXCLUDED.updated_at`,
          [
            conn.userId,
            conn.githubUserId,
            conn.username,
            conn.avatarUrl,
            conn.encryptedAccessToken,
            conn.scopes,
            conn.connectedAt,
            conn.updatedAt,
          ]
        );
      } catch (err) {
        // Fallback
      }
    }
    this.fileDb.saveGitHubConnection(conn);
  }

  async getGitHubConnection(userId: string): Promise<GitHubConnectionRecord | null> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        const res = await pool.query(
          'SELECT * FROM sitehub_github_connections WHERE user_id = $1',
          [userId]
        );
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            userId: row.user_id,
            githubUserId: Number(row.github_user_id),
            username: row.username,
            avatarUrl: row.avatar_url,
            encryptedAccessToken: row.encrypted_access_token,
            scopes: row.scopes || ['repo'],
            connectedAt: row.connected_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
          };
        }
      } catch (err) {
        // Fallback
      }
    }
    return this.fileDb.getGitHubConnection(userId);
  }

  async deleteGitHubConnection(userId: string): Promise<boolean> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        await pool.query('DELETE FROM sitehub_github_connections WHERE user_id = $1', [userId]);
      } catch (err) {
        // Fallback
      }
    }
    return this.fileDb.deleteGitHubConnection(userId);
  }

  // --- PROJECTS ---
  async saveProject(project: ProjectRecord): Promise<void> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO sitehub_projects (id, user_id, name, slug, category, document_ast, version, is_published, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             slug = EXCLUDED.slug,
             category = EXCLUDED.category,
             document_ast = EXCLUDED.document_ast,
             version = EXCLUDED.version,
             is_published = EXCLUDED.is_published,
             updated_at = EXCLUDED.updated_at`,
          [
            project.id,
            project.userId,
            project.name,
            project.slug,
            project.category,
            JSON.stringify(project.documentAst),
            project.version,
            project.isPublished,
            project.createdAt,
            project.updatedAt,
          ]
        );
      } catch (err) {
        // Fallback
      }
    }
    // Also save in atomic local cache
    this.fileDb.saveProject(project);
  }

  async getProject(projectId: string): Promise<ProjectRecord | null> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        const res = await pool.query('SELECT * FROM sitehub_projects WHERE id = $1', [projectId]);
        if (res.rows[0]) {
          const row = res.rows[0];
          return {
            id: row.id,
            userId: row.user_id,
            name: row.name,
            slug: row.slug,
            category: row.category,
            documentAst: row.document_ast,
            version: row.version,
            isPublished: row.is_published,
            createdAt: row.created_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
          };
        }
      } catch (err) {
        // Fallback
      }
    }
    return this.fileDb.getProject(projectId);
  }

  // --- REPO MAPPINGS & SYNC ---
  async saveRepoAssociation(record: RepoAssociationRecord): Promise<void> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO sitehub_repo_mappings (id, user_id, site_id, repo_owner, repo_name, repo_full_name, default_branch, html_url, is_private, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [
            record.id,
            record.userId,
            record.siteId,
            record.repoOwner,
            record.repoName,
            record.repoFullName,
            record.defaultBranch,
            record.htmlUrl,
            record.isPrivate,
            record.createdAt,
          ]
        );
      } catch (err) {
        // Fallback
      }
    }
    this.fileDb.saveRepoAssociation(record);
  }

  async addSyncHistory(record: SyncHistoryRecord): Promise<void> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO sitehub_sync_history (id, repo_full_name, commit_sha, commit_message, commit_url, branch, files_count, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            record.id,
            record.repoFullName,
            record.commitSha,
            record.commitMessage,
            record.commitUrl,
            record.branch,
            record.filesCount,
            record.status,
            record.timestamp,
          ]
        );
      } catch (err) {
        // Fallback
      }
    }
    this.fileDb.addSyncHistory(record);
  }

  async getSyncHistory(repoFullName?: string): Promise<SyncHistoryRecord[]> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        let q = 'SELECT * FROM sitehub_sync_history';
        const params: any[] = [];
        if (repoFullName) {
          q += ' WHERE repo_full_name ILIKE $1';
          params.push(repoFullName);
        }
        q += ' ORDER BY created_at DESC LIMIT 25';
        const res = await pool.query(q, params);
        return res.rows.map(row => ({
          id: row.id,
          repoFullName: row.repo_full_name,
          commitSha: row.commit_sha,
          commitMessage: row.commit_message,
          commitUrl: row.commit_url,
          branch: row.branch,
          filesCount: row.files_count,
          status: row.status as 'success' | 'failed',
          timestamp: row.created_at.toISOString(),
        }));
      } catch (err) {
        // Fallback
      }
    }
    return this.fileDb.getSyncHistory(repoFullName);
  }

  // --- DEPLOYMENTS ---
  async recordDeployment(deploy: DeploymentRecord): Promise<void> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO sitehub_deployments (id, site_id, user_id, deploy_target, public_url, status, commit_sha, error_message, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            deploy.id,
            deploy.siteId,
            deploy.userId,
            deploy.deployTarget,
            deploy.publicUrl,
            deploy.status,
            deploy.commitSha,
            deploy.errorMessage,
            deploy.createdAt,
          ]
        );
      } catch (err) {
        // Fallback
      }
    }
    this.fileDb.recordDeployment(deploy);
  }

  async getDeployments(siteId: string): Promise<DeploymentRecord[]> {
    const pool = getPostgresPool();
    if (pool) {
      try {
        const res = await pool.query(
          'SELECT * FROM sitehub_deployments WHERE site_id = $1 ORDER BY created_at DESC LIMIT 20',
          [siteId]
        );
        return res.rows.map(row => ({
          id: row.id,
          siteId: row.site_id,
          userId: row.user_id,
          deployTarget: row.deploy_target,
          publicUrl: row.public_url,
          status: row.status,
          commitSha: row.commit_sha,
          errorMessage: row.error_message,
          createdAt: row.created_at.toISOString(),
        }));
      } catch (err) {
        // Fallback
      }
    }
    return this.fileDb.getDeployments(siteId);
  }
}

export const repository = new UniversalRepository();
