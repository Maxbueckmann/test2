import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Settings, FileText } from "lucide-react";

interface SidebarProps {
  activeSection?: "timesheet" | "config";
  onSectionChange?: (section: "timesheet" | "config") => void;
}

const Sidebar = ({
  activeSection = "timesheet",
  onSectionChange = () => {},
}: SidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-background border-r border-border p-4 flex flex-col">
      {/* Logo/Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#4CAF50]" />
          TimeTracker
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        <Button
          variant={activeSection === "timesheet" ? "default" : "ghost"}
          className={`w-full justify-start gap-2 ${activeSection === "timesheet" ? "bg-[#4CAF50] hover:bg-[#45a049]" : ""}`}
          onClick={() => onSectionChange("timesheet")}
        >
          <FileText className="w-5 h-5" />
          Timesheet
        </Button>

        <Button
          variant={activeSection === "config" ? "default" : "ghost"}
          className={`w-full justify-start gap-2 ${activeSection === "config" ? "bg-[#4CAF50] hover:bg-[#45a049]" : ""}`}
          onClick={() => onSectionChange("config")}
        >
          <Settings className="w-5 h-5" />
          Configuration
        </Button>
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
            alt="User avatar"
            className="w-10 h-10 rounded-full bg-gray-700"
          />
          <div>
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-gray-400">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
