export interface NavLink {
  title: string;
  url: string;
  sublinks?: NavLink[];
}

export const navLinks = [
  { 
    title: "Portfolio",
    url: "/",
  },
  { 
    title: "DevHub",
    url: "/dev",
  },
  {
    title: "Kontakt",
    url: "/contacts",
  },
];
