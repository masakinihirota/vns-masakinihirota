import { format } from "date-fns";
import { ja } from "date-fns/locale";

// Define a flexible type to handle potentially different field names from Drizzle
type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  createdAt?: string;
  created_at?: string;
};

interface PointHistoryProperties {
  transactions: Transaction[];
}

/**
 *
 * @param root0
 * @param root0.transactions
 */
export function PointHistory({ transactions }: PointHistoryProperties) {
  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">履歴はありません。</div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">ポイント履歴</h3>
      <ul className="space-y-2">
        {transactions.map((tx) => {
          const dateString = tx.createdAt || tx.created_at;
          const date = dateString ? new Date(dateString) : new Date();

          return (
            <li
              key={tx.id}
              className="flex justify-between items-center p-3 border rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm"
            >
              <div>
                <div className="font-semibold">{tx.description || tx.type}</div>
                <div className="text-sm text-gray-500">
                  {format(date, "yyyy/MM/dd HH:mm", { locale: ja })}
                </div>
              </div>
              <div
                className={`font-bold ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {tx.amount > 0 ? "+" : ""}
                {tx.amount} pt
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
