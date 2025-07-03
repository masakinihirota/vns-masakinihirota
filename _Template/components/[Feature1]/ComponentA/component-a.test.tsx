import { render } from "@testing-library/react";
import { ComponentA } from "./component-a";

test("renders ComponentA", () => {
  const { getByText } = render(<ComponentA />);
  expect(getByText("Component A")).toBeInTheDocument();
});
