import {
  UserCircleIcon,
  DocumentArrowUpIcon,
  NumberedListIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import Navbar from "./navbar";
import Footer from "./footer";
const generateMenuItems = (menuList) => {
  return menuList.map((item, index) => {
    const label = item["@label"] || `Item ${index}`;

    // Extract submenu items using your logic
    const subMenuItems = (item.functionalAction || [])
      .map((action) => {
        const firstImpl = action.functionalActionImplementation?.[0];
        return firstImpl?.["@label"] || null;
      })
      .filter(Boolean); // Remove nulls

    if (subMenuItems.length > 0) {
      return (
        <li key={index}>
          <details>
            <summary className="hover:bg-gray-800 rounded-md px-2 py-1">
              {label}
            </summary>
            <ul>
              {subMenuItems.map((sub, subIndex) => (
                <li key={subIndex}>
                  <a className="hover:bg-gray-700 rounded-md px-2 py-1">
                    {sub}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </li>
      );
    }

    return (
      <li key={index}>
        <a className="hover:bg-gray-800 rounded-md px-2 py-1">{label}</a>
      </li>
    );
  });
};
// Optional: map icon names to actual icons
const iconMap = {
  profile: <UserCircleIcon className="h-6 w-6" />,
  upload: <DocumentArrowUpIcon className="h-6 w-6" />,
  list: <NumberedListIcon className="h-6 w-6" />,
};

const Layout = ({ children }) => {
  const { menudata } = useContext(DataContext);

  const generateMenuItems = (menuList) => {
    return menuList.map((item, index) => {
      const label = item["@label"] || `Item ${index}`;
      const iconKey = item.icon || "profile";
      const icon = iconMap[iconKey] || <UserCircleIcon className="h-6 w-6" />;
      const path = item.path || "#";

      // Normalize functionalAction to always be an array
      const actions = Array.isArray(item.functionalAction)
        ? item.functionalAction
        : item.functionalAction
        ? [item.functionalAction]
        : [];

      const subMenuItems = actions
        .map((action) => {
          const firstImpl = Array.isArray(action.functionalActionImplementation)
            ? action.functionalActionImplementation[0]
            : action.functionalActionImplementation;
          return firstImpl?.["@label"] || null;
        })
        .filter(Boolean); // remove nulls

      if (subMenuItems.length > 0) {
        return (
          <li key={index}>
            <details>
              <summary className="hover:bg-gray-800 rounded-md flex items-center">
                {icon}
                <span className="ml-2 hidden group-hover:inline">{label}</span>
              </summary>
              <ul>
                {subMenuItems.map((subLabel, subIndex) => (
                  <li key={subIndex}>
                    <a className="hover:bg-gray-700 rounded-md px-2 py-1">
                      {subLabel}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        );
      }

      return (
        <li key={index}>
          <a
            href={path}
            className="hover:bg-gray-800 rounded-md flex items-center"
          >
            {icon}
            <span className="ml-2 hidden group-hover:inline">{label}</span>
          </a>
        </li>
      );
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="group relative h-[calc(100vh-4rem)]">
          <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-black text-white h-full overflow-hidden">
            <ul className="menu p-4 space-y-2">
              {generateMenuItems(menudata)}
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
