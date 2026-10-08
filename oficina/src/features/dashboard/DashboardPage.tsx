import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WidgetCard, WidgetPlaceholder } from '../../components/ui/WidgetCard';
import { DASHBOARD_WIDGETS } from './widgetConfig';

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-12">
        {DASHBOARD_WIDGETS.map((w) => {
          const Content = w.component;
          const Badge = w.badge;

          // Sin envoltorio genérico: la tarjeta trae su propio estilo (p. ej. la Jornada, en degradado de acento).
          if (w.raw && Content) {
            return (
              <div key={w.id} className={w.className}>
                <Content />
              </div>
            );
          }

          const action = w.link ? (
            <Link
              to={w.link.to}
              className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-gray-400 hover:text-indigo-300"
            >
              {w.link.label}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : Badge ? (
            <Badge />
          ) : undefined;

          return (
            <WidgetCard key={w.id} title={w.title} icon={w.icon} className={w.className} action={action}>
              {Content ? <Content /> : <WidgetPlaceholder phase={w.phase} description={w.description} />}
            </WidgetCard>
          );
        })}
      </section>
    </div>
  );
}
