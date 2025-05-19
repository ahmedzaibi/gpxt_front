import { UserCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import Navbar from "./navbar";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black  flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="group relative h-[calc(100vh-4rem)]">
          <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-black text-white h-full overflow-hidden">
            <ul className="menu p-4 space-y-2">
              <li>
                <a href="/home" className="hover:bg-gray-800 rounded-md">
                                    <UserCircleIcon className="h-6 w-6" />
 <span className="ml-2 hidden group-hover:inline">profile</span>
                </a>
              </li>
              <li>
                <a href="/upload" className="hover:bg-gray-800 rounded-md">
                                  <DocumentArrowUpIcon className="h-6 w-6" />

                   <span className="ml-2 hidden group-hover:inline">Upload XML</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <main className="flex-1 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
