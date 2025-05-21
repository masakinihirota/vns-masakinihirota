// 【Next.js】管理者用ページを Route Groups で実現する
// https://zenn.dev/chot/articles/next-layout-for-admin-page

// getLoginUser や isAdminUser は適当な関数を用意します。

"use server";
import "server-only";
// import { notFound } from "next/navigation";
// import { FC, ReactNode } from "react";

// const Layout: FC<{ children: ReactNode }> = async ({ children }) => {
//   const user = await getLoginUser();

//   if (!isAdminUser(user)) {
//     リダイレクトでもOK
//     return notFound();
//   }

//   return <>{children}</>;
// };

// export default Layout;
