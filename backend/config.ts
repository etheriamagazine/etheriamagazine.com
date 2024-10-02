import { ConfigError } from './errors';

export function makeEnvReader(env: NodeJS.ProcessEnv) {
    return function readEnv(key: string) {
        if (!Object.hasOwn(env, key)) {
            throw new ConfigError(
                `Missing environment variable '${key}'. Please configure the app!`
            );
        }
        return env[key];
    };
}
