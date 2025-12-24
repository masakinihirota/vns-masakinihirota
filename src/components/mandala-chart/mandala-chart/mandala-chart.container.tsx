"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MandalaChart } from "./mandala-chart";

export function MandalaChartContainer() {
  const [chartData, setChartData] = useState<string[][]>(() =>
    Array(9)
      .fill(0)
      .map(() => Array(9).fill("")),
  );

  // Example data for demonstration
  const loadExampleData = () => {
    const exampleData = Array(9)
      .fill(null)
      .map(() => Array(9).fill(""));

    // Center theme
    exampleData[4][4] = "Personal Growth";

    // Main topics
    exampleData[1][4] = "Career";
    exampleData[4][1] = "Health";
    exampleData[7][4] = "Relationships";
    exampleData[4][7] = "Finance";

    // Subtopics for Career
    exampleData[0][3] = "Skills";
    exampleData[0][4] = "Goals";
    exampleData[0][5] = "Network";
    exampleData[1][3] = "Learning";
    exampleData[1][5] = "Projects";
    exampleData[2][3] = "Mentors";
    exampleData[2][4] = "Promotion";
    exampleData[2][5] = "Balance";

    setChartData(exampleData);
  };

  const clearData = () => {
    setChartData(
      Array(9)
        .fill(0)
        .map(() => Array(9).fill("")),
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Mandala Chart</CardTitle>
        <CardDescription>
          A visual brainstorming tool to organize your ideas and goals
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <Button onClick={loadExampleData} variant="outline">
            Load Example
          </Button>
          <Button onClick={clearData} variant="outline">
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <MandalaChart initialData={chartData} onChange={setChartData} />
      </CardContent>
    </Card>
  );
}
