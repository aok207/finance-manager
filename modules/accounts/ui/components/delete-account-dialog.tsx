"use client";

import { GenericDeleteDialog } from "@/components/generic-delete-dialog";
import { deleteAccount } from "@/modules/accounts/api/actions";

interface DeleteAccountDialogProps {
  account: { id: string; name: string };
}

export function DeleteAccountDialog({ account }: DeleteAccountDialogProps) {
  return (
    <GenericDeleteDialog
      entity={account}
      entityDisplayName={account.name}
      entityTypeName="Account"
      deleteAction={deleteAccount}
      showLoadingIcon={false}
    />
  );
}
