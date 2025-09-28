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
 * TL;DR: When rendered in a table, modal dialogs are not rendered when the visibility of the modal dialog is managed at the level of the table component and the table rows are generated from render props.
 *
 * The real use case involves a table that manages modal visibility because it has a popover with multiple user actions.
 * See use-case.png for an illustration.
 *
 */

const users = [
  { key: "1", definition: { name: "John Doe" } },
  { key: "2", definition: { name: "Jane Doe" } },
];

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

export function TableWithModalNotSelfManagingVisibilityUsingRenderPropsPattern() {
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState<{
    [key: string]: boolean;
  }>({});

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
                  <Button
                    onPress={() =>
                      setIsDeleteUserModalOpen({
                        ...isDeleteUserModalOpen,
                        [user.key]: true,
                      })
                    }
                  >
                    Delete user…
                  </Button>
                </Cell>
                {isDeleteUserModalOpen[user.key] ? (
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

export function TableWithModalNotSelfManagingVisibilityNotUsingRenderPropsPattern() {
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState<{
    [key: string]: boolean;
  }>({});

  return (
    <>
      <Table aria-label="Users">
        <TableHeader>
          <Column isRowHeader>Name</Column>
          {/* There is an empty column header for the delete user button */}
          <Column />
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <>
              <Row key={user.key}>
                <Cell>{user.definition.name}</Cell>
                <Cell>
                  <Button
                    onPress={() =>
                      setIsDeleteUserModalOpen({
                        ...isDeleteUserModalOpen,
                        [user.key]: true,
                      })
                    }
                  >
                    Delete user…
                  </Button>
                </Cell>
                {isDeleteUserModalOpen[user.key] ? (
                  <ModalNotSelfManagingVisibility />
                ) : null}
              </Row>
            </>
          ))}
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
