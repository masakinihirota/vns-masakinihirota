interface MultipleChoiceProps {
	question: string
	options: string[]
	selectedValues: string[]
	onSelect: (value: string) => void
}

const MultipleChoice = ({
	question,
	options,
	selectedValues,
	onSelect
}: MultipleChoiceProps) => {
	return (
		<div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl'>
			<h2 className='text-3xl font-extrabold text-gray-900 mb-6 text-center leading-snug'>
				{question}
			</h2>
			<div className='space-y-4'>
				{(options || []).map((option, _index) => (
					<button
						key={option}
						type='button'
						onClick={() => onSelect(option)}
						className={`
                            w-full flex items-center p-5 rounded-xl transition-all duration-300 transform
                            ${
															selectedValues.includes(option)
																? "bg-blue-600 text-white shadow-lg scale-105"
																: "bg-white text-gray-800 shadow-md hover:shadow-lg hover:translate-y-[-2px]"
														}
                            focus:outline-none focus:ring-4 focus:ring-blue-300
                        `}
					>
						<div
							className={`
                            flex-shrink-0 mr-4 flex items-center justify-center
                            rounded-md h-6 w-6 border-2 border-gray-400
                            ${selectedValues.includes(option) ? "bg-white border-blue-600" : ""}
                        `}
						>
							{selectedValues.includes(option) && (
								<svg
									className='h-4 w-4 text-blue-600'
									fill='currentColor'
									viewBox='0 0 20 20'
									aria-label='選択済みアイコン'
								>
									<title>選択済み</title>
									<path
										fillRule='evenodd'
										d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
										clipRule='evenodd'
									/>
								</svg>
							)}
						</div>
						<span className='font-semibold text-left'>{option}</span>
					</button>
				))}
			</div>
		</div>
	)
}

export default MultipleChoice
