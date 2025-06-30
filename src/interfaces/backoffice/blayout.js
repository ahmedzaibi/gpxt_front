import BNavbar from "./bnavbar";
import BFooter from "./bfooter";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

const BLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <img
        src="/images/backobackg.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 flex flex-col flex-1">
        <BNavbar />
        <div className="flex flex-1">
          <div className="group">
            <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-gray-800 text-white h-full">
              <ul className="menu p-4 space-y-2">
                <li>
                  <a
                    href="/gp-management"
                    className="flex items-center p-2 rounded-md hover:bg-gray-700"
                  >
                    <ClipboardDocumentListIcon className="h-6 w-6 flex-shrink-0" />
                    <span className="ml-4 hidden group-hover:inline whitespace-nowrap">
                      Gestion des GP
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-transparent">
            {children}
          </main>
        </div>
        <BFooter />
      </div>
    </div>
  );
};

export default BLayout;
