import * as BeginningCountry from "@/components/beginning-country";

export default function BeginningCountryPage() {
  // TODO: 本来的には現在のユーザーの userId と zodiacSign を取得して渡す
  // モックデータを使用して表示
  return (
    <BeginningCountry.BeginningCountryContainer
      userId="mock-user-id"
      zodiacSign="Scorpio"
    />
  );
}
