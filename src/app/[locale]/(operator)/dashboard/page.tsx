// FR-39 to FR-42: operator dashboard — listings CRUD, booking analytics, notifications.
// This is a separate route group so it can later get its own layout (sidebar nav,
// auth guard restricted to UserType 'Operator').
import { setRequestLocale } from 'next-intl/server';

export default function OperatorDashboardPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl">Operator Dashboard</h1>
      <p className="text-text-muted mt-2">
        Placeholder — booking analytics, listing management, and review notifications go here.
      </p>
    </main>
  );
}
