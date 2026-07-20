import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AsyncContent from "./AsyncContent";

describe("AsyncContent", () => {
  it("shows a spinner while loading", () => {
    const { container } = render(
      <AsyncContent status="loading">
        <p>content</p>
      </AsyncContent>
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("shows the error message on failure", () => {
    render(
      <AsyncContent status="error" error="Something failed">
        <p>content</p>
      </AsyncContent>
    );
    expect(screen.getByText("Something failed")).toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders children once loaded", () => {
    render(
      <AsyncContent status="loaded">
        <p>content</p>
      </AsyncContent>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
