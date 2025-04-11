
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { 
  Code2, 
  History, 
  Home, 
  LogOut, 
  Moon,
  Settings, 
  Sun,
  User
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Code Review", url: "/review", icon: Code2 },
    { title: "History", url: "/history", icon: History },
    { title: "Profile", url: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <SidebarHeader className="py-6 px-4">
          <h1 className="text-xl font-bold flex items-center gap-2 text-white">
            <Code2 className="h-6 w-6 text-primary-purple" />
            CodeCritique
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      onClick={() => navigate(item.url)}
                      className={window.location.pathname === item.url ? "bg-sidebar-accent" : ""}
                    >
                      <div className="flex items-center gap-2 cursor-pointer">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="py-4 px-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-2 py-1">
              <User className="h-4 w-4 text-primary-purple" />
              <span className="text-sm text-white">{user?.name}</span>
            </div>
            <Toggle 
              pressed={theme === "dark"}
              onPressedChange={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-full flex items-center justify-center gap-2 py-2 bg-sidebar-accent/20 hover:bg-sidebar-accent/30"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-white" />
                  <span className="text-sm text-white">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-white" />
                  <span className="text-sm text-white">Dark Mode</span>
                </>
              )}
            </Toggle>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 border-sidebar-accent text-white hover:text-white hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1">
        <div className="flex justify-between items-center p-6 mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="md:hidden">
            <Toggle 
              pressed={theme === "dark"}
              onPressedChange={toggleTheme}
              aria-label="Toggle dark mode"
              className="bg-background/10 backdrop-blur-sm hover:bg-background/20"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Toggle>
          </div>
        </div>
        <main className="px-6 pb-6 flex justify-center">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
