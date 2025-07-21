import { SupabaseResponse } from "./supabase-types";

// MockInsertBuilder クラス
export class MockInsertBuilder {
  private tab;
  private mockData: Record<string, any[]>;
  private dataToInsert: any;
  private options: {
    returning?: boolean;
    onConflict?: string;
  } = { returning: true };

  constructor(table: string, mockData: Record<string, any[]>, data: any) {
    this.table = table;
    this.mockData = mockData;
    this.dataToInsert = data;
  }

  returning(value: boolean | string = true): MockInsertBuilder {
    this.options.returning = value !== false;
    return this;
  }

  onConflict(column: string): MockInsertBuilder {
    this.options.onConflict = column;
    return this;
  }

  async execute(): Promise<SupabaseResponse<any[]>> {
    try {
      if (!this.mockData[this.table]) {
        this.mockData[this.table] = [];
      }

      const dataArray = Array.isArray(this.dataToInsert)
        ? this.dataToInsert
        : [this.dataToInsert];

      const insertedItems: any[] = [];

      // 実際のデータベースに挿入する代わりに、モックデータに追加
      for (const item of dataArray) {
        // onConflict オプションの処理
        if (this.options.onConflict) {
          const conflictColumn = this.options.onConflict;
          const existingIndex = this.mockData[this.table].findIndex(
            (existing) => existing[conflictColumn] === item[conflictColumn],
          );

          if (existingIndex >= 0) {
            // 既存のアイテムを更新
            this.mockData[this.table][existingIndex] = {
              ...this.mockData[this.table][existingIndex],
              ...item,
            };
            insertedItems.push(this.mockData[this.table][existingIndex]);
            continue;
          }
        }

        // 新しいアイテムを追加
        const newItem = { ...item };
        this.mockData[this.table].push(newItem);
        insertedItems.push(newItem);
      }

      return {
        data: this.options.returning ? insertedItems : [],
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

// MockUpdateBuilder クラス
export class MockUpdateBuilder {
  private table: string;
  private mockData: Record<string, any[]>;
  private dataToUpdate: any;
  private filters: Array<(item: any) => boolean> = [];
  private options: {
    returning?: boolean;
  } = { returning: true };

  constructor(table: string, mockData: Record<string, any[]>, data: any) {
    this.table = table;
    this.mockData = mockData;
    this.dataToUpdate = data;
  }

  eq(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  gt(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] > value);
    return this;
  }

  gte(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] >= value);
    return this;
  }

  lt(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] < value);
    return this;
  }

  lte(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] <= value);
    return this;
  }

  in(column: string, values: any[]): MockUpdateBuilder {
    this.filters.push((item) => values.includes(item[column]));
    return this;
  }

  is(column: string, value: any): MockUpdateBuilder {
    if (value === null) {
      this.filters.push((item) => item[column] === null);
    } else if (value === true) {
      this.filters.push((item) => Boolean(item[column]) === true);
    } else if (value === false) {
      this.filters.push((item) => Boolean(item[column]) === false);
    }
    return this;
  }

  returning(value: boolean | string = true): MockUpdateBuilder {
    this.options.returning = value !== false;
    return this;
  }

  async execute(): Promise<SupabaseResponse<any[]>> {
    try {
      if (!this.mockData[this.table]) {
        return {
          data: [],
          error: null,
        };
      }

      const tableData = this.mockData[this.table];
      const updatedItems: any[] = [];

      // フィルタに一致するアイテムを更新
      for (let i = 0; i < tableData.length; i++) {
        let matchesAllFilters = true;

        for (const filter of this.filters) {
          if (!filter(tableData[i])) {
            matchesAllFilters = false;
            break;
          }
        }

        if (matchesAllFilters) {
          tableData[i] = { ...tableData[i], ...this.dataToUpdate };
          updatedItems.push(tableData[i]);
        }
      }

      return {
        data: this.options.returning ? updatedItems : [],
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

// MockDeleteBuilder クラス
export class MockDeleteBuilder {
  private table: string;
  private mockData: Record<string, any[]>;
  private filters: Array<(item: any) => boolean> = [];
  private options: {
    returning?: boolean;
  } = { returning: true };

  constructor(table: string, mockData: Record<string, any[]>) {
    this.table = table;
    this.mockData = mockData;
  }

  eq(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  gt(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] > value);
    return this;
  }

  gte(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] >= value);
    return this;
  }

  lt(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] < value);
    return this;
  }

  lte(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] <= value);
    return this;
  }

  in(column: string, values: any[]): MockDeleteBuilder {
    this.filters.push((item) => values.includes(item[column]));
    return this;
  }

  is(column: string, value: any): MockDeleteBuilder {
    if (value === null) {
      this.filters.push((item) => item[column] === null);
    } else if (value === true) {
      this.filters.push((item) => Boolean(item[column]) === true);
    } else if (value === false) {
      this.filters.push((item) => Boolean(item[column]) === false);
    }
    return this;
  }

  returning(value: boolean | string = true): MockDeleteBuilder {
    this.options.returning = value !== false;
    return this;
  }

  async execute(): Promise<SupabaseResponse<any[]>> {
    try {
      if (!this.mockData[this.table]) {
        return {
          data: [],
          error: null,
        };
      }

      const tableData = this.mockData[this.table];
      const deletedItems: any[] = [];
      const newTableData: any[] = [];

      // フィルタに一致するアイテムを削除
      for (const item of tableData) {
        let matchesAllFilters = true;

        for (const filter of this.filters) {
          if (!filter(item)) {
            matchesAllFilters = false;
            break;
          }
        }

        if (matchesAllFilters) {
          deletedItems.push({ ...item });
        } else {
          newTableData.push(item);
        }
      }

      // 更新されたテーブルデータを設定
      this.mockData[this.table] = newTableData;

      return {
        data: this.options.returning ? deletedItems : [],
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
