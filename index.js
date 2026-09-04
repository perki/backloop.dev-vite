/**
 * @license
 * [BSD-3-Clause](https://github.com/perki/backloop.dev/blob/main/LICENSE)
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * The certificate is loaded inside the hook, not at import time, and through
 * the CommonJS entry rather than the ESM one.
 *
 * Both details matter. `backloop.dev`'s ESM entry awaits the certificate at the
 * top level, so merely importing it fetches — which meant a production `vite
 * build`, that needs no certificate at all, downloaded one; and since Node 22
 * loads vite.config.js with require(), an ESM graph containing a top-level
 * await is refused outright with ERR_REQUIRE_ASYNC_MODULE, so the build did not
 * just waste a request, it failed. `apply: 'serve'` does not help: it gates the
 * hooks, and the import has already run by then.
 *
 * @param {string} [hostname] - the subdomain to serve on
 * @param {number} [port]
 */
function backloop (hostname = 'whatever', port) {
  return {
    name: 'backloop.dev',
    apply: 'serve',
    async config (options) {
      const { httpsOptionsPromise } = require('backloop.dev');
      options.server = options.server || {};
      options.server.host = `${hostname}.backloop.dev`;
      options.server.https = await httpsOptionsPromise();
      options.server.port = port || options.server.port;
    }
  };
}

export default backloop;
