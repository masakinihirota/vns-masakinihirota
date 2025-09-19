// Next.jsとReact Hooks: HTMLのコードを、ReactのuseStateフックを使用して状態を管理する関数コンポーネントに書き換えました。これにより、コンポーネントの状態（現在の質問、選択された回答）が自動的に管理され、変更に応じてUIが再レンダリングされるようになります。

// Props: 質問データは、親コンポーネント（ここではpage.jsx）からquestionsという名前のPropsとして受け取るようにしました。これにより、コンポーネントの再利用性が高まり、データをコンポーネントのロジックから分離できます。

// TailwindCSS: HTMLのインラインstyleタグやカスタムCSSクラスは使用せず、すべてTailwindCSSのユーティリティクラスに置き換えました。これにより、スタイルの一貫性が保たれ、変更も簡単になります。

// このコードをNext.jsプロジェクトの適切なディレクトリに配置することで、クイズアプリが正常に動作するはずです。何か他にご質問があれば、お気軽にご相談ください。

import { useState } from "react"

const Quiz = ({ questions }) => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [selectedOptions, setSelectedOptions] = useState([])

	if (!questions || questions.length === 0) {
		return (
			<div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center'>
				<h2 className='text-2xl font-bold text-gray-800 mb-4'>
					質問データが見つかりません。
				</h2>
			</div>
		)
	}

	const currentQuestion = questions[currentQuestionIndex]
	const isLastQuestion = currentQuestionIndex === questions.length - 1

	const handleOptionClick = (option) => {
		if (currentQuestion.type === "single") {
			setSelectedOptions([option])
		} else if (currentQuestion.type === "multiple") {
			setSelectedOptions((prevSelected) => {
				if (prevSelected.includes(option)) {
					return prevSelected.filter((item) => item !== option)
				} else {
					return [...prevSelected, option]
				}
			})
		}
	}

	const handleNextClick = () => {
		if (!isLastQuestion) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
			setSelectedOptions([])
		}
	}

	const isNextButtonDisabled = selectedOptions.length === 0

	if (!currentQuestion) {
		return (
			<div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center'>
				<h2 className='text-2xl font-bold text-gray-800 mb-4'>
					すべての質問に回答しました。ありがとうございました！
				</h2>
			</div>
		)
	}

	return (
		<div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl'>
			<h2 className='text-3xl font-extrabold text-gray-900 mb-6 text-center leading-snug'>
				{currentQuestion.question}
			</h2>
			<div className='space-y-4'>
				{currentQuestion.options.map((option, _index) => (
					<button
						key={option}
						onClick={() => handleOptionClick(option)}
						className={`
                            w-full flex items-center p-5 rounded-xl transition-all duration-300 transform
                            ${
															selectedOptions.includes(option)
																? "bg-blue-600 text-white shadow-lg scale-105"
																: "bg-white text-gray-800 shadow-md hover:shadow-lg hover:translate-y-[-2px]"
														}
                            focus:outline-none focus:ring-4 focus:ring-blue-300
                        `}
					>
						{/* Checkbox or Radio Icon */}
						<div
							className={`
                            flex-shrink-0 mr-4 flex items-center justify-center
                            ${
															currentQuestion.type === "single"
																? "rounded-full h-6 w-6 border-2 border-gray-400"
																: "rounded-md h-6 w-6 border-2 border-gray-400"
														}
                            ${selectedOptions.includes(option) ? "bg-white border-blue-600" : ""}
                        `}
						>
							{currentQuestion.type === "single" &&
								selectedOptions.includes(option) && (
									<div className='h-3 w-3 rounded-full bg-blue-600'></div>
								)}
							{currentQuestion.type === "multiple" &&
								selectedOptions.includes(option) && (
									<svg
										className='h-4 w-4 text-blue-600'
										fill='currentColor'
										viewBox='0 0 20 20'
									>
										<title></title>
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
			{!isLastQuestion && (
				<button
					type='button'
					onClick={handleNextClick}
					disabled={isNextButtonDisabled}
					className={`
                        mt-8 w-full py-4 text-white font-bold rounded-lg shadow-lg
                        transition-all duration-300
                        ${
													isNextButtonDisabled
														? "bg-gray-400 cursor-not-allowed"
														: "bg-blue-600 hover:bg-blue-700 hover:scale-105"
												}
                    `}
				>
					次の質問へ
				</button>
			)}
		</div>
	)
}

export default Quiz
