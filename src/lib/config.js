const envNames = {
    development: 'local',
    test: 'test',
    production: 'prod',
    prod: 'prod',
    default: 'default',
};


const getEnvConfig = env => {
    return require(`../config/config.${envNames[env] || 'prod'}`).default;
}

/**
 * 获取环境配置，使用传入的env配置覆盖default中已有的配置
 * @param {string} env 
 * @returns 
 */
export function getConfig(env) {
    const envConfig = getEnvConfig(env);
    const defaultConfig = getEnvConfig('default');
    return Object.assign({}, defaultConfig, envConfig);
}