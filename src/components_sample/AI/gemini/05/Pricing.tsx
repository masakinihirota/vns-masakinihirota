/**
 * 料金表示コンポーネント（Next.js用）
 * - 初期費用、月額利用料、発行手数料をカード形式で表示
 * - Tailwind CSS対応
 */
const Pricing: React.FC = () => {
	return (
		<div className='flex items-center justify-center min-h-screen p-4 bg-gray-100 sm:p-6 lg:p-8 font-inter'>
			<div className='w-full max-w-4xl p-6 text-center bg-white shadow-lg rounded-xl sm:p-8 lg:p-12'>
				<h2 className='mb-6 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl'>
					料金
				</h2>
				<p className='mb-10 text-base leading-relaxed text-gray-600 sm:text-lg'>
					初期費用・月額利用料無料。URLの発行手数料以外、費用は一切かかりません。
					<br className='block sm:hidden' />
					事業規模や実績による手数料の違いもなく、安心してお使いいただけます。
				</p>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
					<div className='flex flex-col items-center justify-center p-6 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl'>
						<span className='mb-2 text-4xl font-extrabold text-teal-500 sm:text-5xl'>
							0<span className='ml-1 text-2xl sm:text-3xl'>円</span>
						</span>
						<p className='text-lg font-semibold text-gray-700 sm:text-xl'>
							初期費用
						</p>
					</div>
					<div className='flex flex-col items-center justify-center p-6 shadow-md bg-gradient-to-br from-green-50 to-green-100 rounded-xl'>
						<span className='mb-2 text-4xl font-extrabold text-teal-500 sm:text-5xl'>
							0<span className='ml-1 text-2xl sm:text-3xl'>円</span>
						</span>
						<p className='text-lg font-semibold text-gray-700 sm:text-xl'>
							月額利用料
						</p>
					</div>
					<div className='flex flex-col items-center justify-center p-6 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl'>
						<span className='mb-2 text-4xl font-extrabold text-teal-500 sm:text-5xl'>
							10<span className='ml-1 text-2xl sm:text-3xl'>%</span>
						</span>
						<p className='mb-3 text-lg font-semibold text-gray-700 sm:text-xl'>
							発行手数料
						</p>
						<p className='max-w-xs text-xs leading-relaxed text-gray-500 sm:text-sm'>
							継続利用の企業様向けに手数料0円 月額固定費のみプランもあります。
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Pricing
