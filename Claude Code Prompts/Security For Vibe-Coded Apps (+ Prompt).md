# **Security Breakdown + My Comprehensive Audit Prompt 👋** 

_My goal is to get you good at building secure apps! To that end, learning a bit about security is tantamount. In this doc, I’ll teach you the five low-hanging fixes to patch in most vibe coded apps. I’ll also give you an end-to-end, comprehensive audit prompt you can plug into Gemini 3.1 Pro/Claude at the bottom of this document._ 

_PS—if you like this sort of thing, try Maker School. Customer #1 guaranteed. 👋_ 

_–_ 

~45% of AI-generated code will introduce major security vulnerabilities. 83% of exposed Supabase databases involved Row Level Security misconfigurations (very basic!)  Also, in January 2025, over 170 apps built with Lovable were found to have **completely exposed databases.** 

There are apps getting hacked every day (OpenClaw, various federal agencies, various sensitive data providers). So this matters quite a bit, and will likely continue to matter more as agents get good at both the building _and_ the hacking. 

The good news is that security for vibe-coded apps is honestly pretty simple once you understand the 80/20. You don't need to become a cybersecurity expert, just know the handful of low hanging fruit that most people attack and make sure your AI doesn't skip them. 

That's what this module is. The 80/20 of auth and security for vibe coders! 

## **The 80/20 of vibe coding security** 

~80% of security problems in vibe-coded apps come from five things: 

1. Exposed environment variables and API keys. 

2. Missing or broken Row Level Security (RLS) on your database. 

3. No server-side validation (trusting the frontend for everything). 

4. Using outdated or hallucinated packages. 

5. Not having proper authentication middleware. 

If you fix these five things, you are ahead of pretty much everyone vibe coding right now. It is not perfect (no security ever is) but it will allow you to launch apps without feeling like a fraud, or needlessly endangering people’s credentials. 

I will also give you a simple prompt you can use to checklist your app during/after development to ensure you don’t make these mistakes. 

## **1. Environment variables and secret management** 

In a nutshell, lots of people will hardcode authentication tokens/secrets/environment variables into their code. This is kind of like putting your password on a sticky note and attaching it to your computer. Very dumb! Also, lots of hackers/etc will just go through your website/app and look for 

hardcoded mentions of “NEXT_PUBLIC_”, which is a common string prefix before a key. 

You don’t do this anymore. Instead, you put them all in a file, like a .env, and then reference them using “imports”. You also change the name of the code that imports any keys, to obfuscate and prevent people from running simple ctrl+f and finding sections of code that contain keys. 

Anyway, the exact syntax is unimportant, but by doing it this way, you never have the actual key in plaintext in a file, which fixes a really low hanging fruit. 

## **2. Row level security (RLS)** 

If you're using Supabase (which most vibe coders are rn), **Row Level Security** is probably the single most important security feature you need to add. 

In simple terms, without RLS, anyone who has your Supabase URL and anon key (which are public, by design) can read, write, and delete every single row in your database. Just how Supabase works by default. 

RLS on the other hand, is the thing that says "hey, User A can only see User A's data."  Which makes sense. It isn’t enabled by default for some reason, though imo it should be. But you can just turn this on and fix like 90% of errors. 

PS—83% of exposed Supabase databases involve RLS misconfigurations. And AI tools will often create tables without enabling RLS, or enable it without actually adding policies, which makes every query return empty results and looks like a bug instead of a security issue. Luckily you can just click “enable” and it will be fine. 

## **3. Server-side validation** 

Big issue AI does frequently: it puts **validation** on the frontend. If you didn’t know what this meant, it does logic like “the form checks that the email is valid and the password is 8 characters" directly in the code that is exposed to users (which you can access in network requests). 

Then on the server side it just trusts whatever comes in. Which is a glaring security flaw, since anyone with basic developer tools can bypass frontend validation entirely. They can open the browser console, call your API directly with curl, or use a tool like Postman. 

Luckily, this is a similarly easy fix. You just tell your AI model to validate everything on the server. E.g if your app expects an email to sign it up, you just validate that it's actually an email on the **server** , not on the frontend of your app. 

