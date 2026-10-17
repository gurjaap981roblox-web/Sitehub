/**
 * GitHub REST API Client
 * Implements official GitHub OAuth exchange, user profile retrieval, repository creation,
 * and Git Data API atomic commit synchronization with path sanitization and secret filtering.
 */

import { getServerConfig } from '../config';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_OAUTH_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_AGENT = 'SiteHub-Platform/1.0';

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  email?: string;
}

export interface CreatedRepoResult {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
  htmlUrl: string;
  cloneUrl: string;
  isPrivate: boolean;
}

export interface SyncCommitResult {
  commitSha: string;
  commitUrl: string;
  branch: string;
  filesCount: number;
  timestamp: string;
}

/**
 * Validates and sanitizes repository names according to GitHub conventions.
 */
export function validateRepoName(name: string): { valid: boolean; sanitized: string; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, sanitized: '', error: 'Repository name is required.' };
  }

  // Remove leading/trailing spaces and invalid characters
  const trimmed = name.trim();
  const sanitized = trimmed.replace(/[^a-zA-Z0-9_.-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');

  if (sanitized.length === 0) {
    return { valid: false, sanitized: '', error: 'Repository name must contain alphanumeric characters.' };
  }

  if (sanitized.length > 100) {
    return { valid: false, sanitized: sanitized.slice(0, 100), error: 'Repository name must be 100 characters or fewer.' };
  }

  if (sanitized === '.' || sanitized === '..') {
    return { valid: false, sanitized: '', error: 'Invalid repository name.' };
  }

  return { valid: true, sanitized };
}

/**
 * Path traversal check and secret filtration for file commits.
 */
export function sanitizeCommitFiles(files: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [rawPath, rawContent] of Object.entries(files)) {
    // 1. Path traversal guard
    if (rawPath.includes('..') || rawPath.startsWith('/') || rawPath.startsWith('\\')) {
      continue;
    }

    // 2. Disallow sensitive files
    const normalized = rawPath.toLowerCase();
    if (
      normalized.includes('.git/') ||
      normalized.includes('.env') ||
      normalized.endsWith('.pem') ||
      normalized.endsWith('.key') ||
      normalized.includes('id_rsa')
    ) {
      continue;
    }

    // 3. Filter sensitive tokens from file contents
    let safeContent = rawContent;
    safeContent = safeContent.replace(/(sk-[A-Za-z0-9_\-]{20,})/g, 'sk-••••••••');
    safeContent = safeContent.replace(/(gh[pousr]_[A-Za-z0-9_]{16,})/g, 'gh_••••••••');

    sanitized[rawPath] = safeContent;
  }

  return sanitized;
}

export class GitHubApiClient {
  /**
   * Exchange OAuth authorization code for an access token.
   */
  static async exchangeCodeForToken(code: string, redirectUri?: string): Promise<{ accessToken: string; scope: string }> {
    const config = getServerConfig();
    if (!config.githubClientId || !config.githubClientSecret) {
      throw new Error('GITHUB_NOT_CONFIGURED: Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET.');
    }

    const effectiveRedirectUri = redirectUri || config.githubCallbackUrl;

    const bodyParams = new URLSearchParams({
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code,
      redirect_uri: effectiveRedirectUri,
    });

    const response = await fetch(GITHUB_OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
      },
      body: bodyParams.toString(),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GitHub token exchange failed (HTTP ${response.status}): ${errText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`GitHub authorization error: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      throw new Error('GitHub returned no access token.');
    }

    return {
      accessToken: data.access_token,
      scope: data.scope || '',
    };
  }

  /**
   * Fetch authenticated GitHub user details.
   */
  static async getAuthenticatedUser(accessToken: string): Promise<GitHubUser> {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': USER_AGENT,
      },
    });

    if (response.status === 401) {
      throw new Error('GITHUB_UNAUTHORIZED: Token expired or revoked.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user from GitHub (HTTP ${response.status})`);
    }

