"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icons";
import { profiles, useWorkspace, WorkspaceProvider } from "./workspace";
const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Overview", icon: "home" },
  { href: "/marketplace", label: "Marketplace", icon: "grid" },
  { href: "/wanted", label: "Wanted board", icon: "heart" },
  { href: "/assistant", label: "Your assistant", icon: "spark" },
];
function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, selectProfile } = useWorkspace();
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Icon name="leaf" size={25} />
          </span>
          ReValue<span className="brand-dot">.</span>
        </Link>
        <div className="sidebar-caption">LESS WASTE. MORE POSSIBILITY.</div>
        <nav aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href))
                  ? "nav-link active"
                  : "nav-link"
              }
              aria-current={pathname === link.href ? "page" : undefined}
            >
              <Icon name={link.icon} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <Icon name="leaf" size={25} />
          <p>
            Good things deserve
            <br />a second chapter.
          </p>
          <span>
            A little space cleared.
            <br />A little less in the landfill.
          </span>
        </div>
        <div className="sidebar-footer">
          <span className="status-dot" />
          Local prototype · B1
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumbs">
            Your circular marketplace<span>/</span>
            <strong>
              {links.find((link) => link.href === pathname)?.label ?? "Explore"}
            </strong>
          </div>
          <div className="profile-control">
            <span className="avatar">{profile.initials}</span>
            <label>
              <span className="sr-only">Demo profile</span>
              <select
                value={profile.id}
                onChange={(event) => selectProfile(event.target.value)}
              >
                {profiles.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name} · {item.role}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>
        <div className="demo-banner">
          <span className="demo-tag">PREVIEW</span>
          <span>
            Sample listings and profiles. Nothing is published or connected yet.
          </span>
          <span className="demo-local">Localhost</span>
        </div>
        <main id="main" className="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="page-footer">
          Built for reuse, with transparency at every step.
          <span>Prices in INR · Preview data only</span>
        </footer>
      </div>
    </div>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <Shell>{children}</Shell>
    </WorkspaceProvider>
  );
}
