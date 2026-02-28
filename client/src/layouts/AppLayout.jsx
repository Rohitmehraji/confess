import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/devices', label: 'Devices' },
  { to: '/all', label: 'All' },
];

const AppLayout = ({ children }) => (
  <div className="min-h-screen p-4 md:p-8">
    <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[240px_1fr]">
      <aside className="glass-panel p-4 h-fit">
        <h1 className="text-xl font-bold">SMS Scheduler</h1>
        <nav className="mt-5 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2 transition ${
                  isActive ? 'bg-white/25 text-white' : 'text-slate-200 hover:bg-white/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="space-y-6">{children}</main>
    </div>
  </div>
);

export default AppLayout;
