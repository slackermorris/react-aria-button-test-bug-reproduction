import React from "react";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  IsolatedButton,
  ModalSelfManagingVisibilityWithDialogTrigger,
  TableWithModalSelfManagingVisibilityWithDialogTrigger,
  TableWithModalSelfManagingVisibilityWithoutDialogTrigger,
  TableWithModalNotSelfManagingVisibility,
} from "./reproduction";

describe("reproduction of react-aria bug", () => {
  // These tests take follow my debugging process:
  // 1) Does rendering a button work.
  // 2) Do buttons render in a modal dialog.
  // 3) Do buttons render in a modal dialog inside a table when the show/hide state is managed by the modal component (no local state, idiomatic react-aria approach).
  // 4) Do buttons render in a modal dialog inside a table when the show/hide state is managed by the modal component but no idiomatic react-aria approach.
  // 5) Do buttons render in a modal dialog inside a table when the show/hide state is not managed by the modal component and is at level of the table (no local state, non-idiomatic react-aria approach).

  // I found that in the most recent version of react-aria (1.12.2), the modal dialog does not render its buttons if the show/hide state is not managed by the modal component itself and it instead managed at the level of the table.

  it("shows a button", () => {
    render(<IsolatedButton />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  it("shows a button in a modal", async () => {
    render(<ModalSelfManagingVisibilityWithDialogTrigger />);

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

  describe("modal dialog is rendered inside a table", () => {
    it("do buttons render when using a modal self manages showhide state viaDialogTrigger?", async () => {
      render(<TableWithModalSelfManagingVisibilityWithDialogTrigger />);

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

    it("do buttons render when using a modal self manages show/hide state but not managed via DialogTrigger?", async () => {
      render(<TableWithModalSelfManagingVisibilityWithoutDialogTrigger />);

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

    it("do buttons render when table manages show/hide state?", async () => {
      render(<TableWithModalNotSelfManagingVisibility />);

      const table = screen.getByLabelText("Users");
      expect(table).toBeVisible();

      const row = within(table).getByRole("row", { name: /john doe/i });
      expect(row).toBeVisible();

      const deleteUserButton = within(row).getByRole("button", {
        name: /delete/i,
      });
      screen.debug(deleteUserButton);

      expect(deleteUserButton).toBeVisible();

      userEvent.click(deleteUserButton);

      // We very much expect the modal dialog to be visible.
      await waitFor(() => {
        expect(
          screen.getByRole("alertdialog", { name: /delete user/i })
        ).toBeVisible();
      });
    });
  });
});
