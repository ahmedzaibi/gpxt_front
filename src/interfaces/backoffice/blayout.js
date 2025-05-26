import BNavbar from "./bnavbar";
import BFooter from "./bfooter";
import {
  UsersIcon,
  UserPlusIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const BLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/images/bg1.jpg')" }}
    >
      <BNavbar />

      <div className="flex flex-1 bg-gray-900/80 text-white">
        <div className="group relative h-[calc(100vh-4rem)]">
          <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-gray-800 text-white h-full overflow-hidden">
            <ul className="menu p-4 space-y-2">
              <li>
                <a href="/user-list" className="hover:bg-gray-700 rounded-md">
                  <UsersIcon className="h-6 w-6" />
                  <span className="ml-2 hidden group-hover:inline">
                    Afficher utilisateurs
                  </span>
                </a>
              </li>
              <li>
                <a href="/add-user" className="hover:bg-gray-700 rounded-md">
                  <UserPlusIcon className="h-6 w-6" />
                  <span className="ml-2 hidden group-hover:inline">
                    Ajouter utilisateur
                  </span>
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:bg-gray-700 rounded-md">
                  <ChartBarIcon className="h-6 w-6" />
                  <span className="ml-2 hidden group-hover:inline">
                    Tableau de bord
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <main className="flex-1 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      <BFooter />
    </div>
  );
};

export default BLayout;
