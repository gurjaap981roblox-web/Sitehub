/**
 * SiteHub Persistent Database & Session Store
 * Manages sessions, encrypted GitHub connections, repository associations, and sync history.
 * Atomic file-backed persistence ensures multi-user isolation across server restarts on Render.
 */

import fs from 'fs';
import path from 'path';

export interface SessionRecord {
  id: string;
  userId: string;
  oauthState?: string;
  oauthStateExpiresAt?: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface GitHubConnectionRecord {
  userId: string;
  githubUserId: number;
  username: string;
  avatarUrl: string;
  encryptedAccessToken: string;
  scopes: string[];
  connectedAt: string;
  updatedAt: string;
}

export interface RepoAssociationRecord {
  id: string;
  userId: string;
  siteId: string;
  repoOwner: string;
  repoName: string;
  repoFullName: string;
  defaultBranch: string;
  htmlUrl: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface SyncHistoryRecord {
  id: string;
  repoFullName: string;
  commitSha: string;
  commitMessage: string;
  commitUrl: string;
  branch: string;
  filesCount: number;
  timestamp: string;
  status: 'success' | 'failed';
  errorDetails?: string;
}

interface DatabaseSchema {
  sessions: Record<string, SessionRecord>;
  connections: Record<string, GitHubConnectionRecord>; // keyed by userId
  repos: Record<string, RepoAssociationRecord>; // keyed by siteId
  syncHistory: SyncHistoryRecord[];
}

export class DatabaseStore {
  private static instance: DatabaseStore;
  private dbPath: string;
  private data: DatabaseSchema;
  private isLoaded: boolean = false;

  private constructor() {
    const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create data directory, using current directory:', err);
      }
    }
    this.dbPath = path.join(dataDir, 'sitehub_db.json');
    this.data = {
      sessions: {},
      connections: {},
      repos: {},
      syncHistory: [],
    };
    this.load();
  }

  static getInstance(): DatabaseStore {
    if (!DatabaseStore.instance) {
      DatabaseStore.instance = new DatabaseStore();
    }
    return DatabaseStore.instance;
  }

  private load(): void {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to load database from disk, initializing fresh:', err);
    }
    this.isLoaded = true;
  }

  private save(): void {
    try {
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.dbPath);
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  // Session Management
  createSession(sessionId: string, userId: string): SessionRecord {
    const now = new Date().toISOString();
    const session: SessionRecord = {
      id: sessionId,
      userId,
      createdAt: now,
      lastActiveAt: now,
    };
    this.data.sessions[sessionId] = session;
    this.save();
    return session;
  }

  getSession(sessionId: string): SessionRecord | null {
    const session = this.data.sessions[sessionId];
    if (!session) return null;
    session.lastActiveAt = new Date().toISOString();
    return session;
  }

  setOAuthState(sessionId: string, state: string, expiresInMs: number = 600000): void {
    let session = this.getSession(sessionId);
    if (!session) {
      session = this.createSession(sessionId, `user-${Date.now()}`);
    }
    session.oauthState = state;
    session.oauthStateExpiresAt = Date.now() + expiresInMs;
    this.save();
  }

  verifyAndConsumeOAuthState(stateToVerify: string): { valid: boolean; session?: SessionRecord } {
    const now = Date.now();
    for (const [id, session] of Object.entries(this.data.sessions)) {
      if (session.oauthState === stateToVerify) {
        const isExpired = !session.oauthStateExpiresAt || session.oauthStateExpiresAt < now;
        // Clean up the used state to prevent replay attacks
        delete session.oauthState;
        delete session.oauthStateExpiresAt;
        this.save();

        if (isExpired) {
          return { valid: false };
        }
        return { valid: true, session };
      }
    }
    return { valid: false };
  }

  // GitHub Connection Storage
  saveGitHubConnection(conn: GitHubConnectionRecord): void {
    this.data.connections[conn.userId] = conn;
    this.save();
  }

  getGitHubConnection(userId: string): GitHubConnectionRecord | null {
    return this.data.connections[userId] || null;
  }

  deleteGitHubConnection(userId: string): boolean {
    if (this.data.connections[userId]) {
      delete this.data.connections[userId];
      this.save();
      return true;
    }
    return false;
  }

  // Repository Associations
  saveRepoAssociation(record: RepoAssociationRecord): void {
    this.data.repos[record.siteId] = record;
    this.save();
  }

  getRepoAssociation(siteId: string): RepoAssociationRecord | null {
    return this.data.repos[siteId] || null;
  }

  // Sync History
  addSyncHistory(record: SyncHistoryRecord): void {
    this.data.syncHistory.unshift(record);
    if (this.data.syncHistory.length > 200) {
      this.data.syncHistory = this.data.syncHistory.slice(0, 200);
    }
    this.save();
  }

  getSyncHistory(repoFullName?: string): SyncHistoryRecord[] {
    if (!repoFullName) return this.data.syncHistory.slice(0, 20);
    return this.data.syncHistory
      .filter(s => s.repoFullName.toLowerCase() === repoFullName.toLowerCase())
      .slice(0, 20);
  }
}

export const db = DatabaseStore.getInstance();
