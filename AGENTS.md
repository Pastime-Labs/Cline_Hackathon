# Project working rules

These rules apply to all human and AI contributors working in this directory. They are meant to keep the project understandable, reproducible, and safe to publish. Direct instructions from the project owner take precedence. Change this file when the team's actual workflow changes; do not let it become aspirational text that nobody follows.

## 1. General rule: keep one clear source of truth

- Before changing code, read the current product scope, relevant existing code, and this file. Do not implement an older concept simply because it appears in another document.
- Treat product ideas, implementation decisions, and completed behavior as different things. A document proposal is not proof that a feature exists.
- Record decisions that materially change product behavior, data contracts, deployment, or privacy. Update the relevant source document instead of adding a second, conflicting explanation.
- Keep work in small, coherent changes. A change should have a clear reason, a bounded set of files, and a way to tell whether it worked.
- Do not leave half-built features looking complete. Mark prototypes, demo data, simulated users, and unsupported flows clearly.
- Prefer a simple solution the team can operate over a complex one that only looks impressive in a diagram.

## 2. Directory and file hygiene

### Keep the root intentional

The repository root should contain only top-level project files: README, contributor/agent rules, license if chosen, configuration, package/lock files, and a small number of active source documents. Put application code, reusable components, tests, scripts, assets, and detailed documentation in clearly named directories once those exist. Do not create parallel folders such as new-app, final-app, final-final, backup2, or copied-project.

- Preserve the supplied problem statement and existing concept documents unless the owner explicitly decides to archive or remove them. If moving a document, repair every relative link to it.
- Use descriptive names and a consistent convention. Avoid spaces and version suffixes in source filenames unless a format requires them.
- Put screenshots, demo fixtures, and exported artifacts in dedicated directories; do not scatter them across the root.
- Keep local databases, uploads, caches, build output, coverage reports, logs, editor files, and temporary downloads out of version control.
- Do not commit large videos or generated archives merely to store them somewhere. Link to an appropriate shared location if they are needed for the hackathon submission. Keep small, intentional demo assets in the repo with a clear purpose and usage rights.
- Before adding a file, ask what it is for, where it belongs, and whether an existing file should be updated instead.

### Ignore runtime files before they appear

Create and review a .gitignore before the first code commit. It should cover the actual stack's dependency and build folders, local environment files, caches, coverage, logs, temporary files, local database files, and uploaded user content. Keep an environment example file with names and harmless placeholders; never put real secrets in it. **Commit the chosen dependency lockfile.** Do not ignore it as “generated.”

If a file was already tracked, adding it to .gitignore does not untrack it. Remove it from Git's index deliberately, confirm local data remains intact, and review the staged diff before committing.

## 3. Code organisation and change discipline

- Give each module one clear responsibility. Keep pricing and other business rules separate from UI components, storage adapters, and AI prompts.
- Define shared types and validation once. Do not maintain slightly different versions of the same item, quote, listing, or request shape in different features.
- Validate untrusted input at server boundaries. Client-side validation improves usability but is not an authorization or integrity control.
- Keep secrets and privileged data access on the server. Browser code must not import server-only modules or receive private keys.
- Make money, units, dates, and state transitions explicit. Avoid floating-point money calculations, implicit timezone assumptions, and ambiguous “price” fields.
- Keep AI outputs advisory unless verified by deterministic rules or a human. Record the source of a quote, rate, or factual claim. A model must not invent a buyer, price, measurement, or completed transaction.
- Fix the cause of a problem at its owning layer. Avoid copying a workaround into several routes or screens.
- Do not combine an unrelated refactor or dependency upgrade with a product change unless the change actually needs it.
- Comment on non-obvious reasons and constraints. Prefer clear names over comments that merely restate the code.

## 4. Dependencies and configuration

- Use the smallest dependency set that supports the product. Check whether the framework or standard library already solves the need.
- Commit the package manifest and lockfile together. Use the package manager represented by that lockfile consistently.
- Pin the project runtime/toolchain to a documented version or range that the team has actually used. Record setup and startup commands in README.
- Review new dependencies for maintenance, license, transitive size, and security alerts. Avoid installing a second library that duplicates an existing one.
- Update dependencies deliberately, in reviewable groups, and record any breaking change. Do not run blind “upgrade everything” commands during integration or demo preparation.
- Keep provider IDs, model IDs, endpoints, and credentials in configuration. Do not hardcode a personal account or demo-only value into business logic.
- Provide a working path when optional AI credentials are absent, and label that mode accurately. Never claim live AI worked when the app used a fixture or fallback.

