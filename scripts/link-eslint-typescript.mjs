// typescript-eslint cannot run on TypeScript 7.
//
// TS7 is the native (Go) compiler: its root export exposes only `version` and
// `versionMajorMinor`. The JS compiler API that typescript-eslint reads off
// `require('typescript')` (ts.Extension, ts.TypeFlags, ts.createSourceFile, ...)
// is gone, so the parser throws at load time. No typescript-eslint release
// supports TS7 yet, and npm cannot install a second `typescript` for just part
// of the tree (peer overrides hoist to the root and collide).
//
// So: the root `typescript` stays at 7 for `tsc` and `next build`, and the
// packages that need the old JS API get a symlink to the `typescript-5` alias
// dependency (a real, lockfile-tracked typescript 5.9.x) nested where Node's
// resolution finds it first.
//
// Delete this script, its postinstall hook, the `typescript-5` devDependency,
// and the typescript overrides once typescript-eslint ships TS7 support.

import { existsSync, mkdirSync, rmSync, symlinkSync, cpSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modules = join(root, 'node_modules');
const source = join(modules, 'typescript-5');

// Every package that reads the TypeScript JS API during linting. `next` is
// deliberately absent: Next 16.3 detects that TS7 has no API and shells out to
// the tsc CLI instead, so it must keep resolving the root typescript@7.
const consumers = [
  '@typescript-eslint',
  'typescript-eslint',
  'ts-api-utils',
  'eslint-plugin-import',
];

if (!existsSync(source)) {
  // Nothing to link against (e.g. --omit=dev). Linting is a dev-only concern.
  process.exit(0);
}

const version = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8')).version;

for (const consumer of consumers) {
  const base = join(modules, consumer);
  if (!existsSync(base)) continue;

  const target = join(base, 'node_modules', 'typescript');
  mkdirSync(dirname(target), { recursive: true });
  rmSync(target, { recursive: true, force: true });

  try {
    symlinkSync(source, target, 'junction');
  } catch {
    // Symlinks can be unavailable (Windows without developer mode, some CI
    // sandboxes). A copy resolves identically, just costs disk.
    cpSync(source, target, { recursive: true });
  }
}

console.log(`linked typescript@${version} for typescript-eslint (root stays on 7.x)`);
