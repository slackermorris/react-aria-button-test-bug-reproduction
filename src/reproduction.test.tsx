import React from "react";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  TableWithModalSelfManagingVisibilityWithDialogTrigger,
  TableWithModalNotSelfManagingVisibilityUsingRenderPropsPattern,
  TableWithModalNotSelfManagingVisibilityNotUsingRenderPropsPattern,
  TableWithTestElementNotSelfManagingVisibilityUsingRenderPropsPattern,
  TableWithTestElementNotSelfManagingVisibilityNotUsingRenderPropsPattern,
  TableWithModalNotSelfManagingVisibilityUsingRenderPropsPatternWithDependencies,
  TableWithModalManagingVisibilityInCellUsingRenderPropsPattern,
} from "./reproduction";

/**
 * TL;DR: When rendered in a table, items (modal dialogs, test elements, etc.) are not rendered when the visibility of the item is managed at the level of the table component and the table rows are generated from render props.
 *
 * The examples below are pretty contrived.
 *
 * The real use case involves a table that manages modal visibility because it has a popover with multiple user actions.
 * See use-case.png for an illustration.
 *
 */

describe("reproduction of possible react-aria bug", () => {
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
    describe("when using render props pattern", () => {
      it("modal dialog renders?", async () => {
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

      it("non modal dialog test element renders?", async () => {
        // Prove that conditional rendering any element (not modal dialog specific) does not work when the visibility of the element is managed at the level of the table component and the table rows are generated from render props.
        render(
          <TableWithTestElementNotSelfManagingVisibilityUsingRenderPropsPattern />
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
          expect(screen.getByTestId("1-element")).toBeVisible();
        });
      });

      it("modal dialog renders when dependencies change?", async () => {
        render(
          <TableWithModalNotSelfManagingVisibilityUsingRenderPropsPatternWithDependencies />
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

      it("modal dialog renders when visibility state is managed in a cell?", async () => {
        render(
          <TableWithModalManagingVisibilityInCellUsingRenderPropsPattern />
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
    });

    describe("when NOT using render props pattern", () => {
      it("modal dialog renders?", async () => {
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

      it("non modal dialog test element renders?", async () => {
        // Prove that conditional rendering any element (not modal dialog specific) does not work when the visibility of the element is managed at the level of the table component and the table rows are generated from render props.
        render(
          <TableWithTestElementNotSelfManagingVisibilityNotUsingRenderPropsPattern />
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
          expect(screen.getByTestId("1-element")).toBeVisible();
        });
      });
    });
  });
});
