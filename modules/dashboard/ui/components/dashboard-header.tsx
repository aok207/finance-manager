import DashboardNavigation from "./dashboard-navigation";
import ProfileDropdown from "./profile-dropdown";

export default function DashboardHeader({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <header className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-sm dark:shadow-slate-950/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 dark:shadow-purple-900/40">
              <span className="text-white font-bold text-xl">₭</span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-slate-50 text-xl font-bold tracking-tight">FinanceFlow</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart money management</p>
            </div>
          </div>

          <DashboardNavigation />

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <ProfileDropdown user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
