import { useId } from "react"
import Link from "next/link"

type FeatureGroup = {
	category: string
	headline: string
	description: string
	items: string[]
}

const featureGroups: FeatureGroup[] = [
	{
		category: "Non-auth Experience",
		headline: "認証なしでも価値観の世界を垣間見る",
		description:
			"ダミーのプロフィールやマッチング結果を通じて、ログイン前でもサービスの雰囲気を体験できます。",
		items: [
			"ランダムに切り替わるダミープロフィール",
			"価値観と作品データで作られたサンプルマッチング",
			"公式が用意した作品・価値観ギャラリー"
		]
	},
	{
		category: "Onboarding",
		headline: "価値観の共有はオアシス宣誓から",
		description:
			"Supabase Authを使ったOAuthログイン後、初期設定モーダルで価値観の土台を整えます。",
		items: [
			"地域・母語・UI言語の選択",
			"生誕世代と広告表示のポリシー登録",
			"オアシス宣誓への同意で初回セットアップ完了"
		]
	},
	{
		category: "Profiles",
		headline: "目的別のプロフィールを育てる",
		description:
			"ひとつのルートアカウントから最大4つのプロフィールを作成し、それぞれの目的や状態を管理。",
		items: [
			"目的は work / friend / marriage / end_of_life / other",
			"状態は standby / open / exploring / closed",
			"プロフィール作成時に自動生成される『自分のグループ』"
		]
	},
	{
		category: "Works & Values",
		headline: "作品と価値観が出会いを導く",
		description:
			"公式作品カタログに加えてユーザー自身の登録も可能。価値観の設問に回答し、重要なポイントにはフラグを付けられます。",
		items: [
			"作品カテゴリは anime / manga (MVP)",
			"作品ごとに tense と tier を設定",
			"価値観の回答には is_important フラグを保持"
		]
	},
	{
		category: "Matching",
		headline: "暫定スコアで出会いのきっかけを提示",
		description:
			"作品や価値観の一致度から 0-100 のスコアを算出し、High / Medium / Low / Very Low のランクで表示します。",
		items: [
			"score >= 75 の自動マッチング候補を最大5件保存",
			"手動マッチングで気になる人をグループに追加",
			"偏りペナルティや重要項目の加点で精度を調整"
		]
	}
]

const userJourney = [
	{
		step: "01",
		title: "Landing / Browse",
		description:
			"ランディングと `/browse` でダミーデータを閲覧し、価値観ベースの体験イメージを掴む"
	},
	{
		step: "02",
		title: "Auth & Onboarding",
		description:
			"Google / GitHub で認証し、初期設定モーダルで地域・言語・宣誓を登録"
	},
	{
		step: "03",
		title: "Dashboard",
		description:
			"ルートアカウントのポイントや経過日数、プロフィールのサマリーを確認"
	},
	{
		step: "04",
		title: "Profiles",
		description: "目的別プロフィールを作成し、作品・価値観を登録"
	},
	{
		step: "05",
		title: "Match",
		description:
			"スコア付けされた候補から次のアクションを選び、グループで交流を始める"
	}
]

const dataModels = [
	{
		name: "root_accounts",
		points: [
			"auth_user_id と 1:1 のルートを保持",
			"地域・母語・言語・世代・広告ポリシー・オアシス宣誓を保存",
			"ポイントと作成日からの経過日数を管理"
		]
	},
	{
		name: "user_profiles",
		points: [
			"目的と状態を持つプロフィールを最大4件",
			"作成時に自分のグループを自動生成",
			"ルート削除時は CASCADE で整理"
		]
	},
	{
		name: "works & profile_works",
		points: [
			"公式作品は管理者シード、ユーザー作品は tier1-3 のみ",
			"tense (now / future / life) と tier を付与",
			"オアシス宣言に則った作品選択を支援"
		]
	},
	{
		name: "value_questions / value_options / profile_value_answers",
		points: [
			"設問・選択肢モデルで価値観を構造化",
			"回答ごとに is_important で重み付け",
			"将来的な i18n 拡張を視野に単一言語から開始"
		]
	}
]

const nonFunctionalHighlights = [
	"主要 API / SSR の P90 200ms 以内を目標",
	"Supabase Auth + RLS + Zod でセキュリティと入力品質を担保",
	"可用性 99.9% / Supabase 標準バックアップ",
	"モジュール化とスキーマ整備で拡張に備える",
	"A11y・レスポンシブ・ネタバレ配慮のシンプル UI"
]

const oasisPrinciples = [
	"褒めは公に、叱責は個別に小さな声で",
	"誹謗中傷・ヘイト・個人情報詮索・違法/権利侵害コンテンツの禁止",
	"安心・安全・寛容・建設的な議論の場を維持",
	"広告はユーザーが主導権を持つ",
	"誰もが争わずに休息できるオアシスを守る"
]

