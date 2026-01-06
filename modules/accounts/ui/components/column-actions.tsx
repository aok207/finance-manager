import { GenericColumnActions } from "@/components/generic-column-actions";
import { EditAccountDialog } from "./edit-account-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";

function ColumnActions({
  account,
}: {
  account: { id: string; name: string; balance: number };
}) {
  // Adapter components to match the expected prop interface
  const EditAdapter = ({ entity }: { entity: typeof account }) => (
    <EditAccountDialog account={entity} />
  );

  const DeleteAdapter = ({ entity }: { entity: typeof account }) => (
    <DeleteAccountDialog account={entity} />
  );

  return (
    <GenericColumnActions
      entity={account}
      EditDialog={EditAdapter}
      DeleteDialog={DeleteAdapter}
    />
  );
}

export default ColumnActions;
