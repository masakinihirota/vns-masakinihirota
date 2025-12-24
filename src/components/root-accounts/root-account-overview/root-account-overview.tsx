import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type RootAccount = {
  id: string;
  status: "active" | "suspended" | "archived";
  points: number;
  createdAt: Date;
  lastRotatedAt: Date | null;
};

type RootAccountOverviewProps = {
  rootAccount: RootAccount;
};

export function RootAccountOverview({ rootAccount }: RootAccountOverviewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusColor = (status: RootAccount["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "suspended":
        return "destructive";
      case "archived":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Root Account</CardTitle>
        <Badge variant={getStatusColor(rootAccount.status)}>
          {rootAccount.status.charAt(0).toUpperCase() + rootAccount.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Total Points</span>
            <span className="text-2xl font-bold">{rootAccount.points.toLocaleString()} pt</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Account Created</span>
            <span>Created: {formatDate(rootAccount.createdAt)}</span>
          </div>
          {rootAccount.lastRotatedAt && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Last Rotated</span>
              <span>{formatDate(rootAccount.lastRotatedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
