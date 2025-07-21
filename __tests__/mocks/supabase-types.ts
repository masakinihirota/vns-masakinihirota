// Supabaseモック用の型定義

// レスポンス型
export interface SupabaseResponse<T> {
  data: T;
  error: null | {
    message: string;
    status?: number;
    code?: string;
    details?: string;
  };
}

// ユーザー型
export interface MockUser {
  id: string;
  email: string;
  aud: string;
  role: string;
  email_confirmed_at: string;
  created_at: string;
  updated_at: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

// セッション型
export interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: MockUser;
}

// 認証状態型
export interface MockAuthState {
  user: MockUser | null;
  session: MockSession | null;
  setSession(session: MockSession | null): void;
  signInWithPassword(credentials: {
    email: string;
    password: string;
  }): Promise<any>;
  signInWithOtp(credentials: { email: string }): Promise<any>;
  signInWithOAuth(credentials: { provider: string }): Promise<any>;
  signUp(credentials: { email: string; password: string }): Promise<any>;
  signOut(): Promise<any>;
  resetPasswordForEmail(email: string): Promise<any>;
  updateUser(attributes: { password?: string }): Promise<any>;
  getSession(): Promise<any>;
  getUser(): Promise<any>;
  refreshSession(): Promise<any>;
}

// モックSupabaseクライアント型
export interface MockSupabaseClient {
  from(table: string): any;
  rpc(functionName: string, params?: Record<string, any>): any;
  storage(bucket: string): any;
  auth: {
    signInWithPassword(credentials: {
      email: string;
      password: string;
    }): Promise<any>;
    signInWithOtp(credentials: { email: string }): Promise<any>;
    signInWithOAuth(credentials: { provider: string }): Promise<any>;
    signUp(credentials: { email: string; password: string }): Promise<any>;
    signOut(): Promise<any>;
    resetPasswordForEmail(email: string): Promise<any>;
    updateUser(attributes: { password?: string }): Promise<any>;
    getSession(): Promise<any>;
    getUser(): Promise<any>;
    refreshSession(): Promise<any>;
    onAuthStateChange(callback: (event: string, session: any) => void): any;
  };
  _setMockData(table: string, data: any[]): void;
  _getMockData(table: string): any[];
  _setMockFunction(name: string, impl: (params: any) => any): void;
  _clearMockData(): void;
  _setAuthState(state: {
    user?: MockUser | null;
    session?: MockSession | null;
  }): void;
}
