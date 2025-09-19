"use client"

import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface MandalaChartProps {
	initialData?: string[][]
	onChange?: (data: string[][]) => void
	readOnly?: boolean
}

export default function MandalaChart({
	initialData,
	onChange,
	readOnly = false
}: MandalaChartProps) {
	// Create a consistent empty grid
	const createEmptyGrid = () =>
		Array(9)
			.fill(0)
			.map(() => Array(9).fill(""))

	// Initialize with empty state first
	const [chartData, setChartData] = useState<string[][]>(createEmptyGrid())
	const [isClient, setIsClient] = useState(false)

	// After hydration, set the actual data
	useEffect(() => {
		setIsClient(true)
		setChartData(initialData || createEmptyGrid())
	}, [initialData, createEmptyGrid])

	const handleCellChange = (
		rowIndex: number,
		colIndex: number,
		value: string
	) => {
		const newData = chartData.map((row, rIdx) =>
			rIdx === rowIndex
				? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
				: row
		)
		setChartData(newData)
		onChange?.(newData)
	}

	const getCellClassName = (rowIndex: number, colIndex: number) => {
		// Center cell
		if (rowIndex === 4 && colIndex === 4) {
			return "bg-primary/10 border-primary"
		}

		// Main axis cells
		if (rowIndex === 4 || colIndex === 4) {
			return "bg-secondary/10 border-secondary"
		}

		return "bg-card"
	}

	// Don't render until client-side hydration is complete
	if (!isClient) {
		return (
			<div className='w-full h-[500px] flex items-center justify-center'>
				Loading...
			</div>
		)
	}

	return (
		<div className='w-full max-w-4xl mx-auto'>
			<div className='grid grid-cols-9 gap-1 md:gap-2'>
				{chartData.map((row, rowIndex) =>
					row.map((cell, colIndex) => (
						<Card
							key={`${rowIndex}-${colIndex}`}
							className={`${getCellClassName(rowIndex, colIndex)} border transition-colors hover:border-primary/50`}
						>
							<CardContent className='p-1 md:p-2'>
								<Input
									value={cell}
									onChange={(e) =>
										handleCellChange(rowIndex, colIndex, e.target.value)
									}
									className='h-8 md:h-10 text-xs md:text-sm text-center border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
									placeholder={readOnly ? "" : "Add text..."}
									readOnly={readOnly}
								/>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	)
}
