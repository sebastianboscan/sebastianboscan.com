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
          ? "text-white border-white/40 bg-white/10"
          : "border-transparent text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/30"
      }`}
      style={{ cursor: "pointer" }}
    >
      {item.label}
    </a>
  );
}
