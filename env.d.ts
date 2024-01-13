declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_NAME: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
    }
  }
}

export {}
