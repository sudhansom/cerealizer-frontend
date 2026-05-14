# Authentication & Secrets — Contributor Guide

This document describes how to authenticate against GitHub for contributing to
the **cereal-api-frontend** repository, and how to handle any personal
credentials safely on your machine.

> ⚠️ **Never commit a real token, password, or other secret to this repository.**
> GitHub's secret scanning will auto-revoke recognised tokens, and once a
> secret lands in git history, removing it is invasive (requires rewriting
> history and force-pushing). Use one of the storage mechanisms below.

---

## TL;DR

- Use the [GitHub CLI](https://cli.github.com/) (`gh`) and run `gh auth login`
  once. Your token will be stored encrypted in your OS keychain (Windows
  Credential Manager / macOS Keychain / `libsecret` on Linux).
- After that, `git push`, `gh pr create`, etc. all "just work" — you should
  never need to type or paste a token again on this machine.

---

## 1. Install the GitHub CLI

| Platform   | Install command                                                   |
| ---------- | ----------------------------------------------------------------- |
| Windows    | `winget install --id GitHub.cli`                                  |
| macOS      | `brew install gh`                                                 |
| Linux      | See <https://github.com/cli/cli/blob/trunk/docs/install_linux.md> |

Verify:

```bash
gh --version
```

## 2. Authenticate (web flow — recommended)

```bash
gh auth login --hostname github.com --git-protocol https --web
```

Follow the prompts:

1. `gh` prints a one-time device code (e.g. `ABCD-1234`) and opens
   <https://github.com/login/device> in your browser.
2. Paste the code and click **Continue**.
3. Click **Authorize github**.
4. Complete 2FA with your authenticator app (6-digit TOTP).
5. The terminal will print `✓ Authentication complete.`

This route never exposes a token value to your shell or clipboard.

### Configure git to share the same credential

```bash
gh auth setup-git
```

After this, plain `git push` / `git fetch` will reuse the `gh` credential —
no separate Git Credential Manager prompt.

## 3. Authenticate with a Personal Access Token (alternative)

Only use this path if you can't complete the web flow (e.g. headless CI).

1. Create a token at <https://github.com/settings/personal-access-tokens>
   (fine-grained, recommended) or
   <https://github.com/settings/tokens> (classic).
2. **Fine-grained** scopes for this repo:
   - Repository access: `Exopi-Talent-Academy/cereal-api-frontend`
   - Permissions:
     - `Contents`: Read and write
     - `Pull requests`: Read and write
     - `Metadata`: Read-only
3. **Classic** scopes (broader, simpler):
   - `repo`
   - `read:org`
   - `workflow`
4. Pick an expiration. **Never** select "No expiration" for a developer PAT —
   90 days is a sensible default.
5. Feed it to `gh` via stdin so it doesn't appear in your shell history:

   ```bash
   # PowerShell
   $token = Read-Host -Prompt "PAT" -AsSecureString
   [System.Net.NetworkCredential]::new("", $token).Password |
     gh auth login --hostname github.com --git-protocol https --with-token

   # bash / zsh
   read -s -p "PAT: " GH_PAT && echo
   echo "$GH_PAT" | gh auth login --hostname github.com --git-protocol https --with-token
   unset GH_PAT
   ```

## 4. Where to store a token if you really need it on disk

In strict order of preference:

1. **Don't.** Let `gh` and your OS keychain do it for you (steps 2–3 above).
2. A reputable password manager (1Password, Bitwarden, KeePassXC, …).
3. A user-scoped environment variable in your shell profile, **never** a
   per-project `.env` file:

   ```powershell
   # PowerShell — persistent for your user account only
   setx GH_TOKEN "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

   ```bash
   # bash / zsh — in ~/.bashrc or ~/.zshrc, with 0600 perms on the file
   export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

4. A `.env` file **outside** any git repository — e.g.
   `~/.config/cerealizer/secrets.env`. Source it manually when you need it.

Locations to **avoid**:

- Any file inside `cereal-api-frontend/` (this repo) or `cereal-api/`.
- Any markdown / text file you might `git add` by mistake.
- Slack, email, chat tools, or shared notes apps.

## 5. If a token is ever exposed

1. Immediately revoke it at <https://github.com/settings/tokens>.
2. Audit recent activity at <https://github.com/settings/security-log>.
3. Generate a new one and re-authenticate `gh`.
4. If the secret was committed, also remove it from history (`git filter-repo`
   or BFG Repo-Cleaner) and force-push — but only after coordinating with the
   team since this invalidates every existing clone and open PR.

## 6. Project-level environment variables

The frontend application itself does not currently read any secrets from
`.env` files; configuration lives in `src/environments/`. If you ever do
introduce a `.env`, double-check the rule in `.gitignore` first and add a
matching placeholder entry to `.env.example` (committed) rather than the
real `.env` (untracked).

---

## Quick reference

| Task                                | Command                                    |
| ----------------------------------- | ------------------------------------------ |
| Log into GitHub                     | `gh auth login`                            |
| Check who you are logged in as      | `gh auth status`                           |
| Log out                             | `gh auth logout --hostname github.com`     |
| Open a PR for the current branch    | `gh pr create --fill`                      |
| Open the PR in the browser          | `gh pr view --web`                         |
| See CI checks on the current PR     | `gh pr checks`                             |
