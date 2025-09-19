import type * as React from "react"

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
}

/**
 * デジタル庁デザインシステム準拠のボタン
 * @see https://www.figma.com/design/PHFZA2gbTl55ySPvhqfEp3
 */
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
	return (
		<button
			{...props}
			className={
				"rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 " +
				(props.className ?? "")
			}
		>
			{children}
		</button>
	)
}
