import type { NavItem } from "@/components/header/content";

type HeaderNavLinkProps = {
  readonly item: NavItem;
  readonly isActive: boolean;
};

export function HeaderNavLink({ item, isActive }: HeaderNavLinkProps) {
  return (
    <a
      href={`#${item.id}`}
      className={`px-3 py-1 transition-all border ${
        isActive
          ? "text-blue-400 border-blue-500/40 bg-blue-500/10"
          : "border-transparent text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30"
      }`}
      style={{ cursor: "pointer" }}
    >
      {item.label}
    </a>
  );
}
