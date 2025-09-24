import React from "react";
import {
  Button,
  Dialog,
  Modal,
  ModalOverlay,
  TableHeader,
  Table,
  TableBody,
  Column,
  Cell,
  Heading,
} from "react-aria-components";

export const Bug = () => {
  return (
    <div>
      {/* <ModalComponent /> */}
      <ModalInsideTableComponent />
    </div>
  );
};

function ModalComponent() {
  return (
    <ModalOverlay
      isOpen={true}
      className="fixed inset-0 z-[100] flex justify-center overflow-y-scroll bg-black/25 p-4 pt-12"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      onOpenChange={() => {}}
    >
      <Modal>
        <Dialog className="flex h-full flex-col justify-center">
          <Heading slot="title">Modal To Test</Heading>
          <Button
            onPress={() => {}}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Close
          </Button>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function ModalInsideTableComponent() {
  return (
    <div className="flex min-w-full flex-col items-end py-2 align-middle sm:px-6 lg:px-8">
      <ModalComponent />
      <Table aria-label="table">
        <TableHeader className="outline-none">
          <Column>Name</Column>
        </TableHeader>
        <TableBody
          items={[{ key: "1", definition: { name: "test" } }]}
          className="bg-white"
        >
          <Cell>test</Cell>
        </TableBody>
      </Table>
    </div>
  );
}

export function IsolatedButton() {
  return <Button>Cancel</Button>;
}

export function ButtonInsideModal() {
  return (
    <ModalOverlay isOpen={true}>
      <Modal>
        <Dialog>
          <Heading slot="title">Modal To Test</Heading>
          <IsolatedButton />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export function ModalInsideTableWithButtonInsideModal() {
  return (
    <div>
      <ButtonInsideModal />
      <Table aria-label="table">
        <TableHeader>
          <Column>Name</Column>
        </TableHeader>
        <TableBody items={[{ key: "1", definition: { name: "test" } }]}>
          <Cell>test</Cell>
        </TableBody>
      </Table>
    </div>
  );
}