## **4. Dependency/package security** 

When AI generates code, it will sometimes references packages that don't exist. As in, your AI will just make up a package name. It happens less often now with good models, but still ~5% of AI-generated code contains references to nonexistent packages. 

The funny part is attackers know this. They will create malicious packages with those exact made-up names, and then when your AI goes to install the package, it installs their malware, which usually executes things like “give Nick all of your API keys”. 

Also: AI tends to reference older versions of libraries or use deprecated APIs. This means you might be pulling in packages with known security vulnerabilities that were patched months or years ago. So you must ensure you get updated packages as often as possible. 

## **5. Authentication middleware** 

Maybe you've now got login working and users can sign up. Great! But part of an app is making sure that every “protected” page and every “API route” actually checks whether the user is logged in first before allowing them access. 

A lot of vibe coded apps don’t! And what happens is you end up with some pages that check auth and some that don't. E.g maybe your dashboard checks, but your settings page doesn't. And then an attacker will just go to your settings page and change whatever the heck they want (or run up your API bill lol). 

You can avoid this by just ensuring middleware secures all routes. 

## **Some bonuses** 

The five things above cover like 80% of what you need. But if you want to go further, here are the other things that are worth knowing about: 

### **Rate limiting** 

If you have API routes that do expensive things (calling OpenAI, sending emails, etc.), add rate limiting. Because without it, someone can spam your endpoint and rack up a huge bill on your account. Libraries like @upstash/ratelimit or a simple Redis-based solution work well. Prompt below includes this. 

### **CORS Configuration** 

Cross-Origin Resource Sharing basically controls which domains can call your API. By default, the most popular framework’s (Next.js) API routes don't have CORS restrictions when called server-side. Easy fix as well. 

### **File Upload Security** 

If your app handles file uploads, you should have your agent set up a script that validates the file type and size on the server side. Don't trust the file extension. Some people upload files that look like one thing but are actually another thing. 

## **Security audit prompt** 

Below is a prompt you can copy and paste directly into Claude to have it audit your entire codebase for security issues. It's designed specifically for vibe-coded apps using the typical stack (Next.js, Supabase, TypeScript) although it will work regardless for most things. 

Just paste this into a new Claude conversation, and it'll go through your codebase systematically. I've structured it as a checklist so you can track what's been reviewed. The prompt asks Claude to output findings in a specific format that makes it easy to prioritize fixes. 

**Obviously, AI security reviews aren't perfect** . They're good at catching common patterns but can miss complex cross-file vulnerabilities or business logic issues. If you really wanted to be super sure, you would actually manually go through each 

file, check your database, etc. But the whole point of vibe-coding is sacrificing some precision for speed, so YMMV. 

Basically: do not take this as a legal, binding agreement from me to you that your app will be 100% secure if you use the prompt! No app ever is. Just shades of grey. 

Here's the prompt: 

_=== SECURITY AUDIT PROMPT (COPY EVERYTHING BELOW THIS LINE) ===_ 

_<role>_ 

_You are a senior application security engineer specializing in_ 

_AI-generated codebases. You have deep expertise in the OWASP Top 10, CWE database, and the specific vulnerability patterns introduced by_ 

_LLM code generation (hallucinated packages, missing server-side_ 

_validation, default-open database policies, hardcoded secrets, and inconsistent auth middleware)._ 

_You are conducting a comprehensive security audit of a vibe-coded web application. "Vibe-coded" means this application was primarily built using AI coding assistants like Claude, Cursor, Copilot, or similar_ 

_tools. These tools produce functional code fast but routinely introduce_ 

_security gaps that a human developer would typically catch._ 

_Your job is to find every one of those gaps._ 

_</role>_ 

_<methodology>_ 

_Work through the codebase in two passes:_ 

_PASS 1 — DISCOVERY_ 

_Read the entire codebase before making any findings. Build a mental model of the architecture: framework, database, auth provider, API layer, deployment config. Identify every entry point (pages, API routes, server actions, webhooks, cron jobs). Map the data flow from user input to database and back._ 

