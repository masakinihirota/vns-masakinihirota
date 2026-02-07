import * as MandalaChart from "../components/mandala-chart/index";

export default function MandalaChartPage() {
  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <MandalaChart.MandalaEditorContainer />
    </div>
  );
}
