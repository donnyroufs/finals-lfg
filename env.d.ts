declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_NAME: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      AUTH_ISSUES_BASE_URL: string;
      AUTH_TOKEN_ALGORITHM: string;
      AUTH_AUDIENCE: string;
      AUTH_PUBLIC_KEY: string;
    }
  }
}

export {}
