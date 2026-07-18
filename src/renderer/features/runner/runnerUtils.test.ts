import { describe, expect, it, vi } from "vitest";
import { ExtractOperationResult } from "../../../common/types/scraper";
import { SmallOperation } from "../../../common/types/smallOperation";
import {
  downloadAsCSV,
  getRunnerGenerator,
  getRunnerTableData
} from "./runnerUtils";

const setOperation = (name: string, value: string): SmallOperation => ({
  type: "set",
  inputs: [
    { type: "text", value: name },
    { type: "select", value: "number" },
    { type: "text", value }
  ]
});

describe("getRunnerGenerator", () => {
  it("yields browser operations with variables substituted", () => {
    const operations: SmallOperation[] = [
      setOperation("page", "1"),
      {
        type: "while",
        inputs: [
          { type: "text", value: "{{page}} < 3" },
          {
            type: "operation_box",
            operations: [
              {
                type: "open",
                inputs: [
                  { type: "text", value: "https://example.com?p={{page}}" }
                ]
              },
              {
                type: "increase",
                inputs: [
                  { type: "text", value: "page" },
                  { type: "text", value: "1" }
                ]
              }
            ]
          }
        ]
      }
    ];

    const yielded = [...getRunnerGenerator(operations)];
    expect(yielded).toEqual([
      { type: "open", url: "https://example.com?p=1" },
      { type: "open", url: "https://example.com?p=2" }
    ]);
  });

  it("yields wait/delay/scroll operations with numeric coercion", () => {
    const operations: SmallOperation[] = [
      setOperation("n", "2"),
      {
        type: "wait",
        inputs: [
          { type: "text", value: ".item-{{n}}" },
          { type: "text", value: "5000" }
        ]
      },
      { type: "delay", inputs: [{ type: "text", value: "not-a-number" }] },
      { type: "scroll", inputs: [{ type: "text", value: "" }] }
    ];

    expect([...getRunnerGenerator(operations)]).toEqual([
      { type: "wait", selector: ".item-2", timeoutMs: 5000 },
      { type: "delay", ms: 0 },
      { type: "scroll", selector: "" }
    ]);
  });

  it("throws instead of looping forever on a constant condition", () => {
    const operations: SmallOperation[] = [
      {
        type: "while",
        inputs: [
          { type: "text", value: "1 == 1" },
          { type: "operation_box", operations: [setOperation("x", "1")] }
        ]
      }
    ];

    expect(() => [...getRunnerGenerator(operations)]).toThrow(/iterations/);
  });
});

describe("getRunnerTableData", () => {
  const extractResult = (
    name: string,
    data: string[]
  ): ExtractOperationResult => ({
    type: "extract",
    url: "https://example.com",
    name,
    selector: ".s",
    attribute: "textContent",
    data
  });

  it("appends a new column at the correct index", () => {
    const first = getRunnerTableData(extractResult("title", ["a", "b"]));
    expect(first.cols).toEqual(["title"]);
    expect(first.rows).toEqual([["a"], ["b"]]);

    const second = getRunnerTableData(
      extractResult("link", ["x", "y", "z"]),
      first
    );
    expect(second.cols).toEqual(["title", "link"]);
    expect(second.rows[0]).toEqual(["a", "x"]);
    expect(second.rows[2][1]).toBe("z");
    expect(second.rows[2][0]).toBeUndefined();
  });

  it("overwrites an existing column with the same name", () => {
    const first = getRunnerTableData(extractResult("title", ["a"]));
    const second = getRunnerTableData(extractResult("title", ["q"]), first);
    expect(second.cols).toEqual(["title"]);
    expect(second.rows[0]).toEqual(["q"]);
  });
});

describe("downloadAsCSV", () => {
  it("escapes delimiters, quotes and newlines per RFC 4180", async () => {
    let captured: Blob | undefined;
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn((blob: Blob) => {
        captured = blob;
        return "blob:mock";
      }),
      revokeObjectURL: vi.fn()
    });

    downloadAsCSV({
      cols: ["name", "note"],
      rows: [
        ["plain", "with,comma"],
        ['say "hi"', "line\nbreak"]
      ]
    });

    expect(captured).toBeDefined();
    const text = await captured!.text();
    expect(text).toBe(
      'name,note\r\nplain,"with,comma"\r\n"say ""hi""","line\nbreak"'
    );

    vi.unstubAllGlobals();
  });
});
