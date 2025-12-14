# Security Update - CVE-2025-55184 & CVE-2025-55183

**Date:** December 11, 2025  
**Status:** ✅ Fixed

## Vulnerabilities Addressed

### CVE-2025-55184 (High Severity - Denial of Service)
- **Impact:** A malicious HTTP request sent to any App Router endpoint can, when deserialized, cause the server process to hang and consume CPU.
- **Affected Versions:** All Next.js versions up to and including 15.5.7
- **Fix:** Updated to Next.js 15.5.8+

### CVE-2025-55183 (Medium Severity - Source Code Exposure)
- **Impact:** A malicious HTTP request sent to any App Router endpoint can return the compiled source code of Server Actions, potentially revealing business logic.
- **Affected Versions:** All Next.js versions up to and including 15.5.7
- **Fix:** Updated to Next.js 15.5.8+

## Changes Made

1. **Updated Next.js:** `15.5.7` → `15.5.9` (installed version includes all security fixes)
2. **Updated eslint-config-next:** `15.5.7` → `15.5.8` (to match Next.js version)

## Project Status

- ✅ **App Router:** This project uses Next.js App Router, which was vulnerable
- ✅ **Server Actions:** No Server Actions (`"use server"`) found in codebase - lower risk for CVE-2025-55183
- ✅ **RSC Endpoints:** All App Router endpoints were vulnerable to DoS attacks (CVE-2025-55184)

## Next Steps

1. **Install the updated packages:**
   ```bash
   npm install
   ```

2. **Test the application:**
   ```bash
   npm run build
   npm run dev
   ```

3. **Deploy the update** to production as soon as possible

## Additional Notes

- These vulnerabilities affect all Next.js sites using the App Router, even if Server Actions are not explicitly used
- The vulnerabilities were discovered through Vercel and Meta's bug bounty program
- There is no evidence these vulnerabilities have been exploited in the wild
- The initial fix for CVE-2025-55184 was incomplete, leading to CVE-2025-67779, which is also addressed in Next.js 15.5.8+

## References

- [Next.js Security Update](https://nextjs.org/blog/security-update-2025-12-11)
- [React Blog - RSC Vulnerabilities](https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components)

