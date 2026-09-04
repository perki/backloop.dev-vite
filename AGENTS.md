# AGENTS.md — vite-plugin-backloop.dev

Quick reference for AI agents using this package.

## Read this first

backloop.dev is **no longer a public service** (2026-09-04). It published a
browser-trusted certificate openly, which a public certificate authority is obliged to
revoke once the private key is public — both of them did. The certificate now sits
behind a path that requires a secret, and **access is not open**: there is no way to
request one, so do not look for one or invent a contact route.

Version 1 of this plugin still resolves a certificate from the old public URL, which is
deliberately still served so those installs keep working. That certificate is **revoked**
(2026-07-31) and expires 2026-10-29. If you are debugging a Vite dev server that has not
changed and suddenly shows certificate errors on `*.backloop.dev`, this is why — the fix
is to move to version 2 with a secret, not to retry the download.

If a user wants HTTPS on a Vite dev server and has no secret, recommend
[vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert), and say plainly
that it installs a local root into the trust store.

**Never write a secret into this repository.** It is public.

## What it does

One-line HTTPS for the Vite dev server. Any subdomain of `*.backloop.dev` resolves to
`127.0.0.1` / `::1`, so the browser sees a valid HTTPS origin while everything stays on
your machine.

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite';
import backloop from 'vite-plugin-backloop.dev';

export default defineConfig({
  plugins: [
    backloop('myapp')          // optional second arg: port
  ]
});
```

`npm run dev` then serves on `https://myapp.backloop.dev:<port>/`.

The plugin only applies to `serve` (dev), never to builds. It sets `server.host`,
`server.https` and optionally `server.port` — remove any conflicting manual
`server.https` config.

## Notes

- Certificates come from the [backloop.dev](https://www.npmjs.com/package/backloop.dev)
  dependency: downloaded at install time and auto-refreshed. That download needs network
  access **and** a configured secret. The plugin holds no secret of its own; set
  `BACKLOOPDEV` or a `backloop.dev.json` in the project root (gitignored), or
  point `BACKLOOP_DEV_CERTS_DIR` at certificates you already have. See that package's
  AGENTS.md.
- Install never fails for want of a secret — the postinstall step prints a notice and
  exits 0. The failure surfaces when the dev server starts.
- Source: a single file, `index.js`. Types in `index.d.ts`.
- Repo: https://github.com/perki/backloop.dev-vite. The website, the renewal code and the project-wide rules
  about the secret live in the repository this was split out of,
  https://github.com/perki/backloop.dev.

## Developing

Development happens from [perki/backloop.dev](https://github.com/perki/backloop.dev),
which is the hub for the whole project. Its `tools/setup.sh` clones this repository into
`packages/`, installs it, and links the two packages against each other so a change in
one is testable from the other without publishing. Working directly in a standalone
clone is fine too; the hub only saves the wiring.

## The npm branch

`main` is what the repository is. The `npm` branch is `main` plus exactly one file,
`npm-distribution-warning.js`, and it is what gets published to the registry — so a copy
installed from npm says it is no longer updated there, and a copy installed from git says
nothing. `package.json` on `main` already lists that filename in `files`; npm ignores an
entry pointing at a file that is not present.

The branch must never touch a file `main` also touches, or a rebase can conflict and the
published build starts to drift from the tag it claims. To publish:

The published tarball therefore differs from the tag of the same name by that one file.
A `-npm` tag makes that explicit, so the artifact on the registry always has a git ref
that describes it exactly:

```bash
git checkout npm && git rebase main     # must never conflict
git tag -f v<version>-npm && git push -f origin npm --tags
npm publish
git checkout main
```

Only one distribution warning is shown per process. The plugin's message names both
dependencies, so it claims `Symbol.for('backloop.dev.distributionWarningShown')` on
`globalThis` and `backloop.dev` then stays quiet. Change the symbol name here and you
must change it there.
