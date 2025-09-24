import React from "react";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ButtonInsideModal,
  IsolatedButton,
  ModalInsideTableWithButtonInsideModal,
} from "./Bug";

describe("Bug", () => {
  it("shows a button", () => {
    render(<IsolatedButton />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  it.only("shows a button in a modal", () => {
    render(<ButtonInsideModal />);
    expect(screen.getByRole("dialog", { name: "Modal To Test" })).toBeVisible();

    const dialog = screen.getByRole("dialog", { name: "Modal To Test" });
    expect(
      within(dialog).getByRole("button", { name: "Cancel" })
    ).toBeVisible();
  });

  it.only("shows a button in a modal inside a table", () => {
    render(<ModalInsideTableWithButtonInsideModal />);

    expect(screen.getByLabelText("table")).toBeVisible();

    expect(screen.getByRole("dialog", { name: "Modal To Test" })).toBeVisible();

    const dialog = screen.getByRole("dialog", { name: "Modal To Test" });
    expect(
      within(dialog).getByRole("button", { name: "Cancel" })
    ).toBeVisible();
  });
});
