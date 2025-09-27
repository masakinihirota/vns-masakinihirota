import * as template from "@/components_sample/template"

/**
 * TemplatePage - ルーティングとコンポーネント分離の最小サンプル
 * components/template/index.ts から一括インポート
 */
export default function TemplatePage() {
	return (
		<main className='max-w-xl mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-6'>Template Sample Page</h1>
			<template.ComponentA />
			<template.ComponentB />
		</main>
	)
}
