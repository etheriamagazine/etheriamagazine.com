export function readEnvVars(envVarsMap, env) {
  return Object.entries(envVarsMap).reduce((acc, [configKey, envVar]) => {
    if (!Object.hasOwn(env, envVar)) {
      throw new ConfigError(
        `Missing environment variable '${envVar}'. Please configure the app!`
      );
    }
    return { ...acc, [configKey]: env[envVar] };
  }, {});
}

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigError";
  }
}

export function makeEnvReader(env) {
  return function readEnv(key) {
    if (!Object.hasOwn(env, key)) {
      throw new ConfigError(
        `Missing environment variable '${key}'. Please configure the app!`
      );
    }
    return env[key];
  };
}

export function readVar(envVarsMap, env) {
  return Object.entries(envVarsMap).reduce((acc, [configKey, envVar]) => {
    if (!Object.hasOwn(env, envVar)) {
      throw new ConfigError(
        `Missing environment variable '${envVar}'. Please configure the app!`
      );
    }
    return { ...acc, [configKey]: env[envVar] };
  }, {});
}
