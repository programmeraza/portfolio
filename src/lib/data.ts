// ============================================================
// DATA FILE — Replace all placeholder content with your own!
// ============================================================

export const siteConfig = {
  name: "YOUR NAME",
  title: "Frontend Developer",
  description:
    "Crafting exceptional digital experiences with modern web technologies. Specializing in React, Next.js, and immersive UI animations.",
  email: "your@email.com",
  location: "Your City, Country",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  telegram: "https://t.me/yourusername",
  availableForWork: true,
};

export const skills = {
  frontend: [
    { name: "React / Next.js", level: 95, icon: "⚛️" },
    { name: "TypeScript", level: 90, icon: "🔷" },
    { name: "GSAP / Animations", level: 88, icon: "✨" },
    { name: "CSS / Tailwind", level: 93, icon: "🎨" },
    { name: "Three.js / WebGL", level: 75, icon: "🌐" },
    { name: "Vue.js", level: 80, icon: "💚" },
  ],
  tools: [
    { name: "Git / GitHub", level: 92, icon: "🐙" },
    { name: "Figma", level: 85, icon: "🎭" },
    { name: "Webpack / Vite", level: 82, icon: "⚡" },
    { name: "Docker", level: 65, icon: "🐳" },
    { name: "Node.js", level: 78, icon: "🟩" },
    { name: "REST / GraphQL", level: 85, icon: "🔗" },
  ],
};

export const techStack = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "GSAP", color: "#88CE02" },
  { name: "Three.js", color: "#ffffff" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Node.js", color: "#339933" },
  { name: "Git", color: "#F05032" },
  { name: "Vue.js", color: "#4FC08D" },
];

export const projects = [
  {
    id: 1,
    title: "Project Alpha",
    description:
      "A cutting-edge web application with immersive animations and real-time data visualization. Built with React, GSAP, and D3.js for stunning visual experiences.",
    longDescription:
      "This project showcases the power of modern frontend technologies combined with thoughtful UX design. Features include real-time data streaming, WebSocket integration, complex GSAP timelines, and a fully responsive design system.",
    tech: ["React", "TypeScript", "GSAP", "D3.js", "WebSocket"],
    category: "App",
    image: "/projects/project1.jpg",
    liveUrl: "https://your-project-1.vercel.app",
    githubUrl: "https://github.com/yourusername/project-1",
    featured: true,
    color: "#06B6D4",
  },
  {
    id: 2,
    title: "Project Beta",
    description:
      "An e-commerce platform with buttery-smooth animations, 3D product views, and blazing-fast performance. Achieved 98 Lighthouse score.",
    longDescription:
      "Complete e-commerce solution built from scratch with Next.js 14, featuring SSR/ISR for performance, Stripe payment integration, and Three.js for 3D product visualization.",
    tech: ["Next.js", "Three.js", "Stripe", "Tailwind", "PostgreSQL"],
    category: "E-commerce",
    image: "/projects/project2.jpg",
    liveUrl: "https://your-project-2.vercel.app",
    githubUrl: "https://github.com/yourusername/project-2",
    featured: true,
    color: "#8B5CF6",
  },
  {
    id: 3,
    title: "Project Gamma",
    description:
      "A creative agency website with award-worthy interactions, magnetic cursor, and cinematic page transitions.",
    longDescription:
      "Agency website featuring custom WebGL shaders, GSAP ScrollTrigger storytelling, magnetic elements, and smooth page transitions that earned recognition on Awwwards.",
    tech: ["Next.js", "GSAP", "WebGL", "Framer Motion"],
    category: "Website",
    image: "/projects/project3.jpg",
    liveUrl: "https://your-project-3.vercel.app",
    githubUrl: "https://github.com/yourusername/project-3",
    featured: false,
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Project Delta",
    description:
      "A SaaS dashboard with complex data tables, real-time charts, and a custom design system built from scratch.",
    longDescription:
      "Full-stack SaaS application with role-based access control, real-time analytics dashboard, custom component library, and comprehensive testing suite.",
    tech: ["React", "TypeScript", "Recharts", "Zustand", "Node.js"],
    category: "Dashboard",
    image: "/projects/project4.jpg",
    liveUrl: "https://your-project-4.vercel.app",
    githubUrl: "https://github.com/yourusername/project-4",
    featured: false,
    color: "#10B981",
  },
  {
    id: 5,
    title: "Project Epsilon",
    description:
      "Mobile-first PWA with offline support, push notifications, and native-like gestures built with React.",
    longDescription:
      "Progressive Web App with full offline capabilities, background sync, push notifications, and gesture-based navigation that feels truly native on mobile devices.",
    tech: ["React", "PWA", "Service Workers", "IndexedDB"],
    category: "Mobile",
    image: "/projects/project5.jpg",
    liveUrl: "https://your-project-5.vercel.app",
    githubUrl: "https://github.com/yourusername/project-5",
    featured: false,
    color: "#EF4444",
  },
  {
    id: 6,
    title: "Project Zeta",
    description:
      "An AI-powered content platform with dynamic layouts, infinite scroll, and personalized recommendations.",
    longDescription:
      "Content platform integrating AI APIs for smart recommendations, natural language search, and auto-generated summaries. Features a masonry layout with smooth infinite scroll.",
    tech: ["Next.js", "OpenAI API", "Prisma", "Redis", "PostgreSQL"],
    category: "AI",
    image: "/projects/project6.jpg",
    liveUrl: "https://your-project-6.vercel.app",
    githubUrl: "https://github.com/yourusername/project-6",
    featured: false,
    color: "#6366F1",
  },
];

export const experience = [
  {
    id: 1,
    type: "work",
    title: "Senior Frontend Developer",
    company: "Your Current Company",
    period: "2023 — Present",
    description:
      "Leading frontend development of a high-traffic SaaS platform. Implemented micro-frontend architecture, reducing time-to-interactive by 40%. Mentoring 3 junior developers.",
    tech: ["React", "Next.js", "TypeScript", "GSAP"],
    color: "#06B6D4",
  },
  {
    id: 2,
    type: "work",
    title: "Frontend Developer",
    company: "Previous Company",
    period: "2021 — 2023",
    description:
      "Built complex UI components and animation systems for a design-forward startup. Established frontend coding standards and review processes.",
    tech: ["Vue.js", "Nuxt.js", "GSAP", "Tailwind"],
    color: "#8B5CF6",
  },
  {
    id: 3,
    type: "work",
    title: "Junior Frontend Developer",
    company: "First Job Company",
    period: "2020 — 2021",
    description:
      "Started my professional career building responsive web interfaces and integrating REST APIs. Developed a passion for animation and creative UI.",
    tech: ["HTML", "CSS", "JavaScript", "React"],
    color: "#F59E0B",
  },
  {
    id: 4,
    type: "education",
    title: "Computer Science / Web Development",
    company: "Your University",
    period: "2016 — 2020",
    description:
      "Bachelor's degree with focus on software engineering. Graduated with honors. Built multiple award-winning student projects.",
    tech: ["CS Fundamentals", "Algorithms", "Databases"],
    color: "#10B981",
  },
];

export const stats = [
  { label: "Years of Experience", value: 4, suffix: "+" },
  { label: "Projects Completed", value: 30, suffix: "+" },
  { label: "Technologies Mastered", value: 20, suffix: "+" },
  { label: "Happy Clients", value: 15, suffix: "+" },
];
