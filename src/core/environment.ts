interface EnvironmentKey {
  JWT_PRIVATE_KEY: string;
  JWT_EXPIRATION_TIME: string;
  NODE_ENV: string;
  HIVE_SECRET: string;
  AWS_S3_BUCKET: string;
  AWS_DEFAULT_REGION: string;
  AWS_S3_BUCKET_URL: string;
}

export class Environment {
  static get<T extends keyof EnvironmentKey>(key: T): EnvironmentKey[T] {
    return process.env[key] as T;
  }

  static isDevelopment(): boolean {
    return process.env.NODE_ENV == "development";
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV == "production";
  }

  static isNotProduction(): boolean {
    return !this.isProduction();
  }
}
