import { render } from "@testing-library/react";
import { ComponentB } from "./component-b";

test("renders ComponentB", () => {
  const { getByText } = render(<ComponentB />);
  expect(getByText("Component B")).toBeInTheDocument();
});
