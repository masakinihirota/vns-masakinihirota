import { ReactNode } from "react";

/**
 * 保護されたルート用のレイアウト
 * 認証チェックはproxy.tsで実施済み
 * このlayoutではUIのみを提供
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
