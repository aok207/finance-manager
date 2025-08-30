import DashboardNavigation from "./dashboard-navigation";
import ProfileDropdown from "./profile-dropdown";

export default function DashboardHeader({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-lg">F</span>
            </div>
            <h1 className="text-white text-xl font-bold">Finance</h1>
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
