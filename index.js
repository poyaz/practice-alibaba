/**
 * Created by pooya on 2/8/22.
 */

const fs = require('fs');

const envFile = process.env['ENV_FILE'] || `${__dirname}/env/node/.env`;
const envList = {};

if (process.env['ENABLE_ENV']) {
  try {
    fs.accessSync(envFile, fs.constants.F_OK | fs.constants.R_OK);
    fs.readFileSync(envFile, 'utf8')
      .split(/(\r\n|\n)/)
      .filter((v) => v.match(/^[^#].+/))
      .map((v) => /^([^=]+)=(.*)$/.exec(v))
      .filter((v) => Array.isArray(v))
      .map((v) => ({
        key: v[1],
        value: v[2],
      }))
      .map((v) => (envList[v.key] = v.value));

    process.env = { ...process.env, ...envList };
  } catch (err) {
    console.log(`[WARN] Can't read env file! (address: ${envFile})`);
    console.log(`[INFO] Skip environment`);
  }
}

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
