import { HomePage } from './components/portal/HomePage';
import { ProjectPage } from './components/portal/ProjectPage';

function getCurrentSlug() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return path ? decodeURIComponent(path) : null;
}

export default function App() {
  const slug = getCurrentSlug();

  return (
    <main className="min-h-screen bg-slate-100/80 px-4 py-5 text-slate-950 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        {slug ? <ProjectPage slug={slug} /> : <HomePage />}
      </div>
    </main>
  );
}
