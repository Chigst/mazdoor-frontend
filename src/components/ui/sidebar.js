import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState
} from "react";
import {
  ChevronLast,
  ChevronFirst,
  Home,
  Users,
  Phone,
  UserPlus,
  Briefcase,
  Check,
  X,
  Menu
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Utility to join classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Sidebar context
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const collapse = useCallback(() => setCollapsed(true), []);
  const expand = useCallback(() => setCollapsed(false), []);
  const toggle = useCallback(() => setCollapsed(prev => !prev), []);
  const collapseOnMouseLeave = useCallback(() => {
    if (!hovered) collapse();
  }, [hovered, collapse]);

  const value = useMemo(() => ({
    collapsed,
    hovered,
    setCollapsed,
    setHovered,
    collapse,
    expand,
    toggle,
    collapseOnMouseLeave
  }), [collapsed, hovered, collapse, expand, toggle, collapseOnMouseLeave]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const Sidebar = ({ children }) => {
  const {
    collapsed,
    toggle,
    setHovered,
    collapseOnMouseLeave
  } = useSidebar();

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        collapseOnMouseLeave();
      }}
      className={cn(
        "fixed inset-y-0 z-30 flex h-full flex-col border-r border-gray-200 bg-white text-gray-900 shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <h1
          className={cn(
            "text-lg font-semibold transition-opacity duration-300",
            collapsed ? "opacity-0" : "opacity-100"
          )}
        >
          Mazdoor
        </h1>
        <button
          onClick={toggle}
          className="rounded p-1 hover:bg-gray-100 focus:outline-none"
        >
          {collapsed ? (
            <ChevronLast className="h-5 w-5" />
          ) : (
            <ChevronFirst className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {children}
      </nav>
    </aside>
  );
};

export const SidebarSection = ({ children, title }) => {
  const { collapsed } = useSidebar();

  return (
    <div className="mb-4">
      {!collapsed && title && (
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export const SidebarItem = ({ icon: Icon, label, to }) => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
        isActive ? "bg-gray-200 text-black" : "text-gray-700"
      )}
    >
      {Icon && <Icon className="mr-3 h-5 w-5 text-gray-500" />}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export const SidebarFooter = ({ children }) => {
  return (
    <div className="border-t border-gray-200 px-4 py-3">
      {children}
    </div>
  );
};

export const SidebarTrigger = ({ className }) => {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      className={cn(
        "rounded p-2 text-gray-600 hover:bg-gray-100 focus:outline-none",
        className
      )}
    >
      <Menu className="h-5 w-5" />
    </button>
  );
};
