import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import Page from "./page"

describe("51 Page", () => {
	it("renders without crashing", () => {
		render(<Page />)
		expect(screen.getByText("Component 51")).toBeInTheDocument()
	})
})
