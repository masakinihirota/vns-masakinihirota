
import React from "react";
import Component from "@/components/v0/v0_60/26_favorite-works";

const dummyWorks = [
  { id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
  { id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
  { id: "3", title: "進撃の巨人 3期", tier: 2, type: "anime" },
  { id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
  { id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
  { id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
  { id: "22", title: "寄生獣", tier: 2, type: "manga" },
  { id: "23", title: "Dr.クマヒゲ", tier: 3, type: "manga" }
];

const Page26 = () => {
  return (
    <div>
      <h1>26 Favorite Work Components</h1>
      <Component name="マイリスト" works={dummyWorks} />
    </div>
  );
};

export default Page26;
