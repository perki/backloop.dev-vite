/**
 * @license
 * [BSD-3-Clause](https://github.com/perki/backloop.dev/blob/main/LICENSE)
 */

/**
 * Present only on the `npm` branch, which is what gets published to the
 * registry. `main` does not carry it, so a copy installed from git stays quiet
 * — which is the point: seeing this means the project you are in has not moved
 * off npm yet.
 *
 * This file must remain the *only* difference between the two branches.
 */
export function show () {
  console.log('');
  console.log('  ⚠️  vite-plugin-backloop.dev will not be updated on npm anymore,');
  console.log('     and is reserved for private usage.');
  console.log('     Read https://backloop.dev for more details.');
  console.log('');
  console.log('     If you are part of the private team, change your package.json:');
  console.log('');
  console.log('       "vite-plugin-backloop.dev": "git+https://github.com/perki/backloop.dev-vite.git"');
  console.log('       "backloop.dev": "git+https://github.com/perki/backloop.dev-node.git"');
  console.log('');
}
