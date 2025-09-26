import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  TableHeader,
  Table,
  TableBody,
  Column,
  Cell,
  Heading,
  Row,
  type ButtonProps,
} from "react-aria-components";

/**
 * The examples below are pretty contrived.
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
 *
 * The "bug" I found is that <Button />'s do not render in table contained modal dialogs where the visibility of the modal dialog is
 * managed at the level of the table component.
 */

const users = [
  { key: "1", definition: { name: "John Doe" } },
  { key: "2", definition: { name: "Jane Doe" } },
];

export function IsolatedButton() {
  return <DialogButton>Cancel</DialogButton>;
}

export function ModalSelfManagingVisibilityWithDialogTrigger() {
  return (
    <div>
      <DialogTrigger>
        <Button>Delete user…</Button>
        <ModalOverlay>
          <Modal>
            <Dialog role="alertdialog">
              {({ close }) => (
                <>
                  <Heading slot="title">Delete user</Heading>

                  <p>Are you sure you want to delete this user?</p>
                  <div>
                    <DialogButton onPress={close}>Cancel</DialogButton>
                    <DialogButton onPress={close}>Delete</DialogButton>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
  );
}

export function TableWithModalSelfManagingVisibilityWithDialogTrigger() {
  return (
    <>
      <Table aria-label="Users">
        <TableHeader>
          <Column isRowHeader>Name</Column>
          {/* There is an empty column header for the delete user button */}
          <Column />
        </TableHeader>
        <TableBody items={users}>
          {(user) => (
            <Row key={user.key}>
              <Cell>{user.definition.name}</Cell>
              <Cell>
                <ModalSelfManagingVisibilityWithDialogTrigger />
              </Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export function TableWithModalSelfManagingVisibilityWithoutDialogTrigger() {
  return (
    <>
      <Table aria-label="Users">
        <TableHeader>
          <Column isRowHeader>Name</Column>
          {/* There is an empty column header for the delete user button */}
          <Column />
        </TableHeader>
        <TableBody items={users}>
          {(user) => (
            <Row key={user.key}>
              <Cell>{user.definition.name}</Cell>
              <Cell>
                <ModalSelfManagingVisibilityWithoutDialogTrigger />
              </Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export function TableWithModalNotSelfManagingVisibility() {
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  return (
    <>
      <Table aria-label="Users">
        <TableHeader>
          <Column isRowHeader>Name</Column>
          {/* There is an empty column header for the delete user button */}
          <Column />
        </TableHeader>
        <TableBody items={users}>
          {(user) => (
            <>
              <Row key={user.key}>
                <Cell>{user.definition.name}</Cell>
                <Cell>
                  <Button onPress={() => setIsDeleteUserModalOpen(true)}>
                    Delete user…
                  </Button>
                </Cell>
                {isDeleteUserModalOpen ? (
                  <ModalNotSelfManagingVisibility />
                ) : null}
              </Row>
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export function TableWithNativeButtonModalNotSelfManagingVisibility() {
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  return (
    <>
      <Table aria-label="Users">
        <TableHeader>
          <Column isRowHeader>Name</Column>
          {/* There is an empty column header for the delete user button */}
          <Column />
        </TableHeader>
        <TableBody items={users}>
          {(user) => (
            <>
              <Row key={user.key}>
                <Cell>{user.definition.name}</Cell>
                <Cell>
                  <Button onPress={() => setIsDeleteUserModalOpen(true)}>
                    Delete user…
                  </Button>
                </Cell>
                {isDeleteUserModalOpen ? (
                  <ModalUsingNativeButtonsNotSelfManagingVisibility />
                ) : null}
              </Row>
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
}

function DialogButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={`inline-flex justify-center rounded-md border border-solid border-transparent px-5 py-2 font-semibold font-[inherit] text-base transition-colors cursor-default outline-hidden focus-visible:ring-2 ring-blue-500 ring-offset-2 ${className}`}
    />
  );
}

function ModalSelfManagingVisibilityWithoutDialogTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Delete user…</Button>

      <div>
        <ModalOverlay isOpen={isOpen}>
          <Modal>
            <Dialog role="alertdialog">
              {({ close }) => (
                <>
                  <Heading slot="title">Delete user</Heading>

                  <p>Are you sure you want to delete this user?</p>
                  <div>
                    <DialogButton onPress={close}>Cancel</DialogButton>
                    <DialogButton onPress={close}>Delete</DialogButton>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </div>
    </>
  );
}

function ModalNotSelfManagingVisibility() {
  return (
    <div>
      <ModalOverlay isOpen={true}>
        <Modal>
          <Dialog role="alertdialog">
            {({ close }) => (
              <>
                <Heading slot="title">Delete user</Heading>

                <p>Are you sure you want to delete this user?</p>
                <div>
                  <DialogButton onPress={close}>Cancel</DialogButton>
                  <DialogButton onPress={close}>Delete</DialogButton>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}

function ModalUsingNativeButtonsNotSelfManagingVisibility() {
  return (
    <div>
      <ModalOverlay isOpen={true}>
        <Modal>
          <Dialog role="alertdialog">
            {({ close }) => (
              <>
                <Heading slot="title">Delete user</Heading>

                <p>Are you sure you want to delete this user?</p>
                <div>
                  <button onClick={close}>Cancel</button>
                  <button onClick={close}>Delete</button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}
