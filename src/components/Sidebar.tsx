"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban,
  ChevronLeft,
  Menu
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
    { href: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
  ];

  return (
    <div className="fixed z-100">
      <nav 
        className={`
          h-[calc(100vh-4rem)] bg-gray-800 text-white transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex justify-start p-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {collapsed ? (
              <Menu size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
                {collapsed && (
                  <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 