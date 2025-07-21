import { SupabaseResponse } from "./supabase-types";

// MockQueryBuilder クラス
export class MockQueryBuilder {
  private table: string;
  prita: Record<string, any[]>;
  private filters: Array<(item: any) => boolean> = [];
  private sortConfig?: { column: string; ascending: boolean };
  private limitCount?: number;
  private rangeConfig?: { from: number; to: number };
  private selectedColumns?: string[];
  private countOption: boolean = false;
  private joinTables: Array<{
    table: string;
    foreignKey: string;
    primaryKey: string;
  }> = [];

  constructor(table: string, mockData: Record<string, any[]>) {
    this.table = table;
    this.mockData = mockData;
  }

  // 基本的なフィルタメソッド
  eq(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  gt(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] > value);
    return this;
  }

  gte(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] >= value);
    return this;
  }

  lt(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] < value);
    return this;
  }

  lte(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] <= value);
    return this;
  }

  // 高度なクエリ操作メソッド
  like(column: string, pattern: string): MockQueryBuilder {
    this.filters.push((item) => {
      const value = String(item[column] || "").toLowerCase();
      const searchPattern = pattern.toLowerCase();

      if (searchPattern.startsWith("%") && searchPattern.endsWith("%")) {
        // 部分一致 (%pattern%)
        const searchTerm = searchPattern.slice(1, -1);
        return value.includes(searchTerm);
      } else if (searchPattern.startsWith("%")) {
        // 後方一致 (%pattern)
        const searchTerm = searchPattern.slice(1);
        return value.endsWith(searchTerm);
      } else if (searchPattern.endsWith("%")) {
        // 前方一致 (pattern%)
        const searchTerm = searchPattern.slice(0, -1);
        return value.startsWith(searchTerm);
      } else {
        // 完全一致
        return value === searchPattern;
      }
    });
    return this;
  }

  ilike(column: string, pattern: string): MockQueryBuilder {
    return this.like(column, pattern); // case-insensitive は like と同じ実装で良い
  }

  in(column: string, values: any[]): MockQueryBuilder {
    this.filters.push((item) => values.includes(item[column]));
    return this;
  }

  is(column: string, value: any): MockQueryBuilder {
    if (value === null) {
      this.filters.push((item) => item[column] === null);
    } else if (value === true) {
      this.filters.push((item) => Boolean(item[column]) === true);
    } else if (value === false) {
      this.filters.push((item) => Boolean(item[column]) === false);
    }
    return this;
  }

  not(column: string, value: any): MockQueryBuilder {
    if (value === null) {
      this.filters.push((item) => item[column] !== null);
    } else {
      this.filters.push((item) => item[column] !== value);
    }
    return this;
  }

  or(filters: string, values: any[]): MockQueryBuilder {
    // 簡易的な OR 実装
    this.filters.push((item) => {
      const conditions = filters.split(",").map((f) => f.trim());
      return conditions.some((condition, index) => {
        const [column, operator] = condition.split(".");
        if (operator === "eq") {
          return item[column] === values[index];
        } else if (operator === "neq") {
          return item[column] !== values[index];
        }
        return false;
      });
    });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder {
    this.sortConfig = {
      column,
      ascending: options?.ascending ?? true,
    };
    return this;
  }

  limit(count: number): MockQueryBuilder {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number): MockQueryBuilder {
    this.rangeConfig = { from, to };
    return this;
  }

  select(columns?: string | string[]): MockQueryBuilder {
    if (columns) {
      this.selectedColumns = Array.isArray(columns)
        ? columns
        : columns.split(",").map((c) => c.trim());
    }
    return this;
  }

  count(columnName?: string): MockQueryBuilder {
    this.countOption = true;
    return this;
  }

  join(foreignTable: string, condition: string): MockQueryBuilder {
    const [primaryKey, foreignKey] = condition.split("=").map((k) => k.trim());
    this.joinTables.push({
      table: foreignTable,
      primaryKey,
      foreignKey,
    });
    return this;
  }

  // 結果取得メソッド
  async execute(): Promise<SupabaseResponse<any[]>> {
    try {
      let data = this.mockData[this.table] || [];

      // フィルタを適用
      for (const filter of this.filters) {
        data = data.filter(filter);
      }

      // JOIN を適用（簡易的な実装）
      if (this.joinTables.length > 0) {
        data = data.map((item) => {
          const result = { ...item };

          for (const join of this.joinTables) {
            const foreignData = this.mockData[join.table] || [];
            const related = foreignData.find(
              (foreign) => foreign[join.foreignKey] === item[join.primaryKey],
            );

            if (related) {
              // 関連データをマージ
              Object.keys(related).forEach((key) => {
                if (key !== join.foreignKey) {
                  result[`${join.table}_${key}`] = related[key];
                }
              });
            }
          }

          return result;
        });
      }

      // ソートを適用
      if (this.sortConfig) {
        data = [...data].sort((a, b) => {
          const aVal = a[this.sortConfig!.column];
          const bVal = b[this.sortConfig!.column];

          let comparison = 0;
          if (aVal < bVal) comparison = -1;
          else if (aVal > bVal) comparison = 1;

          return this.sortConfig!.ascending ? comparison : -comparison;
        });
      }

      // range または limit を適用
      if (this.rangeConfig) {
        data = data.slice(this.rangeConfig.from, this.rangeConfig.to + 1);
      } else if (this.limitCount !== undefined) {
        data = data.slice(0, this.limitCount);
      }

      // カウントオプションの処理
      if (this.countOption) {
        return {
          data: [{ count: data.length }],
          error: null,
        };
      }

      // 選択カラムの適用
      if (this.selectedColumns && this.selectedColumns.length > 0) {
        data = data.map((item) => {
          const result: Record<string, any> = {};
          this.selectedColumns!.forEach((column) => {
            result[column] = item[column];
          });
          return result;
        });
      }

      return {
        data,
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

  async single(): Promise<SupabaseResponse<any | null>> {
    try {
      const result = await this.execute();

      if (result.error) {
        return {
          data: null,
          error: result.error,
        };
      }

      return {
        data: result.data.length > 0 ? result.data[0] : null,
        error: null,
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

  async maybeSingle(): Promise<SupabaseResponse<any | null>> {
    try {
      const result = await this.execute();

      if (result.error) {
        return {
          data: null,
          error: result.error,
        };
      }

      if (result.data.length > 1) {
        return {
          data: null,
          error: {
            message: "Multiple rows returned",
            code: "PGRST116",
            status: 406,
          },
        };
      }

      return {
        data: result.data.length > 0 ? result.data[0] : null,
        error: null,
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
