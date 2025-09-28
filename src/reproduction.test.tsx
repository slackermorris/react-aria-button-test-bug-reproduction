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
  TableWithNativeButtonModalNotSelfManagingVisibility,
  TableWithContentNotContainedInACell,
  TableWithModalNotSelfManagingVisibilityIteratingWithMapToGenerateRows,
  TableWithModalNotSelfManagingVisibilityAndModalIsContainedInACell,
  TableWithContentContainedInACell,
} from "./reproduction";

/**
 * The examples below are pretty contrived.
 *
 * TL;DR: Content rendered in a table but not contained in a cell is not rendered.
 *
 * The real use case involves a table that manages modal visibility because it has a popover with multiple user actions.
 * See use-case.png for an illustration.
 *
 * In reproducing the issue I wanted to determine under what exact conditions it occurs. So, there are a few permutations of rendering a <Button />:
 * - [PASS] Isolated.
 * - [PASS] Inside a modal dialog.
 * - [PASS] Inside a modal dialog which manages its own visibility with a DialogTrigger.
 * - [PASS] Inside a modal dialog, itself in a table, which manages its own visibility without a DialogTrigger.
 * - [ERROR] Inside a modal dialog, itself in a table, which does not manage its own visibility.
 * - [ERROR] Content rendered in a table but not contained in a cell.
 *
 * I initially thought that the "bug" I found was that <Button />'s do not render in table contained modal dialogs where the visibility of the modal dialog is
 * managed at the level of the table component. But, it turns out that the issue is that content rendered in a table but not contained in a cell is not rendered.
 */

describe("reproduction of react-aria bug", () => {
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
    it("do buttons render when modal self manages showhide state via DialogTrigger?", async () => {
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

    it("do buttons render when modal self manages show/hide state but not managed via DialogTrigger?", async () => {
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

    it("does dialog render when table manages show/hide state?", async () => {
      render(<TableWithModalNotSelfManagingVisibility />);

      const table = screen.getByLabelText("Users");
      expect(table).toBeVisible();

      const row = within(table).getByRole("row", { name: /john doe/i });
      expect(row).toBeVisible();

      const deleteUserButton = within(row).getByRole("button", {
        name: /delete/i,
      });

      expect(deleteUserButton).toBeVisible();

      userEvent.click(deleteUserButton);

      // We very much expect the modal dialog to be visible.
      await waitFor(() => {
        expect(
          screen.getByRole("alertdialog", { name: /delete user/i })
        ).toBeVisible();
      });
    });

    it("does dialog render when table manages show/hide state and dialog is contained in a cell?", async () => {
      render(
        <TableWithModalNotSelfManagingVisibilityAndModalIsContainedInACell />
      );

      const table = screen.getByLabelText("Users");
      expect(table).toBeVisible();

      const row = within(table).getByRole("row", { name: /john doe/i });
      expect(row).toBeVisible();

      const deleteUserButton = within(row).getByRole("button", {
        name: /delete/i,
      });

      expect(deleteUserButton).toBeVisible();

      userEvent.click(deleteUserButton);

      // We very much expect the modal dialog to be visible.
      await waitFor(() => {
        expect(
          screen.getByRole("alertdialog", { name: /delete user/i })
        ).toBeVisible();
      });
    });

    
    it.only("does dialog render when table manages show/hide state and rows are generated with map?", async () => {
      render(
        <TableWithModalNotSelfManagingVisibilityIteratingWithMapToGenerateRows />
      );

      const table = screen.getByLabelText("Users");
      expect(table).toBeVisible();

      const row = within(table).getByRole("row", { name: /john doe/i });
      expect(row).toBeVisible();

      const deleteUserButton = within(row).getByRole("button", {
        name: /delete/i,
      });

      expect(deleteUserButton).toBeVisible();

      userEvent.click(deleteUserButton);

      // We very much expect the modal dialog to be visible.
      await waitFor(() => {
        expect(
          screen.getByRole("alertdialog", { name: /delete user/i })
        ).toBeVisible();
      });
    });

    it.only("do buttons render when table manages show/hide state and rows are generated with map?", async () => {
      render(
        <TableWithModalNotSelfManagingVisibilityIteratingWithMapToGenerateRows />
      );

      const table = screen.getByLabelText("Users");
      expect(table).toBeVisible();

      const row = within(table).getByRole("row", { name: /john doe/i });
      expect(row).toBeVisible();

      const deleteUserButton = within(row).getByRole("button", {
        name: /delete/i,
      });

      expect(deleteUserButton).toBeVisible();

      userEvent.click(deleteUserButton);

      // We very much expect the modal dialog to be visible.
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

    it.skip("do buttons render when modal uses native buttons and table manages show/hide state?", async () => {
      render(<TableWithNativeButtonModalNotSelfManagingVisibility />);

      const table = screen.getByLabelText("Users");
      expect(table).toBeVisible();

      const row = within(table).getByRole("row", { name: /john doe/i });
      expect(row).toBeVisible();

      const deleteUserButton = within(row).getByRole("button", {
        name: /delete/i,
      });

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

  it("shows content rendered in a table contained in a cell", () => {
    render(<TableWithContentContainedInACell />);

    const table = screen.getByLabelText("Users");
    expect(table).toBeVisible();

    const row = within(table).getByRole("row", { name: /john doe/i });
    expect(row).toBeVisible();

    // We would expect this element to be visible. This proves that the disappearance isn't unique to modal dialog buttons
    // but is instead a general issue where content rendered in a table but not contained in a cell is not rendered.
    expect(
      within(row).getByTestId("modal-with-content-not-contained-in-a-cell")
    ).toBeVisible();
  });

  it("shows content rendered in a table but not contained in a cell", () => {
    render(<TableWithContentNotContainedInACell />);

    const table = screen.getByLabelText("Users");
    expect(table).toBeVisible();

    const row = within(table).getByRole("row", { name: /john doe/i });
    expect(row).toBeVisible();

    // We would expect this element to be visible. This proves that the disappearance isn't unique to modal dialog buttons
    // but is instead a general issue where content rendered in a table but not contained in a cell is not rendered.
    expect(
      within(row).getByTestId("modal-with-content-not-contained-in-a-cell")
    ).toBeVisible();
  });
});
