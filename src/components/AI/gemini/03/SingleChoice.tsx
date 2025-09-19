interface SingleChoiceProps {
	question: string
	options: string[]
	selectedValue: string | null
	onSelect: (value: string) => void
}

const SingleChoice = ({
	question,
	options,
	selectedValue,
	onSelect
}: SingleChoiceProps) => {
	return (
		<div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl'>
			<h2 className='text-3xl font-extrabold text-gray-900 mb-6 text-center leading-snug'>
				{question}
			</h2>
			<div className='space-y-4'>
				{(options || []).map((option) => (
					<button
						type='button'
						key={option}
						onClick={() => onSelect(option)}
						className={`
                            w-full flex items-center p-5 rounded-xl transition-all duration-300 transform
                            ${
															selectedValue === option
																? "bg-blue-600 text-white shadow-lg scale-105"
																: "bg-white text-gray-800 shadow-md hover:shadow-lg hover:translate-y-[-2px]"
														}
                            focus:outline-none focus:ring-4 focus:ring-blue-300
                        `}
					>
						<div
							className={`
                            flex-shrink-0 mr-4 flex items-center justify-center
                            rounded-full h-6 w-6 border-2 border-gray-400
                            ${selectedValue === option ? "bg-white border-blue-600" : ""}
                        `}
						>
							{selectedValue === option && (
								<div className='h-3 w-3 rounded-full bg-blue-600'></div>
							)}
						</div>
						<span className='font-semibold text-left'>{option}</span>
					</button>
				))}
			</div>
		</div>
	)
}

export default SingleChoice
