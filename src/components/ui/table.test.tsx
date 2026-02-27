import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

describe("Table Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Head 1</TableHead>
            <TableHead>Head 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
