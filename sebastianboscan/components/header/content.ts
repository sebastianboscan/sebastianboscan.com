export type NavItem = {
  readonly label: string;
  readonly id: string;
};

export const navItems: readonly NavItem[] = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Organizations", id: "organizations" },
  { label: "Contact", id: "contact" },
] as const;
