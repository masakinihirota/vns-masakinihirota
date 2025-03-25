interface ButtonProps {
	label: string;
	onClick?: () => void;
}

export const Button = ({ label }: ButtonProps) => {
	return (
		<button
			type="button"
			className="flex items-center justify-center px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:text-green-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			{label}
		</button>
	);
};
