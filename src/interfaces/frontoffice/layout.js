import {
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
  InboxIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Navbar from "./navbar";
import Footer from "./footer";
import ChatbotCard from "../ChatbotCard";

const iconMap = {
  PAD: AcademicCapIcon,
  ABS: CalendarDaysIcon,
  GTA: ClockIcon,
  GAF: ChartBarIcon,
  RSK: ShieldCheckIcon,
  SKL: ClipboardDocumentListIcon,
  TRA: PresentationChartLineIcon,
  SRQ: InboxIcon,
  ASS: UserGroupIcon,
};

const Layout = ({ children }) => {
  const { menudata } = useContext(DataContext);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // --- NEW: State for the filtered menu and its loading status ---
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  // This useEffect for the video remains unchanged
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const hasVideoPlayed = localStorage.getItem("hasVideoPlayed");

    if (hasVideoPlayed) {
      const setLastFrame = () => {
        if (videoElement.duration) {
          videoElement.currentTime = videoElement.duration;
          videoElement.pause();
        }
      };

      if (videoElement.readyState >= 1) {
        setLastFrame();
      } else {
        videoElement.addEventListener("loadedmetadata", setLastFrame, {
          once: true,
        });
      }
    } else {
      videoElement.play().catch((error) => {
        console.error("Video autoplay was prevented by the browser:", error);
      });
    }
  }, []);

  // --- NEW: useEffect to filter and validate the menu data ---
  useEffect(() => {
    const filterAndValidateMenu = async () => {
      // Don't run if there's no data from the context
      if (!menudata || menudata.length === 0) {
        setIsMenuLoading(false);
        setFilteredMenu([]);
        return;
      }

      setIsMenuLoading(true);

      // Map each top-level menu item to a promise.
      // This promise will resolve to a new item with its actions pre-filtered.
      const validatedMenuPromises = menudata.map(async (item) => {
        // Ensure 'actions' is always an array
        const actions = Array.isArray(item.functionalAction)
          ? item.functionalAction
          : item.functionalAction
          ? [item.functionalAction]
          : [];

        // Create a validation promise for each action within the current item
        const validatedActionPromises = actions.map(async (action) => {
          const impl = Array.isArray(action.functionalActionImplementation)
            ? action.functionalActionImplementation[0]
            : action.functionalActionImplementation;

          const subName = impl?.["@name"];
          if (!subName) return null; // Can't validate without a name

          try {
            // Check against the local API
            const response = await fetch(
              `http://localhost:8080/api/forms/${subName}`
            );
            // If the response is OK, the form exists. Keep the action. Otherwise, return null.
            return response.ok ? action : null;
          } catch (err) {
            console.warn(`Validation check failed for form '${subName}':`, err);
            return null; // Discard if the check itself errors
          }
        });

        // Wait for all actions in the current item to be validated
        const validatedActions = await Promise.all(validatedActionPromises);

        // Filter out the nulls (the non-existent actions)
        const validActionsOnly = validatedActions.filter(Boolean);

        // Return a new menu item object containing only the valid actions
        return { ...item, functionalAction: validActionsOnly };
      });

      // Wait for all top-level menu items to be processed
      const menuWithFilteredActions = await Promise.all(validatedMenuPromises);

      // Finally, remove any top-level menu items that have no valid sub-items left
      const finalMenu = menuWithFilteredActions.filter(
        (item) => item.functionalAction.length > 0
      );

      setFilteredMenu(finalMenu);
      setIsMenuLoading(false);
    };

    filterAndValidateMenu().catch((error) => {
      console.error("Failed to filter and validate menu:", error);
      setIsMenuLoading(false);
    });
  }, [menudata]); // This effect re-runs whenever 'menudata' from the context changes

  const handleVideoEnd = () => {
    localStorage.setItem("hasVideoPlayed", "true");
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // This function now works on pre-filtered data, but its internal logic is the same
  const generateMenuItems = (menuList) =>
    menuList.map((item, idx) => {
      const label = item["@label"] || `Item ${idx}`;
      const gpName = item["@name"];
      const IconComponent = iconMap[gpName] || AcademicCapIcon;

      // This is guaranteed to be an array of valid actions now
      const actions = item.functionalAction;

      return (
        <li key={idx}>
          <details>
            <summary className="hover:bg-gray-800 rounded-md flex items-center px-2 py-1">
              <IconComponent className="h-6 w-6" />
              <span className="ml-2 hidden group-hover:inline">{label}</span>
            </summary>
            <ul>
              {actions.map((action, aidx) => {
                const impl = Array.isArray(
                  action.functionalActionImplementation
                )
                  ? action.functionalActionImplementation[0]
                  : action.functionalActionImplementation;

                const subLabel = impl?.["@label"];
                const subName = impl?.["@name"];

                if (!subLabel || !subName) return null;

                return (
                  <li key={aidx}>
                    <button
                      onClick={async () => {
                        try {
                          // This fetch is for a known-to-be-valid form
                          const res = await fetch(
                            `http://localhost:8080/api/forms/${subName}`
                          );
                          if (!res.ok)
                            throw new Error("Failed to fetch form XML");

                          const xmlText = await res.text();
                          navigate("/form-render", {
                            state: {
                              xmlData: xmlText,
                              formLabel: subLabel,
                              formName: subName,
                            },
                          });
                        } catch (err) {
                          console.error("Error loading form:", err);
                          alert("Error loading form, check console");
                        }
                      }}
                      className="hover:bg-gray-700 rounded-md px-2 py-1 text-left w-full"
                    >
                      {subLabel}
                    </button>
                  </li>
                );
              })}
            </ul>
          </details>
        </li>
      );
    });

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <video
        ref={videoRef}
        src="/images/Scene-13 (2).mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted
        playsInline
        onEnded={handleVideoEnd}
        preload="auto"
      />
      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <div className="group relative h-[calc(100vh-4rem)]">
            <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white/10 backdrop-blur-sm text-white h-full overflow-hidden">
              <ul className="menu p-4 space-y-2">
                {/* --- UPDATE: Conditional rendering for loading state --- */}
                {isMenuLoading ? (
                  <li>Loading menu...</li>
                ) : (
                  generateMenuItems(filteredMenu)
                )}
              </ul>
            </div>
          </div>
          <main className="flex-1 p-4 overflow-y-auto h-[calc(100vh-4rem)] pb-[100px]  bg-transparent">
            {children}
          </main>
        </div>
        <Footer />
      </div>
      <ChatbotCard />
    </div>
  );
};

export default Layout;
