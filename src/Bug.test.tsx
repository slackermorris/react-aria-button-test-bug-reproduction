import React from "react";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  ModalComponent,
  IsolatedButton,
  WorkingModalInsideTableComponent,
  ModalInsideTableComponentNoDialogTrigger,
} from "./Bug";

describe("Bug", () => {
  it("shows a button", () => {
    render(<IsolatedButton />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  it("shows a button in a modal", async () => {
    render(<ModalComponent />);

    expect(screen.getByRole("button", { name: "Delete user…" })).toBeVisible();

    userEvent.click(screen.getByRole("button", { name: "Delete user…" }));

    await waitFor(() => {
      expect(
        screen.getByRole("alertdialog", { name: /delete user/i })
      ).toBeVisible();
    });

    const dialog = screen.getByRole("alertdialog", { name: /delete user/i });
    expect(await within(dialog).findAllByRole("button")).toHaveLength(2);
    expect(
      within(dialog).getByRole("button", { name: /cancel/i })
    ).toBeVisible();
  });

  it("shows a button in a modal inside a table", async () => {
    render(<WorkingModalInsideTableComponent />);

    const table = screen.getByLabelText("Users");
    expect(table).toBeVisible();

    const row = within(table).getByRole("row", { name: /john doe/i });
    expect(row).toBeVisible();

    const deleteUserButton = within(row).getByRole("button", {
      name: /delete/i,
    });

    expect(deleteUserButton).toBeVisible();

    userEvent.click(deleteUserButton);

    await waitFor(() => {
      expect(
        screen.getByRole("alertdialog", { name: /delete user/i })
      ).toBeVisible();
    });

    const dialog = screen.getByRole("alertdialog", { name: /delete user/i });

    expect(await within(dialog).findAllByRole("button")).toHaveLength(2);
    expect(
      within(dialog).getByRole("button", { name: /cancel/i })
    ).toBeVisible();
  });

  it("does not render buttons in table bound modal dialog because it does not use a DialogTrigger", async () => {
    render(<ModalInsideTableComponentNoDialogTrigger />);

    const table = screen.getByLabelText("Users");
    expect(table).toBeVisible();

    const row = within(table).getByRole("row", { name: /john doe/i });
    expect(row).toBeVisible();

    const deleteUserButton = within(row).getByRole("button", {
      name: /delete/i,
    });

    expect(deleteUserButton).toBeVisible();

    userEvent.click(deleteUserButton);

    await waitFor(() => {
      expect(
        screen.getByRole("alertdialog", { name: /delete user/i })
      ).toBeVisible();
    });

    const dialog = screen.getByRole("alertdialog", { name: /delete user/i });

    expect(await within(dialog).findAllByRole("button")).toHaveLength(2);
    expect(
      within(dialog).getByRole("button", { name: /cancel/i })
    ).toBeVisible();
  });
});