    return await response.json();
  }

  /**
   * List accessible repositories for the authenticated user.
   */
  static async listUserRepositories(accessToken: string): Promise<any[]> {
    const response = await fetch(`${GITHUB_API_BASE}/user/repos?sort=updated&per_page=30`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list repositories (HTTP ${response.status})`);
    }

    const list = await response.json();
    return list.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      htmlUrl: repo.html_url,
      defaultBranch: repo.default_branch || 'main',
      isPrivate: repo.private,
      updatedAt: repo.updated_at,
    }));
  }

  /**
   * Create a new repository in the authenticated user's account.
   */
  static async createRepository(
    accessToken: string,
    options: { name: string; description?: string; isPrivate?: boolean }
  ): Promise<CreatedRepoResult> {
    const validation = validateRepoName(options.name);
    if (!validation.valid) {
      throw new Error(`Validation Error: ${validation.error}`);
    }

    const payload = {
      name: validation.sanitized,
      description: options.description || 'Website generated with SiteHub',
      private: Boolean(options.isPrivate),
      auto_init: true, // initializes with README so default branch exists
    };

    const response = await fetch(`${GITHUB_API_BASE}/user/repos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 422) {
      const errJson = await response.json();
      const message = errJson.errors?.[0]?.message || errJson.message || 'Repository name already exists.';
      throw new Error(`Repository creation failed: ${message}`);
    }

    if (!response.ok) {
      throw new Error(`GitHub repository creation failed (HTTP ${response.status})`);
    }

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      owner: data.owner.login,
      defaultBranch: data.default_branch || 'main',
      htmlUrl: data.html_url,
      cloneUrl: data.clone_url,
      isPrivate: data.private,
    };
  }

  /**
   * Atomic Git commit synchronization: creates blobs, tree, commit, and updates branch ref.
   */
  static async syncProjectFiles(
    accessToken: string,
    owner: string,
    repo: string,
    files: Record<string, string>,
    commitMessage: string,
    targetBranch?: string
  ): Promise<SyncCommitResult> {
    const cleanFiles = sanitizeCommitFiles(files);
    if (Object.keys(cleanFiles).length === 0) {
      throw new Error('No valid files to commit.');
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    };

    // 1. Determine default branch if not provided
    let branch = targetBranch;
    if (!branch) {
      const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
      if (!repoRes.ok) {
        throw new Error(`Repository not accessible: ${owner}/${repo}`);
      }
      const repoData = await repoRes.json();
      branch = repoData.default_branch || 'main';
    }

    // 2. Fetch the latest commit on the branch
    const refRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/${branch}`, { headers });
    let latestCommitSha: string | null = null;
    let baseTreeSha: string | null = null;

    if (refRes.ok) {
      const refData = await refRes.json();
      latestCommitSha = refData.object.sha;

      // Get commit to find base_tree
      const commitRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, { headers });
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        baseTreeSha = commitData.tree.sha;
      }
    }

    // 3. Create Git Blobs for all files
    const treeItems: Array<{ path: string; mode: string; type: string; sha: string }> = [];

    for (const [filePath, content] of Object.entries(cleanFiles)) {
      const blobRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content, encoding: 'utf-8' }),
      });

      if (!blobRes.ok) {
        throw new Error(`Failed to create blob for ${filePath} (HTTP ${blobRes.status})`);
      }

      const blobData = await blobRes.json();
      treeItems.push({
        path: filePath,
        mode: '100644', // standard file
        type: 'blob',
        sha: blobData.sha,
      });
    }

    // 4. Create new Git Tree
    const treePayload: any = { tree: treeItems };
    if (baseTreeSha) {
      treePayload.base_tree = baseTreeSha;
    }

    const treeRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify(treePayload),
    });

    if (!treeRes.ok) {
      throw new Error(`Failed to create Git tree (HTTP ${treeRes.status})`);
    }

    const treeData = await treeRes.json();
    const newTreeSha = treeData.sha;

    // 5. Create new Git Commit
    const commitPayload: any = {
      message: commitMessage || 'chore: sync website updates via SiteHub',
      tree: newTreeSha,
      parents: latestCommitSha ? [latestCommitSha] : [],
    };

    const newCommitRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify(commitPayload),
    });

    if (!newCommitRes.ok) {
      throw new Error(`Failed to create Git commit (HTTP ${newCommitRes.status})`);
    }

    const newCommitData = await newCommitRes.json();
    const commitSha = newCommitData.sha;

    // 6. Update Branch Reference
    if (latestCommitSha) {
      const updateRefRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ sha: commitSha, force: false }),
      });

      if (!updateRefRes.ok) {
        throw new Error(`Failed to update branch reference (HTTP ${updateRefRes.status})`);
      }
    } else {
      // Branch didn't exist yet, create it
      const createRefRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitSha }),
      });

      if (!createRefRes.ok) {
        throw new Error(`Failed to create branch reference (HTTP ${createRefRes.status})`);
      }
    }

    return {
      commitSha,
      commitUrl: `https://github.com/${owner}/${repo}/commit/${commitSha}`,
      branch: branch || 'main',
      filesCount: treeItems.length,
      timestamp: new Date().toISOString(),
    };
  }
}