_PASS 2 — SYSTEMATIC AUDIT_ 

_Work through each section of the checklist below. For every checklist item, do one of three things:_ 

_👋 PASS   — The codebase handles this correctly. Cite the file/line._ 

_👋 FAIL   — A vulnerability exists. Document it fully (see format)._ 

_⚠️ PARTIAL — Some coverage but gaps remain. Explain what's missing._ 

_⬚ N/A    — Not applicable to this codebase. State why briefly._ 

_Do not skip items. Do not summarize groups of items together. Every single checklist item gets its own explicit verdict._ 

_</methodology>_ 

_<output_format>_ 

_For every 👋 FAIL finding, use this exact structure:_ 

|_┌─────────────────────────────────────────────────────────┐_<br>_FINDING #[number]_<br>_│_<br>_│_<br>_├──────────┬──────────────────────────────────────────────┤_|
|---|
|_Severity  CRITICAL / HIGH / MEDIUM / LOW_<br>_│_<br>_│_<br>_│_|
|_Category  e.g., Secret Exposure, Missing RLS, etc._<br>_│_<br>_│_<br>_│_|
|_Location  file/path.ts:line_number_<br>_│_<br>_│_<br>_│_|
|_CWE       CWE-XXX (Name)_<br>_│_<br>_│_<br>_│_|



|_├──────────┴──────────────────────────────────────────────┤_<br>_What's wrong:_<br>_│_<br>_│_|
|---|
|_[Plain English description of the vulnerability]_<br>_│_<br>_│_|
|_│_<br>_│_|
|_Why it matters:_<br>_│_<br>_│_|
|_[What an attacker could actually do with this]_<br>_│_<br>_│_|
|_│_<br>_│_|
|_The vulnerable code:_<br>_│_<br>_│_|
|_```_<br>_│_<br>_│_|
|_[exact code snippet]_<br>_│_<br>_│_|
|_```_<br>_│_<br>_│_|
|_│_<br>_│_|
|_The fix:_<br>_│_<br>_│_|
|_```_<br>_│_<br>_│_|
|_[corrected code snippet, ready to copy/paste]_<br>_│_<br>_│_|
|_```_<br>_│_<br>_│_|
|_│_<br>_│_|
|_Effort: ~[X] minutes_<br>_│_<br>_│_<br>_└─────────────────────────────────────────────────────────┘_|



_</output_format>_ 

_<audit_checklist>_ 

_## Section 1: Environment Variables And Secret Management_ 

_Search every file in the codebase for each of the following. This includes source files, config files, scripts, and any .env files_ 

_that may have been committed to the repository._ 

_- [ ] 1.1 — Hardcoded secrets: Search for API keys, tokens, passwords, connection strings, and webhook URLs embedded directly in source code. Common patterns to grep for:_ 

_sk_live_, sk_test_, sk-, pk_live_,_ 

_Bearer, eyJ (base64 JWT prefix),_ 

_ghp_, gho_, github_pat_,_ 

_xoxb-, xoxp- (Slack tokens),_ 

_AKIA (AWS access keys),_ 

_any 32+ character alphanumeric strings in quotes_ 

- _[ ] 1.2 — .gitignore coverage: Verify that .env, .env.local,_ 

- _.env.production, and .env*.local are all in .gitignore. Check_ 

_git history for any previously committed .env files (even if_ 

_since removed, secrets in git history are still exposed)._ 

- _[ ] 1.3 — Public prefix leaks: Check that server-only secrets do_ 

_NOT use framework public prefixes. In Next.js, anything with NEXT_PUBLIC_ is bundled into client JavaScript and visible to_ 

_anyone. In Vite, the prefix is VITE_. In Create React App, it_ 

_is REACT_APP_. Keys that must NEVER be public-prefixed include:_ 

- _Database service role keys_ 

- _Stripe secret keys_ 

- _OpenAI / Anthropic API keys_ 

- _SMTP credentials_ 

- _Any key that grants write/admin access_ 

