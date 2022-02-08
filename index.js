/**
 * Created by pooya on 2/8/22.
 */

const Loader = require('./app/lodaer');
const packageInfo = require('./package.json');

const loader = new Loader({
  cwd: __dirname,
  name: packageInfo.name,
  version: packageInfo.version,
});

loader.start().catch((error) => {
  console.error(error);
  process.exit(1);
});
