# SiteHub — Production GitHub OAuth & Repository Integration Setup Guide

This guide details how to configure and deploy the production-ready GitHub integration for **SiteHub**.

---

## 1. Create a GitHub OAuth App

1. Sign in to your GitHub account and navigate to:
   👉 **[GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)**
2. Click **New OAuth App** (or select an existing app to update).
3. Fill in the application details:
   - **Application name**: `SiteHub` (or your chosen brand name)
   - **Homepage URL**:
     ```
     https://sitehub-lnuh.onrender.com
     ```
   - **Application description**: `Production-grade AI website maker platform with Git synchronization.`
   - **Authorization callback URL** (exact URL):
     ```
     https://sitehub-lnuh.onrender.com/api/authgithub/callback
     ```
     *(Note: `/api/github/callback` is also supported as an alias on the server)*
4. Click **Register application**.
5. Copy your **Client ID**.
6. Under **Client secrets**, click **Generate a new client secret** and copy the secret immediately.

---

## 2. Environment Variables Summary

| Environment Variable | Source / Value | Where Configured | Secret? |
|---|---|---|---|
| `GITHUB_CLIENT_ID` | From GitHub OAuth App page | Render Dashboard | **Yes** |
| `GITHUB_CLIENT_SECRET` | From GitHub OAuth App page | Render Dashboard | **Yes (Critical)** |
| `GITHUB_CALLBACK_URL` | `https://sitehub-lnuh.onrender.com/api/authgithub/callback` | Render Dashboard | No |
| `APP_BASE_URL` | `https://sitehub-lnuh.onrender.com` | Render Dashboard | No |
| `SESSION_SECRET` | 32+ character random string (e.g. `openssl rand -hex 32`) | Render Dashboard | **Yes** |
| `TOKEN_ENCRYPTION_KEY` | 32+ character random string (for AES-256-GCM token encryption) | Render Dashboard | **Yes** |
| `DATABASE_URL` | *(Optional)* PostgreSQL connection string | Render Dashboard | Optional |

> ⚠️ **Security Warning**: Never commit `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`, or `TOKEN_ENCRYPTION_KEY` to GitHub. They must only exist in Render's private Environment settings.

---

## 3. Configuring Environment Variables in Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Select your `SiteHub` web service (`sitehub-lnuh`).
3. Click on **Environment** in the left sidebar.
4. Under **Environment Variables**, add the following keys and their values:
   - `GITHUB_CLIENT_ID` = `(Your GitHub Client ID)`
   - `GITHUB_CLIENT_SECRET` = `(Your GitHub Client Secret)`
   - `GITHUB_CALLBACK_URL` = `https://sitehub-lnuh.onrender.com/api/authgithub/callback`
   - `APP_BASE_URL` = `https://sitehub-lnuh.onrender.com`
   - `SESSION_SECRET` = `(Generate a secure 32+ char secret)`
   - `TOKEN_ENCRYPTION_KEY` = `(Generate a secure 32+ char secret)`
5. Click **Save Changes**. Render will automatically trigger a rolling deploy with the updated environment.

---

## 4. End-to-End User Verification Workflow

### Step 1: Connect Account
1. Open `https://sitehub-lnuh.onrender.com` in your browser.
2. In the top navigation bar, click **Save to GitHub** (or open the GitHub modal).
3. Click **Connect with GitHub**.
4. A secure popup opens to `https://github.com/login/oauth/authorize`.
5. Review the requested `repo` scope (allows repository creation and commits).
6. Click **Authorize SiteHub**.
7. The popup automatically completes the server-side code exchange, encrypts the access token with AES-256-GCM, communicates success via `postMessage`, and closes itself.
8. The SiteHub UI immediately updates to show:
   - Your verified GitHub avatar and username.
   - **● Verified Connected** badge.

### Step 2: Create a Real Repository
1. In the GitHub modal, select **+ Create New Repository**.
2. Type a repository name (e.g., `tandoor-restaurant-site`).
3. Choose **Private Repository** (default) or **Public Repository**.
4. Click **Create on GitHub**.
5. SiteHub calls `POST /api/github/repos/create`, which creates the repository directly in your GitHub profile via the GitHub REST API.

### Step 3: Commit & Push Generated Project Files
1. Enter a commit message (e.g., `feat: initial launch of restaurant website`).
2. Click **Push Real Git Commit**.
3. SiteHub generates the full project file tree:
   - `index.html` (HTML5 entry point)
   - `site.json` (Source-of-truth JSON AST)
   - `README.md` (Detailed Markdown documentation)
   - `.github/workflows/deploy.yml` (GitHub Pages CI/CD workflow)
   - `package.json` (Modern scripts & dependencies)
4. The server sanitizes all file paths (traversal protection), filters secrets, and uses the GitHub Git Data API (`git/blobs` → `git/trees` → `git/commits` → `git/refs`) to create an atomic commit.
5. The UI displays the verified commit SHA and provides a direct link:
   `https://github.com/<your-username>/<repo>/commit/<sha>`

### Step 4: Disconnect & Revoke
1. In the GitHub modal, click **Disconnect**.
2. The server wipes your encrypted token from database storage and terminates the session association.
3. To fully revoke authorization on GitHub, visit:
   `https://github.com/settings/applications` and click **Revoke**.

---

## 5. Troubleshooting & FAQ

| Problem | Cause | Solution |
|---|---|---|
| **"redirect_uri_mismatch"** | Callback URL in GitHub App settings does not match the server request. | In GitHub Developer Settings, ensure the Authorization callback URL is exactly `https://sitehub-lnuh.onrender.com/api/authgithub/callback`. |
| **"GitHub OAuth not configured"** | `GITHUB_CLIENT_ID` or `GITHUB_CLIENT_SECRET` is missing in Render. | Go to Render Dashboard → Environment Variables and verify both variables are saved. |
| **"State verification failed"** | OAuth session expired (state expires in 10 minutes) or was already used. | Click "Connect with GitHub" again to generate a fresh state parameter. |
| **"Repository creation failed: name already exists"** | A repository with that name already exists in your GitHub account. | Enter a different repository name or select it from the "Select Existing" tab. |
| **Iframe Preview Cookies** | Third-party cookie blocking in embedded iframe previews. | The backend sets `SameSite=none; Secure; HttpOnly` cookies and also transfers session ID via `postMessage` to guarantee reliability in all browsers. |