- _[ ] 1.4 — Console/error leaks: Search for console.log, console.error,_ 

_and error boundary components that might print environment_ 

_variables or secrets to the browser console or to client-visible_ 

_error messages._ 

- _[ ] 1.5 — Build artifact exposure: Check if source maps are enabled_ 

_in production (next.config.js productionBrowserSourceMaps,_ 

_vite sourcemap config, etc). Source maps let anyone reconstruct_ 

_your original source code including any inlined secrets._ 

- _[ ] 1.6 — Startup validation: Verify the app fails fast if required_ 

_environment variables are missing, rather than silently running_ 

_with undefined values (which often causes cryptic runtime errors_ 

_or, worse, falls back to insecure defaults)._ 

_## Section 2: Database Security_ 

_If the app uses Supabase, Firebase, or any database with client-side_ 

_access, this section is critical. If using a traditional server-only_ 

_database (e.g., Prisma with PostgreSQL, no client-side SDK), adapt_ 

_checks accordingly and note the architecture._ 

- _[ ] 2.1 — RLS enabled: Verify Row Level Security is enabled on_ 

_EVERY table in the public schema. Check for any tables created_ 

_via migrations or SQL editor that might have been missed. A_ 

_single unprotected table exposes all its data to anyone with_ 

_the anon key._ 

- _[ ] 2.2 — RLS policies exist: A table with RLS enabled but NO_ 

_policies silently returns empty results for all queries. This looks like a bug, not a security issue, and is a common AI_ 

_mistake. Verify every RLS-enabled table has at least SELECT and INSERT policies._ 

_- [ ] 2.3 — WITH CHECK clauses: Verify all INSERT and UPDATE policies include WITH CHECK clauses. Without WITH CHECK on INSERT, a user can insert rows with any user_id (impersonating other users). Without WITH CHECK on UPDATE, a user can change a_ 

_row's user_id to steal ownership._ 

- _[ ] 2.4 — Policy identity source: Ensure RLS policies use_ 

_auth.uid() for identity, NOT auth.jwt()->'user_metadata'._ 

_User metadata can be modified by authenticated end users,_ 

_making it an unreliable identity source._ 

- _[ ] 2.5 — Service role key isolation: The service_role key bypasses_ 

_all RLS. Verify it is NEVER used in client-side code, never_ 

_imported in components, and only used in server-side code where RLS bypass is genuinely necessary (admin operations, webhooks)._ 

_- [ ] 2.6 — Storage bucket policies: If using Supabase Storage, verify storage buckets have RLS policies. By default, storage buckets are publicly accessible._ 

_- [ ] 2.7 — SQL injection: Check for any raw SQL queries using string concatenation or template literals instead of parameterized queries. The Supabase client library is safe by default, but raw .rpc() calls or pg/postgres.js queries may not be._ 

_- [ ] 2.8 — SECURITY DEFINER functions: Check for any database functions marked SECURITY DEFINER. These run with the privileges of the function creator (usually superuser), not the calling user. Verify they don't expose data or bypass RLS._ 

_## Section 3: Authentication And Session Management_ 

- _[ ] 3.1 — Auth middleware exists: Verify authentication middleware_ 

- _(e.g., Next.js middleware.ts, Express middleware, etc.) exists_ 

_and runs on protected routes. Check the matcher config to ensure it covers all necessary paths._ 

- _[ ] 3.2 — Default-deny routing: Check whether the middleware_ 

_protects routes by default (allowlist of public routes) vs. protecting routes by exception (blocklist of protected routes). Default-deny (allowlist) is significantly safer because new_ 

_routes are automatically protected._ 

- _[ ] 3.3 — getUser() vs getSession(): For Supabase apps, verify_ 

_that security-sensitive server-side operations use_ 

_supabase.auth.getUser() (which validates the JWT against Supabase servers) rather than supabase.auth.getSession()_ 

_(which only reads the local JWT without verification)._ 

- _[ ] 3.4 — Auth callback handler: Verify the /auth/callback route_ 

_(or equivalent) properly exchanges auth codes for sessions,_ 

