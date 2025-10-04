import DashboardPage from "@/modules/dashboard/pages/dashboard-page";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <DashboardPage searchParams={await searchParams} />;
}