## 5. Tests and verification

Testing should prove the behavior that matters, especially where a mistake would misprice an item, expose contact information, or make a false match.

- Add focused automated checks for deterministic rules such as money arithmetic, eligibility, matching, expiry, authorization, and state transitions when those rules are implemented or changed.
- Test boundary cases: missing/invalid input, zero or negative quantities, unit mismatch, expired rates, conflicting updates, duplicate requests, unknown facts, and AI failure.
- Keep tests deterministic. Use small controlled fixtures, frozen time where needed, and an isolated test database or temporary directory. Never run tests against personal or production data.
- Prefer a few meaningful checks to a large suite of shallow snapshot tests. Do not mock away the calculation or persistence behavior a test claims to prove.
- Run the relevant checks for a code change when verifying it; expand to type checking, linting, build, and the full suite before merging or submitting a release. For documentation-only edits, review links and content rather than running unrelated application tests.
- Record the exact command and result in the pull request or handoff. Do not report “passing” based on an earlier commit, an unrun test, or a hidden mock.
- Keep a short manual walkthrough for the full seller-to-buyer journey, including a narrow screen, empty/error states, and two distinct user sessions when those flows exist.
- A failing or flaky test is work to resolve or clearly disclose; do not disable a check merely to produce a green badge.

## 6. Git hygiene

### Before the first commit

- Decide the repository boundary and initialize Git **once** at that root. Check for nested repositories before adding files.
- Add .gitignore, README, a harmless environment example, and the lockfile before staging application code.
- Inspect the file list and staged diff for secrets, private contact details, runtime databases, uploads, build output, and accidental large binaries.

### Day-to-day work

- Keep the default branch usable. Work on short-lived branches named for the change, such as feature/quote-breakdown or fix/listing-validation.
- When two developers work in parallel, use separate branches and preferably separate checkouts. Agree who owns shared schemas, package files, and migrations before editing them.
- Commit one coherent change at a time with an imperative message that says what changed, such as “Add buyer rate eligibility rules.” Do not use “final,” “misc,” or “fix stuff.”
- Stage intentionally by file or hunk, then inspect the staged diff. Avoid sweeping in every untracked file without review.
- Check Git status before and after a commit. Resolve merge conflicts by understanding both sides; never choose one side blindly or commit conflict markers.
- Do not rewrite or force-push shared branch history. If a personal branch must be rebased, coordinate with anyone using it and use the safer force-with-lease form rather than an unconditional force push.
- Never delete a teammate's branch, worktree, untracked files, or local data as “cleanup” without confirming ownership and a recoverable path.
- Keep generated files out of commits unless the project requires them for reproducibility. Do not commit a built application just because it exists locally.

### If a secret is exposed

