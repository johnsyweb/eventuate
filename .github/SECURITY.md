# Security Policy

## Supported Versions

Only the latest version of Eventuate receives security updates.

## Reporting a Vulnerability

The security of Eventuate is taken seriously. If a security vulnerability is
discovered, it should be reported as described below.

**Security vulnerabilities should not be reported through public GitHub
issues.**

Instead, please report them via email to eventuate.addon@johnsy.com.

A response should be received within 48 hours. If no response is received,
please follow up via email to ensure the original message was received.

The following information should be included in the report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting,
  etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information helps with the triage of the report.

## Security Measures

The following measures are taken to ensure the security of Eventuate:

1. Dependencies are regularly updated to their latest secure versions
2. Code is reviewed for security issues before merging
3. Automated security scanning is performed on pull requests
4. Ad hoc security audits are conducted
5. All user input is validated and sanitised
6. No sensitive data stored

## Security Updates

Security updates are released as soon as possible after a vulnerability is
confirmed. The following process is followed:

1. Receipt of the vulnerability report is acknowledged
2. The problem is confirmed and affected versions are determined
3. Code is audited to find any similar problems
4. Fixes are prepared for all supported versions
5. New versions with security fixes are released
6. The reporter is credited in the release notes (unless anonymity is preferred)

## Best Practices for Users

To help maintain the security of an Eventuate installation:

1. Eventuate should be kept updated to the latest version
2. The operating system and dependencies should be kept up to date
3. The Eventuate GitHub repository should be monitored for security updates

## Contact

Questions about this security policy should be directed to
eventuate.addon@johnsy.com.
