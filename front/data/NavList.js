// navList.js
const NavList = [
  {
    id: "1",
    title: "Home",
    url: "#home",
  },
  {
    id: "2",
    title: "Services",
    url: "#services",
  },
  {
    id: "3",
    title: "Features",
    url: "#features",
  },
];
const features = [
  {
    key: 1,
    title: "Centralized Task Management",
    imageClassName: "w-full h-full",
    img: "/b1.svg",
    description:
      "Organize all your projects and tasks in one place with clear deadlines, priorities, and progress tracking. Ensure your team stays aligned and productive with real-time updates",
  },
  {
    key: 2,
    img: "/grid.svg",
    imageClassName: "",
    title: "Team Collaboration Tools",
    description:
      "Streamline communication with built-in chat, file sharing, and collaborative tools. Keep everyone on the same page and reduce the need for external apps",
  },
  {
    key: 3,
    img: "/grid.svg",
    imageClassName: "",
    title: "Resource and Timeline Planning",
    description:
      "Optimize resource allocation with advanced scheduling and dependency management. Visualize project timelines using Gantt charts and ensure efficient delivery",
  },
  {
    key: 4,
    img: "/grid.svg",
    imageClassName: "",
    title: "Performance Analytics and Reporting",
    description:
      "Monitor team performance and project progress with insightful dashboards and reports. Use data-driven insights to make informed decisions and improve project outcomes",
  },
];
const testimonials = [
  {
    key: 1,
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Seif Jaafar",
    designation: "Product Manager at TechFlow",
    src: "/Seifjaafar.webp",
  },
  {
    key: 2,
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Bensa",
    designation: "CTO at InnovateSphere",
    src: "/Seifjaafar.webp",
  },
  {
    key: 3,
    quote:
      "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: "Il Hoss",
    designation: "Operations Director at CloudScale",
    src: "/Seifjaafar.webp",
  },
];

export default { NavList, features, testimonials };
