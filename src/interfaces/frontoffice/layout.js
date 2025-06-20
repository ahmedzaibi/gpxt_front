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
import { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Navbar from "./navbar";
import Footer from "./footer";
import ChatbotCard from "../ChatbotCard"; // ✅ import it
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

  useEffect(() => {
    videoRef.current?.play();
  }, []);

  const generateMenuItems = (menuList) =>
    menuList.map((item, idx) => {
      const label = item["@label"] || `Item ${idx}`;
      const gpName = item["@name"];
      const IconComponent = iconMap[gpName] || AcademicCapIcon;

      const actions = Array.isArray(item.functionalAction)
        ? item.functionalAction
        : item.functionalAction
        ? [item.functionalAction]
        : [];

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
        autoPlay
        playsInline
        onEnded={(e) => e.target.pause()}
      />
      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <div className="group relative h-[calc(100vh-4rem)]">
            <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white/10 backdrop-blur-sm text-white h-full overflow-hidden">
              <ul className="menu p-4 space-y-2">
                {generateMenuItems(menudata)}
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
