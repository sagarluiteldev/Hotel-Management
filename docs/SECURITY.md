# Security Architecture & Policies

## 1. Threat Model & Mitigations

| Threat | Impact | Mitigation in Grand Haven HMS |
| :--- | :--- | :--- |
| **Brute-Force & Credential Stuffing** | Account takeover via dictionary attacks. | **Sliding-Window Rate Limiter**: 5 attempts/min on sign-in, 3 attempts/10 min on sign-up. Returns HTTP 429 with `Retry-After`. |
| **Session Forgery & Cookie Tampering** | Privilege escalation by modifying client cookies. | **HMAC-SHA256 Signed Tokens**: Cookie payload is cryptographically signed with a 64-char `SESSION_SECRET`. Signature validated with `crypto.timingSafeEqual`. |
| **Cross-Site Scripting (XSS)** | Attacker executes malicious scripts to steal cookies. | **HttpOnly Cookies + Strict CSP**: Session cookie is inaccessible to JavaScript. Content Security Policy restricts script execution to self and trusted domains. |
| **Cross-Site Request Forgery (CSRF)** | Unauthorized actions executed on behalf of authenticated user. | **Origin Verification + SameSite=Lax**: Middleware blocks mutating requests (`POST`, `PATCH`, `DELETE`) with mismatched `Origin` headers. |
| **Clickjacking** | Dashboard framed within an invisible iframe. | **X-Frame-Options: DENY** + `frame-ancestors 'none'` in CSP prevents embedding. |
| **MIME Type Sniffing** | Browser executes non-script files as scripts. | **X-Content-Type-Options: nosniff** enforced across all responses. |
| **Stale Session Abuse** | Compromised token remains valid indefinitely. | **Database Token Versioning**: Signout increments `tokenVersion` in PostgreSQL, instantly invalidating the session across all active devices. |

---

## 2. Cryptographic Standards

- **Password Hashing**: `bcryptjs` with salt work factor = `12`.
- **Session Signing**: `HMAC-SHA256` using constant-time digest comparison.
- **Random Tokens**: Generated using Node.js `crypto.randomUUID()` and `crypto.randomBytes()`.

---

## 3. Vulnerability Reporting

If you discover a potential security issue within this project, please report it via private message or email rather than opening a public issue on GitHub.