_handles errors gracefully, and doesn't expose tokens in URLs_ 

_or logs._ 

- _[ ] 3.5 — Session storage: Verify session tokens are stored in_ 

_httpOnly cookies, NOT in localStorage or sessionStorage (which_ 

_are accessible to any JavaScript on the page, including XSS_ 

_payloads)._ 

- _[ ] 3.6 — Protected API routes: Check that EVERY API route_ 

_handling user data verifies authentication before processing._ 

_Look for API routes that skip the auth check entirely,_ 

_especially ones that AI may have added later in development._ 

- _[ ] 3.7 — OAuth security: If OAuth is implemented, verify callback_ 

_URLs are validated, state parameters are used for CSRF_ 

_protection, and tokens are handled securely._ 

- _[ ] 3.8 — Password reset flows: If applicable, verify reset tokens_ 

_expire, are single-use, and are transmitted securely._ 

_## Section 4: Server-Side Validation_ 

- _[ ] 4.1 — Schema validation: Verify all API routes and server_ 

_actions validate input using a schema validation library (Zod,_ 

_Yup, Valibot, ArkType, etc.) on the server side. Frontend_ 

_validation is UX, not security. Every input must be re-checked_ 

_server-side._ 

- _[ ] 4.2 — Identity from session: Verify user identity for write_ 

_operations is ALWAYS derived from the authenticated session or_ 

_JWT token, never from request body fields like { userId: "..." }._ 

_An attacker can send any userId they want in a request body._ 

- _[ ] 4.3 — Input sanitization: Check that user-generated content rendered in HTML is properly sanitized to prevent Cross-Site Scripting (XSS). Look for dangerouslySetInnerHTML, v-html,_ 

_[innerHTML], or unescaped template literals that render user_ 

_content._ 

- _[ ] 4.4 — HTTP method enforcement: Verify state-changing operations_ 

_use POST/PUT/PATCH/DELETE, not GET. GET requests can be triggered_ 

_by image tags, link prefetching, and browser extensions without_ 

_user intent._ 

- _[ ] 4.5 — Error information leaks: Verify error responses don't_ 

_leak internal details (stack traces, SQL errors, file paths,_ 

_environment variable names) to the client. Check both API_ 

_routes and error boundary components._ 

- _[ ] 4.6 — Webhook signature verification: If the app receives_ 

_webhooks (Stripe, GitHub, etc.), verify it validates the_ 

_webhook signature before processing. Without verification,_ 

_anyone can send fake webhook events to your endpoint._ 

_## Section 5: Dependency And Package Security_ 

- _[ ] 5.1 — Audit results: Run the package manager's audit command_ 

_(npm audit, pnpm audit, yarn audit, bun audit) and report any_ 

_vulnerabilities found, grouped by severity._ 

- _[ ] 5.2 — Hallucinated packages: Check for any installed packages_ 

_with suspiciously low download counts, very recent publish_ 

_dates, or names that don't match well-known packages. AI tools_ 

_sometimes hallucinate package names, and attackers publish_ 

_malware under those names._ 

- _[ ] 5.3 — Lockfile committed: Verify a lockfile (package-lock.json,_ 

_pnpm-lock.yaml, yarn.lock, bun.lockb) is committed to the_ 

_repository. Without it, npm install can silently pull different_ 

_(potentially compromised) versions._ 

- _[ ] 5.4 — Outdated packages: Check for outdated packages,_ 

_especially those with known CVEs. Pay particular attention to_ 

_auth libraries, crypto libraries, and framework versions._ 

- _[ ] 5.5 — Unused dependencies: AI tends to install packages it_ 

_ends up not using. Each unused package is unnecessary attack_ 

_surface. Check for packages in package.json that aren't_ 

_imported anywhere in the codebase._ 

_## Section 6: Rate Limiting_ 

- _[ ] 6.1 — Expensive operations: Identify all API routes that call_ 

_external paid APIs (OpenAI, Anthropic, Stripe, email/SMS_ 

_providers, etc.) and verify they have rate limiting. Without_ 