export default function LandingPage() {
	const oasisSectionId = useId()

	return (
		<main className='min-h-screen bg-slate-950 text-slate-50'>
			<section className='relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700'>
				<div className='absolute inset-0 opacity-20 mix-blend-screen bg-[radial-gradient(circle_at_top,white,transparent_60%)]' />
				<div className='relative flex flex-col max-w-6xl gap-10 px-6 py-24 mx-auto md:flex-row md:items-center md:gap-16'>
					<div className='md:w-2/3'>
						<p className='text-sm uppercase tracking-[0.4em] text-sky-100'>
							Value Network Service · MVP
						</p>
						<h1 className='mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl'>
							価値観でつながる、安心な出会いのオアシス。
						</h1>
						<p className='mt-6 text-lg leading-relaxed text-sky-50 md:max-w-2xl md:text-xl'>
							昨日僕が感動した作品を、今日の君はまだ知らない。個人情報に依存せず、作品と価値観を軸にマッチングする
							VNS masakinihirota の MVP へようこそ。
						</p>
						<div className='flex flex-wrap gap-4 mt-10'>
							<Link
								href='/auth'
								className='rounded-full bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg shadow-sky-900/40 transition hover:-translate-y-0.5 hover:bg-slate-100'
							>
								OAuthで始める
							</Link>
							<Link
								href='/browse'
								className='rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10'
							>
								ダミー体験を見る
							</Link>
						</div>
					</div>
					<div className='md:w-1/3'>
						<div className='p-6 border rounded-3xl border-white/20 bg-white/10 backdrop-blur'>
							<p className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-200'>
								Oasis Declaration
							</p>
							<p className='mt-4 text-base leading-relaxed text-sky-50'>
								安心・安全・寛容なコミュニティを守る「オアシス宣言」に同意した人だけが集う場所。褒めは公に、叱責は個別に。価値観を尊重しあう文化から、次の一歩が生まれます。
							</p>
							<Link
								className='inline-flex items-center gap-2 mt-6 text-sm font-semibold text-sky-100 hover:text-white'
								href='#oasis'
							>
								詳細を見る
								<span aria-hidden='true'>→</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className='max-w-6xl px-6 py-24 mx-auto space-y-12'>
				<header className='text-center'>
					<p className='text-sm uppercase tracking-[0.4em] text-sky-400'>
						MVP Scope
					</p>
					<h2 className='mt-3 text-3xl font-bold text-white md:text-4xl'>
						最小構成で価値検証に集中
					</h2>
					<p className='mt-5 text-lg text-slate-200'>
						0020-MVP
						要件に沿って実装する高優先度の機能を、体験の流れに沿って紹介します。
					</p>
				</header>
				<div className='grid gap-6 lg:grid-cols-2'>
					{featureGroups.map((group) => (
						<article
							key={group.category}
							className='flex h-full flex-col rounded-2xl border border-white/5 bg-slate-900/60 p-8 shadow-[0_30px_80px_-40px_rgba(14,116,144,0.8)]'
						>
							<p className='text-xs uppercase tracking-[0.3em] text-sky-300'>
								{group.category}
							</p>
							<h3 className='mt-4 text-2xl font-semibold text-white'>
								{group.headline}
							</h3>
							<p className='mt-3 text-base text-slate-200'>
								{group.description}
							</p>
							<ul className='mt-6 space-y-2 text-sm text-slate-300'>
								{group.items.map((item) => (
									<li key={item} className='flex items-start gap-3'>
										<span className='inline-flex flex-none w-2 h-2 mt-1 rounded-full bg-sky-400' />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</section>

			<section className='py-24 bg-slate-900/70'>
				<div className='flex flex-col max-w-6xl gap-10 px-6 mx-auto lg:flex-row lg:items-start'>
					<div className='lg:w-1/3'>
						<p className='text-sm uppercase tracking-[0.4em] text-sky-400'>
							User Journey
						</p>
						<h2 className='mt-3 text-3xl font-bold text-white md:text-4xl'>
							価値観に出会うまでの導線
						</h2>
						<p className='mt-5 text-base text-slate-200'>
							MVP で提供する画面遷移を5ステップに凝縮。導線ごとに
							`/`・`/browse`・`/auth` などのルートを明示しています。
						</p>
					</div>
					<ol className='grid flex-1 gap-6 md:grid-cols-2'>
						{userJourney.map((stage) => (
							<li
								key={stage.step}
								className='rounded-2xl border border-white/5 bg-slate-950/60 p-6 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.8)]'
							>
								<span className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-400'>
									Step {stage.step}
								</span>
								<p className='mt-3 text-xl font-semibold text-white'>
									{stage.title}
								</p>
								<p className='mt-3 text-sm leading-relaxed text-slate-300'>
									{stage.description}
								</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className='max-w-6xl px-6 py-24 mx-auto'>
				<div className='text-center'>
					<p className='text-sm uppercase tracking-[0.4em] text-sky-400'>
						Data Model
					</p>
					<h2 className='mt-3 text-3xl font-bold text-white md:text-4xl'>
						価値観を維持するデータ設計
					</h2>
					<p className='mt-5 text-lg text-slate-200'>
						シンプルな4つの軸で RLS
						による所有権管理と、将来拡張を見据えたスキーマを整備しています。
					</p>
				</div>
				<div className='grid gap-6 mt-10 md:grid-cols-2'>
					{dataModels.map((model) => (
						<article
							key={model.name}
							className='rounded-2xl border border-white/5 bg-slate-900/60 p-8 text-left shadow-[0_30px_80px_-40px_rgba(14,165,233,0.6)]'
						>
							<h3 className='text-xl font-semibold text-white'>{model.name}</h3>
							<ul className='mt-4 space-y-2 text-sm text-slate-300'>
								{model.points.map((point) => (
									<li key={point} className='flex gap-3'>
										<span className='inline-flex flex-none w-2 h-2 mt-1 rounded-full bg-sky-400' />
										<span>{point}</span>
									</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</section>

			<section className='py-24 bg-slate-900/70'>
				<div className='flex flex-col max-w-6xl gap-12 px-6 mx-auto lg:flex-row'>
					<div className='lg:w-1/3'>
						<p className='text-sm uppercase tracking-[0.4em] text-sky-400'>
							Quality Gates
						</p>
						<h2 className='mt-3 text-3xl font-bold text-white md:text-4xl'>
							非機能要件も MVP 水準で
						</h2>
						<p className='mt-5 text-base text-slate-200'>
							パフォーマンス、セキュリティ、信頼性、ユーザビリティの観点で最小構成の品質を担保します。
						</p>
					</div>
					<ul className='flex-1 space-y-4'>
						{nonFunctionalHighlights.map((highlight) => (
							<li
								key={highlight}
								className='rounded-2xl border border-white/5 bg-slate-950/60 p-6 text-sm leading-relaxed text-slate-200 shadow-[0_20px_60px_-40px_rgba(14,165,233,0.8)]'
							>
								{highlight}
							</li>
						))}
					</ul>
				</div>
			</section>

			<section
				id={oasisSectionId}
				className='max-w-5xl px-6 py-24 mx-auto text-center'
			>
				<p className='text-sm uppercase tracking-[0.4em] text-sky-400'>
					Oasis Declaration
				</p>
				<h2 className='mt-3 text-3xl font-bold text-white md:text-4xl'>
					穏やかな場を守るための約束
				</h2>
				<p className='mt-5 text-lg text-slate-200'>
					オアシス宣言はコミュニティの土台です。価値観を尊重する姿勢を共有し、お互いの安全を守ります。
				</p>
				<ul className='grid gap-4 mt-10 text-sm text-left text-slate-200 md:grid-cols-2'>
					{oasisPrinciples.map((principle) => (
						<li
							key={principle}
							className='flex gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-5 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.6)]'
						>
							<span className='inline-flex flex-none w-2 h-2 mt-1 rounded-full bg-sky-400' />
							<span>{principle}</span>
						</li>
					))}
				</ul>
			</section>

			<section className='py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-black'>
				<div className='flex flex-col items-center max-w-5xl gap-8 px-6 mx-auto text-center'>
					<h2 className='text-3xl font-bold text-white md:text-4xl'>
						価値観に寄り添うマッチングを、今すぐ試す
					</h2>
					<p className='max-w-2xl text-base text-slate-300'>
						最小の登録で価値検証とフィードバック取得を目指す
						MVP。あなたの作品や価値観を登録し、同じ感性を持つ仲間と出会ってください。
					</p>
					<div className='flex flex-wrap justify-center gap-4'>
						<Link
							href='/onboarding'
							className='rounded-full bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:-translate-y-0.5 hover:bg-sky-400'
						>
							初期設定モーダルを確認
						</Link>
						<Link
							href='/match'
							className='rounded-full border border-sky-400/60 px-6 py-3 font-semibold text-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-500/10'
						>
							マッチング結果を見る
						</Link>
					</div>
				</div>
			</section>

			<footer className='py-10 text-xs text-center border-t border-white/5 bg-black/80 text-slate-500'>
				<p>
					© {new Date().getFullYear()} VNS masakinihirota. All rights reserved.
				</p>
			</footer>
		</main>
	)
}