Stop using it and revoke or rotate it first. Remove it from current files, assess whether it entered Git history or a remote, and coordinate history cleanup if necessary. Simply deleting the line in a later commit does not remove the leaked credential from history. Follow [GitHub's guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## 7. GitHub repository hygiene

- Make README useful to a new teammate and a hackathon judge: problem, product, current limitations, architecture, prerequisites, setup, configuration names, run commands, test commands, demo data, and Cline's actual role.
- Use issues for concrete work or bugs when coordination needs them. Give each issue an observable outcome; close obsolete or duplicate issues instead of letting them mislead contributors.
- Use pull requests for reviewable changes. The description should explain **what changed, why, how it was checked, any data/security impact, and known limits**. Link a relevant issue or design decision when one exists.
- Keep pull requests small enough for a teammate to review. Show screenshots or a short recording when UI behavior changes. Do not upload private user data into PRs.
- Require a teammate's review when one is available, especially for pricing, permissions, data handling, workflows, and deployment changes. A reviewer should inspect behavior and assumptions, not just approve a green CI badge.
- Protect the default branch once the repository and CI exist: block force pushes and deletion, require passing checks, and require PR review if that fits the team's access and schedule. Do not configure a required check before it reliably exists or create a rule that leaves both team members unable to merge. [GitHub branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
- Enable GitHub's available dependency alerts, secret scanning, and push protection for a public repository. Treat an alert as a task to triage, not a badge to ignore. [GitHub security settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-security-and-analysis-settings-for-your-repository).
- Grant collaborators only the access they need. Remove unused access and stale branches after integration. Do not publish a private key, personal phone number, or real user photo to make the demo look convincing.
- Tags and releases should point to a known working state. A release note should state what is included and what is still simulated or unsupported.

## 8. CI pipeline rules

Add CI when application code and repeatable commands exist. Start with **one small workflow** for pull requests and the default branch:

1. Check out the commit.
2. Set up the documented runtime and use the committed lockfile.
3. Install dependencies reproducibly.
4. Run formatting/lint, type check, focused tests, and production build as the project supports them.

Keep the workflow fast enough that developers use it. Cache dependencies through the package manager's supported mechanism, not by committing dependency folders. Give the workflow the minimum token permissions, normally read access to repository contents. Do not expose provider or deployment secrets to pull-request code. Avoid privileged pull-request triggers for ordinary CI; GitHub documents the risk of running untrusted code with elevated access. Pin third-party actions to reviewed full commit SHAs when setting up the workflow, and update them deliberately. [GitHub Actions security guidance](https://docs.github.com/en/actions/reference/security/secure-use), [workflow permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [Node CI guide](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).

- Keep job names stable and distinct if branch protection depends on them.
- Do not make a red build green by skipping failing commands, weakening assertions, or hiding errors.
- Do not upload runtime databases, private photos, credentials, or verbose logs containing sensitive input as CI artifacts.
- Review workflow-file changes as carefully as code changes; CI can read secrets and publish artifacts if misconfigured.

## 9. Deployment and release rules

There is no reason to create a deployment pipeline until a deployable target, environment, and owner exist. CI and CD are separate decisions.

When deployment is introduced:

- Use separate development/staging and production configuration. Store secrets in the hosting platform's secret store; never commit them or expose them through browser-prefixed variables.
- Deploy a reviewed commit or release tag, not an ambiguous local working directory. Ensure the same build can be reproduced from the repository.
- Run migrations with a rollback or recovery plan. Back up persistent data before a destructive schema change. Never point a demo reset script at production data.
- Verify the deployed app's key user journey and health before declaring success. Keep a rollback path to the previous working release.
- Make production deployment an explicit, controlled step. A green pull request must not automatically receive production secrets or publish to production.
- Record version, date, environment, and material limitations in the release note. If a real buyer network or live AI provider is absent, say so.

## 10. Data, privacy, and demo integrity

- Use fictional demo accounts and contact details unless real participants have agreed to their use. Keep real user data out of the public repository, CI logs, screenshots, and video.
- Store uploads outside publicly served directories by default; reveal only the images and facts deliberately included in a listing. Do not expose an exact home address or private receipt in a public item page.
- Keep a clear distinction between seller-declared condition, AI-observed details, buyer-entered rates, provisional quotes, and verified final outcomes.
- Reject unsupported file types and unreasonable upload sizes. Never use a user-provided path directly for reading or writing files.
- Give local data a documented reset procedure that names the exact target and preserves source files. Do not use broad recursive cleanup commands against a computed path.
- Retain only data needed for the current workflow. Before opening the service to real users, review consent, retention, access, deletion, and the applicable rules with someone responsible for the rollout.

## 11. Lightweight checkpoints

**Before starting work:** read current decisions; identify the owner of affected files; inspect Git status; know the acceptance condition.  
**Before committing:** inspect staged diff; check ignored/generated files and secrets; verify the relevant behavior; write a clear commit message.  
**Before merging:** review the PR, current CI result, migrations, permissions, docs, and demo impact; resolve comments.  
**Before publishing or deploying:** confirm the exact commit, credentials, demo-data labels, required hackathon artifacts, and rollback/recovery path.

These checkpoints are meant to prevent avoidable mistakes. Keep them short in practice and update them when real project experience shows a better way.
