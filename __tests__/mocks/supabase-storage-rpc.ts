import { SupabaseResponse } from "./supabase-types";

// MockRpcBuilder クラス
export class MockRpcBuilder {
  private functionName: string;
  private params: Record<string, any>;
  private mockFunctions: Record<string, (params: any) => any>;

  constructor(
    functionName: string,
    params: Record<string, any>,
    mockFunctions: Record<string, (params: any) => any>,
  ) {
    this.functionName = functionName;
    this.params = params;
    this.mockFunctions = mockFunctions;
  }

  async execute(): Promise<SupabaseResponse<any>> {
    try {
      if (this.mockFunctions[this.functionName]) {
        const result = this.mockFunctions[this.functionName](this.params);
        return {
          data: result,
          error: null,
        };
      }

      return {
        data: null,
        error: {
          message: `Function ${this.functionName} not implemented in mock`,
          status: 404,
        },
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        },
      };
    }
  }
}

// MockStorageBuilder クラス
export class MockStorageBuilder {
  private bucket: string;
  private mockStorage: Record<string, Record<string, Uint8Array>>;

  constructor(
    bucket: string,
    mockStorage: Record<string, Record<string, Uint8Array>>,
  ) {
    this.bucket = bucket;
    this.mockStorage = mockStorage;

    // バケットが存在しない場合は作成
    if (!this.mockStorage[bucket]) {
      this.mockStorage[bucket] = {};
    }
  }

  async upload(
    path: string,
    data: Uint8Array | string,
  ): Promise<SupabaseResponse<{ path: string }>> {
    try {
      let binaryData: Uint8Array;

      if (typeof data === "string") {
        const encoder = new TextEncoder();
        binaryData = encoder.encode(data);
      } else {
        binaryData = data;
      }

      this.mockStorage[this.bucket][path] = binaryData;

      return {
        data: { path },
        error: null,
      };
    } catch (error) {
      return {
        data: { path: "" },
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        },
      };
    }
  }

  async download(path: string): Promise<SupabaseResponse<Uint8Array>> {
    try {
      const data = this.mockStorage[this.bucket][path];

      if (!data) {
        return {
          data: new Uint8Array(),
          error: {
            message: "File not found",
            status: 404,
          },
        };
      }

      return {
        data,
        error: null,
      };
    } catch (error) {
      return {
        data: new Uint8Array(),
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        },
      };
    }
  }

  async remove(
    paths: string[],
  ): Promise<SupabaseResponse<{ paths: string[] }>> {
    try {
      const removedPaths: string[] = [];

      for (const path of paths) {
        if (this.mockStorage[this.bucket][path]) {
          delete this.mockStorage[this.bucket][path];
          removedPaths.push(path);
        }
      }

      return {
        data: { paths: removedPaths },
        error: null,
      };
    } catch (error) {
      return {
        data: { paths: [] },
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        },
      };
    }
  }

  async list(
    prefix?: string,
  ): Promise<SupabaseResponse<{ name: string; id: string; metadata: any }[]>> {
    try {
      const files = Object.keys(this.mockStorage[this.bucket])
        .filter((key) => !prefix || key.startsWith(prefix))
        .map((key) => ({
          name: key,
          id: key,
          metadata: {},
        }));

      return {
        data: files,
        error: null,
      };
    } catch (error) {
      return {
        data: [],
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        },
      };
    }
  }
}
