import { redirect } from "next/navigation";
import AccountsPage from "@/modules/accounts/pages/accounts-page";
import { getAccounts } from "@/modules/accounts/api/queries";

export default async function Accounts() {
  const { data: accounts, success } = await getAccounts();

  if (!success) {
    redirect("/login");
  }

  return <AccountsPage accounts={accounts!} />;
}
