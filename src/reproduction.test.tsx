import React from "react";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  TableWithModalSelfManagingVisibilityWithDialogTrigger,
  TableWithModalNotSelfManagingVisibilityUsingRenderPropsPattern,
  TableWithModalNotSelfManagingVisibilityNotUsingRenderPropsPattern,
} from "./reproduction";

/**
 * The examples below are pretty contrived.
 *
 * TL;DR: When rendered in a table, modal dialogs are not rendered when the visibility of the modal dialog is managed at the level of the table component and the table rows are generated from render props.
 *
 * The real use case involves a table that manages modal visibility because it has a popover with multiple user actions.
 * See use-case.png for an illustration.
 *
 */

describe("reproduction of react-aria bug", () => {
  it("modal dialog renders when modal self manages visibility state?", async () => {
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
  });

  describe("when table manages visibility state", () => {
    it("modal dialog renders when using a render function?", async () => {
      render(
        <TableWithModalNotSelfManagingVisibilityUsingRenderPropsPattern />
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

    it("modal dialog renders when not using a render function", async () => {
      render(
        <TableWithModalNotSelfManagingVisibilityNotUsingRenderPropsPattern />
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

      await waitFor(() => {
        expect(
          screen.getByRole("alertdialog", { name: /delete user/i })
        ).toBeVisible();
      });
    });
  });
});
