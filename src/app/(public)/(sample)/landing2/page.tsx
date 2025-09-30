import {
	ArrowRight,
	Compass,
	Layers,
	ShieldCheck,
	Sparkles,
	Users
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"

import type { ComponentType, SVGProps } from "react"

type FeatureHighlight = {
	icon: ComponentType<SVGProps<SVGSVGElement>>
	title: string
	description: string
	cta?: { label: string; href: string }
}

const featureHighlights: FeatureHighlight[] = [
	{
		icon: Sparkles,
		title: "価値観ファーストの出会い",
		description:
			"作品と価値観の回答から0〜100のスコアを算出し、期待度を4段階で可視化。個人情報に頼らない安心感を提供します。",
		cta: { label: "マッチングを見る", href: "/match" }
	},
	{
		icon: Layers,
		title: "プロフィールを使い分け",
		description:
			"目的別に最大4つのプロフィールを作成し、名刺・履歴書・フル表示を切り替えながら自在にマッチング体験。",
		cta: { label: "プロフィール一覧", href: "/profiles" }
	},
	{
		icon: Compass,
		title: "最小限のオンボーディング",
		description:
			"地域・言語・世代・オアシス宣誓をモーダルで設定すると、ルートアカウントと初期状態が自動生成されます。",
		cta: { label: "初期設定へ", href: "/onboarding" }
	},
	{
		icon: Users,
		title: "だれでも試せるデモ体験",
		description:
			"認証前でもダミープロフィールと簡易マッチングを閲覧可能。保存なしで体験でき、価値を素早く確認できます。",
		cta: { label: "ダミー体験", href: "/browse" }
	}
]

const onboardingSteps = [
	{
		number: "Step 1",
		title: "価値観の宣言",
		description:
			"地球3分割・母語・UI言語・世代・オアシス宣誓を設定。これがマッチングの初期軸になります。"
	},
	{
		number: "Step 2",
		title: "プロフィール作成",
		description:
			"目的（work/friend/marriage/end_of_life/other）と状態を選び、作品＆価値観を紐づけて準備完了。"
	},
	{
		number: "Step 3",
		title: "スコア確認",
		description:
			"Tierや重要回答でブーストされたスコアを確認し、Highランクの候補から対話を始めましょう。"
	}
]

const safetyCommitments = [
	"誹謗中傷・個人情報詮索を禁止し、オアシス宣言を全ユーザーに適用",
	"公式シード作品とRLSで守られたユーザーデータを段階的に公開",
	"OAuth + 冪等リセットで、安心して体験と初期化を繰り返せる設計"
]

const valueMetrics = [
	{ label: "保存レスなダミー体験", value: "3シナリオ" },
	{ label: "公式作品シード", value: "100件" },
	{ label: "自動保存される候補", value: "最大5名" },
	{ label: "対応言語", value: "日本語 / 英語" }
]

export default function Page() {
	return (
		<main className='bg-background text-foreground'>
			<div className='relative overflow-hidden isolate'>
				<div
					className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(12,92,215,0.18),_rgba(12,92,215,0)),_radial-gradient(circle_at_bottom,_rgba(38,201,166,0.22),_transparent_60%)]'
					aria-hidden='true'
				/>
				<div className='mx-auto flex min-h-screen max-w-[1200px] flex-col gap-24 px-4 pb-24 pt-16 sm:px-6 lg:px-10'>
					<section className='grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]'>
						<div className='space-y-8 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-left-8'>
							<Badge variant='secondary' className='bg-sky-900/90 text-sky-50'>
								価値観でつながる VNS MVP
							</Badge>
							<h1 className='text-4xl font-semibold leading-tight text-balance text-slate-900 sm:text-5xl lg:text-6xl'>
								作品と価値観で出会う、新しいコモンズ。
							</h1>
							<p className='text-lg text-pretty text-slate-700 sm:text-xl'>
								VNS masakinihirota
								は、オアシス宣言のもとで安心・安全に価値観の近い仲間を探せる
								Value Network Service
								です。まずは保存なしのダミー体験で世界観を確かめ、気に入ったら
								Supabase Auth で本格参加しましょう。
							</p>
							<div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
								<Button
									asChild
									size='lg'
									className='bg-[#1363DF] text-white shadow-lg shadow-sky-900/20 transition hover:bg-[#0F56C7]'
								>
									<Link href='/browse' aria-label='ダミー体験をはじめる'>
										体験してみる
										<ArrowRight className='size-4' />
									</Link>
								</Button>
								<Button
									asChild
									variant='outline'
									size='lg'
									className='transition border-emerald-500/60 text-emerald-700 hover:bg-emerald-50'
								>
									<Link
										href='/auth'
										aria-label='ログインまたはアカウントを作成する'
									>
										ログイン / 参加する
									</Link>
								</Button>
							</div>
							<dl className='grid gap-4 sm:grid-cols-2'>
								{valueMetrics.map((metric) => (
									<div
										key={metric.label}
										className='px-4 py-4 border shadow-sm rounded-xl border-slate-200 bg-white/70 backdrop-blur'
									>
										<dt className='text-sm text-slate-600'>{metric.label}</dt>
										<dd className='text-2xl font-semibold text-slate-900'>
											{metric.value}
										</dd>
									</div>
								))}
							</dl>
						</div>
						<div className='relative'>
							<Card className='bg-white/80 backdrop-blur motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-right-8'>
								<CardHeader className='pb-6 border-b border-slate-200/60'>
									<CardTitle className='text-xl text-slate-900'>
										マッチング素点サマリー
									</CardTitle>
									<CardDescription className='text-pretty'>
										作品 Tier・価値観回答・重要度フラグを合算し、スコアに応じた
										High / Medium / Low / Very Low を表示します。
									</CardDescription>
								</CardHeader>
								<CardContent className='pt-6 space-y-6'>
									<div className='flex items-center justify-between px-4 py-3 text-sm border rounded-lg border-slate-200/80 bg-sky-50/70 text-slate-700'>
										<span className='font-semibold text-sky-900'>High</span>
										<p>作品Tier一致 + 重要回答一致 + 偏りペナルティなし</p>
									</div>
									<div className='grid gap-4 p-4 text-sm border rounded-lg border-slate-200/70 bg-white/70 text-slate-700'>
										<p className='font-medium text-slate-900'>自動候補保存</p>
										<ul className='pl-5 space-y-1 list-disc'>
											<li>スコア 75 以上を最大 5 名までローカル保存</li>
											<li>手動マッチングでグループ候補に追加</li>
											<li>プロフィール毎に候補を管理できます</li>
										</ul>
									</div>
									<div className='p-4 text-sm border rounded-lg border-emerald-200 bg-emerald-50/80 text-emerald-800'>
										<p className='font-semibold'>ポイント残高</p>
										<p>現在は表示のみ（消費／回復ロジックは後続フェーズ）。</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</section>
					<section className='space-y-8'>
						<div className='space-y-3'>
							<h2 className='text-3xl font-semibold text-slate-900 sm:text-4xl'>
								MVPで体験できる主要機能
							</h2>
							<p className='text-lg text-slate-600'>
								非認証の導線からマッチングまで、少ないステップで価値検証できるよう設計されています。
							</p>
						</div>
						<div className='grid gap-6 md:grid-cols-2'>
							{featureHighlights.map((feature) => {
								const Icon = feature.icon
								return (
									<Card
										key={feature.title}
										className='transition border-slate-200/70 bg-white/80 hover:border-sky-300 hover:shadow-lg'
									>
										<CardHeader className='pb-4'>
											<CardTitle className='flex items-center gap-2 text-lg text-slate-900'>
												<span className='flex items-center justify-center rounded-full size-10 bg-sky-100 text-sky-700'>
													<Icon className='size-5' aria-hidden='true' />
												</span>
												{feature.title}
											</CardTitle>
										</CardHeader>
										<CardContent className='space-y-4 text-sm text-slate-700'>
											<p>{feature.description}</p>
											{feature.cta ? (
												<Button
													asChild
													variant='ghost'
													className='px-0 group text-sky-700 hover:text-sky-900'
												>
													<Link
														href={feature.cta.href}
														aria-label={`${feature.title} へ移動`}
													>
														{feature.cta.label}
														<ArrowRight className='ml-1 size-4 transition group-hover:translate-x-0.5' />
													</Link>
												</Button>
											) : null}
										</CardContent>
									</Card>
								)
							})}
						</div>
					</section>
					<section className='space-y-10'>
						<div className='space-y-3'>
							<h2 className='text-3xl font-semibold text-slate-900 sm:text-4xl'>
								セットアップは 3 ステップ
							</h2>
							<p className='text-lg text-slate-600'>
								オンボーディング完了で、ルートアカウント・ポイント表示・初期候補がそろいます。
							</p>
						</div>
						<ol className='grid gap-6 md:grid-cols-3'>
							{onboardingSteps.map((step) => (
								<li
									key={step.number}
									className='flex flex-col gap-3 p-6 border shadow-sm rounded-2xl border-slate-200/70 bg-white/80'
								>
									<p className='text-sm font-semibold tracking-wide uppercase text-sky-700'>
										{step.number}
									</p>
									<h3 className='text-lg font-semibold text-slate-900'>
										{step.title}
									</h3>
									<p className='text-sm text-slate-700'>{step.description}</p>
								</li>
							))}
						</ol>
					</section>
					<section className='grid gap-8 p-10 border rounded-3xl border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-sky-50'>
						<div className='flex items-start gap-3'>
							<span className='flex items-center justify-center rounded-full size-12 bg-emerald-100 text-emerald-700'>
								<ShieldCheck className='size-6' aria-hidden='true' />
							</span>
							<div className='space-y-3'>
								<h2 className='text-3xl font-semibold text-emerald-900'>
									オアシス宣言を守る仕組み
								</h2>
								<p className='text-lg text-pretty text-emerald-800'>
									コミュニティを安全に保つため、技術とポリシーの両面から体験を設計しています。
								</p>
							</div>
						</div>
						<ul className='grid gap-4 text-sm text-emerald-900 sm:grid-cols-3'>
							{safetyCommitments.map((commitment) => (
								<li
									key={commitment}
									className='flex gap-2 p-4 border shadow-sm rounded-2xl border-emerald-200 bg-white/70'
								>
									<span className='mt-1 text-emerald-500' aria-hidden='true'>
										•
									</span>
									<p>{commitment}</p>
								</li>
							))}
						</ul>
					</section>
					<section className='rounded-3xl border border-sky-200/70 bg-[#0F4C75] p-10 text-white shadow-xl'>
						<div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
							<div className='space-y-3'>
								<h2 className='text-3xl font-semibold text-white'>
									まずは気軽に体験を。価値観が交わる瞬間を味わってください。
								</h2>
								<p className='text-lg text-balance text-sky-100'>
									ダミー体験 → OAuth ログイン → プロフィール作成まで、トータル
									10 分で完了します。
								</p>
							</div>
							<div className='flex flex-col gap-3 sm:flex-row'>
								<Button
									asChild
									size='lg'
									className='bg-white text-slate-900 hover:bg-slate-100'
								>
									<Link href='/browse' aria-label='ダミー体験に進む'>
										ダミー体験を開く
									</Link>
								</Button>
								<Button
									asChild
									variant='secondary'
									size='lg'
									className='bg-emerald-400 text-emerald-950 hover:bg-emerald-300'
								>
									<Link href='/auth' aria-label='認証画面に進む'>
										参加手続きを始める
									</Link>
								</Button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}