_it, an attacker can spam the endpoint and run up a massive_ 

_bill on the developer's account._ 

_- [ ] 6.2 — Auth endpoints: Verify login, signup, password reset, and OTP endpoints have rate limiting to prevent brute force attacks and credential stuffing._ 

- _[ ] 6.3 — Implementation check: If rate limiting exists, verify_ 

_it's applied server-side (not just frontend debouncing) and uses a reliable backing store (Redis, Upstash, or similar) rather than in-memory storage that resets on deploy._ 

_## Section 7: CORS Configuration_ 

- _[ ] 7.1 — API route CORS: If the app exposes API routes intended only for its own frontend, verify CORS headers restrict access_ 

_to the app's own domain(s). Check for Access-Control-Allow-_ 

_Origin: * on sensitive endpoints._ 

_- [ ] 7.2 — Credentials mode: If CORS is configured, verify Access-Control-Allow-Credentials is only true when paired with specific (not wildcard) origins._ 

_## Section 8: File Upload Security_ 

_- [ ] 8.1 — Server-side validation: If the app handles file uploads, verify file type and size are validated on the server, not just the frontend. Check MIME type, not just file extension (users can rename malware.exe to photo.jpg)._ 

- _[ ] 8.2 — Storage permissions: Verify uploaded files are stored_ 

_with appropriate access controls. Public uploads (profile_ 

_photos) and private uploads (documents) should have different_ 

_policies._ 

- _[ ] 8.3 — Execution prevention: Verify uploaded files cannot be_ 

_executed on the server. Check that upload directories are not_ 

_in the web root's executable path._ 

_</audit_checklist>_ 

_<final_report>_ 

_After completing all checklist items, compile your findings into this_ 

_structure:_ 

_## 1. Security Posture Rating_ 

_Rate the overall codebase:_ 

_👋 CRITICAL — Active data exposure or auth bypass. Stop and fix now._ 

🟠 _NEEDS WORK — Significant gaps that would be exploitable._ 

🟡 _ACCEPTABLE — Minor issues, no immediate data exposure risk._ 

🟢 _STRONG — Well-secured with only informational findings._ 

_Include a one-paragraph executive summary explaining the rating._ 

_## 2. Critical And High Findings_ 

_List all CRITICAL and HIGH severity findings here for immediate_ 

_visibility, even though they appear in the section-by-section results above. These are the "stop everything and fix this" items._ 

_## 3. Quick Wins_ 

_List fixes that take under 10 minutes each but meaningfully improve security posture. These are satisfying to knock out and build momentum._ 

_## 4. Prioritized Remediation Plan_ 

_A numbered list of ALL findings ordered by:_ 

_1st — Severity (critical before high before medium before low)_ 

_2nd — Effort (quick fixes before complex refactors within each tier)_ 

_For each item, include the estimated fix time so the developer can plan their work._ 

_## 5. What's Already Done Right_ 

_List security measures that are properly implemented. This is important_ 

_because it tells the developer what NOT to accidentally break, and_ 

_reinforces good patterns they should continue using._ 

_## 6. Checklist Summary_ 

_Output a compact summary of every checklist item and its verdict:_ 

_1.1 ⬚ 1.3 👋  1.4 👋  1.5 ⚠️  1.6 👋...  1.2 👋_ 

_This gives an at-a-glance view of coverage._ 

_</final_report>_ 

_<instructions>_ 

_Begin the audit now._ 

_Read the full codebase before producing any findings. Understand the_ 

_architecture first. Then work through every checklist item one by one._ 

_Be thorough but practical. Prioritize real, exploitable vulnerabilities over theoretical concerns. If a finding requires a specific, unusual attacker capability, note that in the severity assessment._ 

_Do not group multiple checklist items into a single response. Each item gets its own explicit pass/fail/partial/n-a verdict._ 

_If you are uncertain about a finding, flag it as ⚠️ PARTIAL and_ 

_explain what you'd need to verify._ 

_</instructions>_ 

_=== END OF SECURITY AUDIT PROMPT ===_ 

