import { Settings2, SquareTerminal, MessageSquare } from "lucide-react";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Communication",
      url: "/dashboard/communication",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
};
export default data;
