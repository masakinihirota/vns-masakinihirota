import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account settings here.</TabsContent>
        <TabsContent value="password">Password settings here.</TabsContent>
      </Tabs>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
