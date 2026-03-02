import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function TrialButton() {
  const [isTrialMode, setIsTrialMode] = useState(false);

  useEffect(() => {
    // コンポーネントマウント時にローカルストレージから状態を取得
    try {
      const storedTrialState = localStorage.getItem('vns_trial_mode');
      if (storedTrialState) {
        setIsTrialMode(storedTrialState === 'true');
      }
    } catch (e) {
      console.warn('LocalStorageへのアクセスに失敗しました', e);
    }
  }, []);

  const handleToggle = (checked: boolean) => {
    try {
      // 隔離されたお試しデータの設定
      localStorage.setItem('vns_trial_mode', String(checked));

      if (checked) {
        // お試しモード時のモックデータ（ダミーユーザー体験開始等の処理）の初期化
        localStorage.setItem('vns_trial_dummy_data', JSON.stringify({
          active: true,
          timestamp: new Date().toISOString()
        }));
        toast.success("お試しモードを開始しました", {
          description: "※このモード中のデータはブラウザのみに保存され、サーバーには送信されません"
        });
      } else {
        // お試しモード終了時のクリーンアップ
        localStorage.removeItem('vns_trial_dummy_data');
        toast.info("お試しモードを終了しました");
      }
      setIsTrialMode(checked);
    } catch (e) {
      // Storageが一杯、あるいは無効化されている場合の Graceful Degradation と通知
      toast.error('お試し状態の保存に失敗しました', {
        description: 'お使いのブラウザ設定により、お試し機能のデータが保存できない可能性があります。',
      });
      console.error('LocalStorage設定エラー:', e);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="trial-mode-toggle"
        checked={isTrialMode}
        onCheckedChange={handleToggle}
        aria-label="お試しモードの切り替え"
        aria-pressed={isTrialMode}
      />
      <Label
        htmlFor="trial-mode-toggle"
        className="text-sm font-medium cursor-pointer select-none"
      >
        お試し
      </Label>
    </div>
  );
}
