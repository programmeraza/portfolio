// ============================================================
// DATA FILE
// ⚠️ Поля с [ЗАПОЛНИТЕ] — обязательно замените реальными данными
// перед публикацией, иначе заказчик увидит их прямо на сайте.
// ============================================================

export const siteConfig = {
  name: "[ЗАПОЛНИТЕ ИМЯ]",
  title: "Frontend Developer",
  description:
    "Создаю впечатляющий digital-опыт с помощью React, Next.js, GSAP и WebGL — от корпоративных сайтов до брендовых интерактивных проектов.",
  email: "[ЗАПОЛНИТЕ EMAIL]",
  location: "Ташкент, Узбекистан",
  github: "https://github.com/programmeraza",
  linkedin: "[ЗАПОЛНИТЕ LINKEDIN, или удалите ссылку в Footer/Contact]",
  telegram: "[ЗАПОЛНИТЕ ССЫЛКУ НА TELEGRAM, напр. https://t.me/username]",
  telegramHandle: "[ЗАПОЛНИТЕ @username]",
  githubHandle: "@programmeraza",
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
    title: "AQL",
    description:
      "Брендовый сайт архитектурного бюро на стыке культурного наследия и параметрического дизайна: кастомный WebGL-скролл и цифровой манифест бренда.",
    longDescription:
      "Digital-манифест архитектурной студии: параметрические анимации, кастомная система скролла и визуальный язык, объединяющий монументальное наследие Самарканда и Бухары с современной веб-архитектурой.",
    tech: ["WebGL", "Custom Scroll", "Multilingual"],
    category: "Architecture",
    image: "/projects/aql.jpg",
    liveUrl: "https://katm.vercel.app/",
    githubUrl: "",
    featured: true,
    color: "#8B5CF6",
  },
  {
    id: 2,
    title: "WellFit",
    description:
      "Лендинг премиального фитнес-клуба в Ташкенте: видео-хиро на главном экране, запись на тренировку и полная мультиязычность.",
    longDescription:
      "Коммерческий сайт фитнес-клуба с видео-фоном в hero-секции, разделами О нас / Клуб / Контакты, поддержкой узбекского, русского и английского языков.",
    tech: ["Video Hero", "i18n (UZ/RU/EN)", "Booking"],
    category: "Business",
    image: "/projects/wellfit.jpg",
    liveUrl: "https://wellfit-final.vercel.app/",
    githubUrl: "",
    featured: true,
    color: "#10B981",
  },
  {
    id: 3,
    title: "NEUROTECH",
    description:
      "Корпоративный сайт IT/AI-компании: разработка мобильных приложений, внедрение AI-решений, backend-инфраструктура и Big Data — на трёх языках.",
    longDescription:
      "Многоязычный корпоративный сайт для IT-компании, специализирующейся на AI-интеграциях, компьютерном зрении и автоматизации бизнес-процессов для банковского и госсектора.",
    tech: ["Multilingual", "Corporate", "AI Services"],
    category: "IT / AI",
    image: "/projects/neurotech.jpg",
    liveUrl: "https://hexacore-eight.vercel.app/",
    githubUrl: "",
    featured: true,
    color: "#06B6D4",
  },
  {
    id: 4,
    title: "Cleveland",
    // ⚠️ Автосгенерированное описание — сайт отдаёт пустой HTML без SSR,
    // поэтому контент не удалось проверить. Замените на реальное описание.
    description: "[ЗАПОЛНИТЕ] Кратко опишите, что это за проект и его фишку.",
    longDescription: "[ЗАПОЛНИТЕ]",
    tech: [],
    category: "Web",
    image: "/projects/cleveland.jpg",
    liveUrl: "https://cliveland.vercel.app/",
    githubUrl: "",
    featured: false,
    color: "#F59E0B",
  },
  {
    id: 5,
    title: "Shibuya",
    description: "[ЗАПОЛНИТЕ] Кратко опишите, что это за проект и его фишку.",
    longDescription: "[ЗАПОЛНИТЕ]",
    tech: [],
    category: "Web",
    image: "/projects/shibuya.jpg",
    liveUrl: "https://anime-pi-five.vercel.app/",
    githubUrl: "",
    featured: false,
    color: "#EF4444",
  },
  {
    id: 6,
    title: "ECOFINANCE",
    description: "[ЗАПОЛНИТЕ] Кратко опишите, что это за проект и его фишку.",
    longDescription: "[ЗАПОЛНИТЕ]",
    tech: [],
    category: "Fintech",
    image: "/projects/ecofinance.jpg",
    liveUrl: "https://ecofinance.vercel.app/",
    githubUrl: "",
    featured: false,
    color: "#6366F1",
  },
];

// ⚠️ Это ваша реальная трудовая/учебная история — я не могу её выдумать за вас.
// Замените title/company/period/description на факты, иначе на сайте будет ложь.
export const experience = [
  {
    id: 1,
    type: "work",
    title: "[ЗАПОЛНИТЕ] Например: Frontend Developer",
    company: "[ЗАПОЛНИТЕ КОМПАНИЮ или укажите Freelance]",
    period: "[ЗАПОЛНИТЕ ПЕРИОД, напр. 2023 — н.в.]",
    description:
      "[ЗАПОЛНИТЕ] Кратко — что делали, какой был результат (цифры, метрики).",
    tech: ["React", "Next.js", "TypeScript", "GSAP"],
    color: "#06B6D4",
  },
  {
    id: 2,
    type: "education",
    title: "[ЗАПОЛНИТЕ] Например: Computer Science",
    company: "[ЗАПОЛНИТЕ УЧЕБНОЕ ЗАВЕДЕНИЕ]",
    period: "[ЗАПОЛНИТЕ ПЕРИОД]",
    description: "[ЗАПОЛНИТЕ]",
    tech: ["CS Fundamentals"],
    color: "#10B981",
  },
];

// ⚠️ Проверьте и замените реальными цифрами перед публикацией.
export const stats = [
  { label: "Years of Experience", value: 1, suffix: "+" },
  { label: "Projects Completed", value: 6, suffix: "+" },
  { label: "Technologies Mastered", value: 10, suffix: "+" },
  { label: "Happy Clients", value: 3, suffix: "+" },
];
