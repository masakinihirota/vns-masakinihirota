import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

// Define type locally if not imported
interface Work {
  id: string;
  title: string;
  author: string | null;
  category: string;
  is_official: boolean;
  status: string;
}

export function WorkList({ works }: { works: Work[] }) {
  if (works.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        作品が見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {works.map((work) => (
        <Card key={work.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-2" title={work.title}>
                {work.title}
              </CardTitle>
              {work.is_official && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  公式
                </Badge>
              )}
            </div>
            {work.author && <CardDescription>{work.author}</CardDescription>}
          </CardHeader>
          <CardFooter className="flex justify-between items-center text-sm text-gray-500">
            <Badge variant="outline">{work.category}</Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
