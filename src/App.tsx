import { useCallback, useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Tooltip } from "@base-ui/react/tooltip";
import { Switch } from "@base-ui/react/switch";
import "./App.css";

type Page = "home" | "subscriptions";
type SettingsSection = "general" | "appearance" | "notifications";

const pageLabels: Record<Page, string> = {
  home: "Home",
  subscriptions: "Subscriptions",
};

const settingsLabels: Record<SettingsSection, string> = {
  general: "General",
  appearance: "Appearance",
  notifications: "Notifications",
};

function SidebarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5.5" y1="2" x2="5.5" y2="14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8L8 2.5L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 7V13H6.5V10H9.5V13H12V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SubscriptionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="2" rx="0.5" fill="currentColor" />
      <rect x="2" y="7" width="12" height="2" rx="0.5" fill="currentColor" />
      <rect x="2" y="11" width="8" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1.5V3.5M8 12.5V14.5M1.5 8H3.5M12.5 8H14.5M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M3.05 12.95L4.46 11.54M11.54 4.46L12.95 3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className="nav-item" data-active={active} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

type Theme = "light" | "dark" | "system";

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.4 3.4L4.5 4.5M11.5 11.5L12.6 12.6M3.4 12.6L4.5 11.5M11.5 4.5L12.6 3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 9.5A5.5 5.5 0 016.5 2.5 6 6 0 1013.5 9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2.5" width="12" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 14h5M8 11v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <span className="settings-row-title">{title}</span>
        <span className="settings-row-desc">{description}</span>
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  );
}

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-group">
      <h3 className="settings-group-title">{title}</h3>
      <div className="settings-group-rows">{children}</div>
    </div>
  );
}

function ThemeSelector({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (theme: Theme) => void;
}) {
  return (
    <div className="segmented-control">
      <button
        className="segmented-option"
        data-active={value === "light"}
        onClick={() => onChange("light")}
      >
        <SunIcon /> Light
      </button>
      <button
        className="segmented-option"
        data-active={value === "dark"}
        onClick={() => onChange("dark")}
      >
        <MoonIcon /> Dark
      </button>
      <button
        className="segmented-option"
        data-active={value === "system"}
        onClick={() => onChange("system")}
      >
        <MonitorIcon /> System
      </button>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState<Theme>("system");
  const [opaqueBackground, setOpaqueBackground] = useState(false);
  const [pointerCursors, setPointerCursors] = useState(false);

  return (
    <div className="settings-page">
      <SettingsGroup title="Appearance">
        <SettingsRow
          title="Theme"
          description="Use light, dark, or match your system"
        >
          <ThemeSelector value={theme} onChange={setTheme} />
        </SettingsRow>
        <SettingsRow
          title="Use opaque window background"
          description="Make windows use a solid background rather than system translucency"
        >
          <Switch.Root
            className="switch"
            checked={opaqueBackground}
            onCheckedChange={setOpaqueBackground}
          >
            <Switch.Thumb className="switch-thumb" />
          </Switch.Root>
        </SettingsRow>
        <SettingsRow
          title="Use pointer cursors"
          description="Change the cursor to a pointer when hovering over interactive elements"
        >
          <Switch.Root
            className="switch"
            checked={pointerCursors}
            onCheckedChange={setPointerCursors}
          >
            <Switch.Thumb className="switch-thumb" />
          </Switch.Root>
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
}

function AddSubscriptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onOpenChange(false);
    setName("");
    setUrl("");
    setCategory("");
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup className="dialog-popup">
          <Dialog.Title className="dialog-title">
            Add subscription
          </Dialog.Title>
          <Dialog.Description className="dialog-description">
            Add a new RSS or Atom feed to follow.
          </Dialog.Description>
          <form className="dialog-form" onSubmit={handleSubmit}>
            <label className="dialog-field">
              <span className="dialog-label">Name</span>
              <input
                className="dialog-input"
                type="text"
                placeholder="My Feed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </label>
            <label className="dialog-field">
              <span className="dialog-label">Feed URL</span>
              <input
                className="dialog-input"
                type="url"
                placeholder="https://example.com/feed.xml"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <label className="dialog-field">
              <span className="dialog-label">Category</span>
              <input
                className="dialog-input"
                type="text"
                placeholder="Technology, News, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>
            <div className="dialog-actions">
              <Dialog.Close className="dialog-btn dialog-btn-secondary">
                Cancel
              </Dialog.Close>
              <button type="submit" className="dialog-btn dialog-btn-primary">
                Add
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function App() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [inSettings, setInSettings] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("general");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.metaKey && e.key === "n") {
        e.preventDefault();
        setAddDialogOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const currentTitle = inSettings
    ? settingsLabels[settingsSection]
    : pageLabels[activePage];

  return (
    <div className="app-layout">
      <aside className={`sidebar${!sidebarOpen ? " hidden" : ""}`}>
        {inSettings ? (
          <>
            <div className="sidebar-header" data-tauri-drag-region />
            <div className="sidebar-back">
              <button
                className="back-button"
                onClick={() => setInSettings(false)}
              >
                <BackIcon />
                <span>Back to app</span>
              </button>
            </div>
            <nav className="sidebar-nav">
              {(Object.keys(settingsLabels) as SettingsSection[]).map(
                (section) => (
                  <NavItem
                    key={section}
                    label={settingsLabels[section]}
                    active={settingsSection === section}
                    onClick={() => setSettingsSection(section)}
                  />
                ),
              )}
            </nav>
          </>
        ) : (
          <>
            <div className="sidebar-header" data-tauri-drag-region>
              <Tooltip.Root>
                <Tooltip.Trigger
                  className="sidebar-toggle"
                  onClick={toggleSidebar}
                >
                  <SidebarIcon />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner sideOffset={6}>
                    <Tooltip.Popup className="tooltip">
                      Toggle sidebar <kbd>⌘B</kbd>
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
            <nav className="sidebar-nav">
              <NavItem
                icon={<HomeIcon />}
                label="Home"
                active={activePage === "home"}
                onClick={() => setActivePage("home")}
              />
              <NavItem
                icon={<SubscriptionsIcon />}
                label="Subscriptions"
                active={activePage === "subscriptions"}
                onClick={() => setActivePage("subscriptions")}
              />
            </nav>
            <div className="sidebar-footer">
              <NavItem
                icon={<SettingsIcon />}
                label="Settings"
                active={false}
                onClick={() => setInSettings(true)}
              />
            </div>
          </>
        )}
      </aside>
      <div className="main">
        <header className={`main-header${!sidebarOpen ? " no-sidebar" : ""}`} data-tauri-drag-region>
          <div className="main-header-left">
            {!sidebarOpen && (
              <Tooltip.Root>
                <Tooltip.Trigger
                  className="sidebar-toggle"
                  onClick={toggleSidebar}
                >
                  <SidebarIcon />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner sideOffset={6}>
                    <Tooltip.Popup className="tooltip">
                      Toggle sidebar <kbd>⌘B</kbd>
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            )}
            <h1 className="page-title">{currentTitle}</h1>
          </div>
          <div className="header-actions" />
        </header>
        <div className="main-content">
          {inSettings && settingsSection === "appearance" && (
            <AppearanceSettings />
          )}
        </div>
      </div>
      <AddSubscriptionDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </div>
  );
}

export default App;
