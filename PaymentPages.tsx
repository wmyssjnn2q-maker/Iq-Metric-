import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPurchase } from './lib/paymentClient';
import type { PurchaseEntitlements } from './lib/stripeApiHandlers';
import { applyPurchaseToStorage, clearCheckoutContext, readCheckoutContext } from './lib/purchaseFulfillment';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('Brak identyfikatora sesji płatności.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const purchase = await verifyPurchase(sessionId);
        if (cancelled) return;

        const context = readCheckoutContext();
        applyPurchaseToStorage({
          productId: purchase.productId,
          email: purchase.email,
          entitlements: purchase.entitlements as PurchaseEntitlements,
          purchaseToken: purchase.purchaseToken,
          sessionId: purchase.sessionId,
          intent: context?.intent ?? null,
          clearIqStatsOnStart: context?.intent === 'start' || !context?.intent,
        });
        clearCheckoutContext();
        navigate(purchase.redirectPath, { replace: true });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Nie udało się potwierdzić płatności.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  return (
    <div className="max-w-xl mx-auto py-32 px-6 text-center">
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Problem z płatnością</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{error}</p>
            <Link
              to="/platnosc"
              className="inline-flex px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700"
            >
              Wróć do płatności
            </Link>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold dark:text-white mb-2">Potwierdzanie płatności…</h2>
            <p className="text-slate-500 dark:text-slate-400">Proszę czekać, aktywujemy Twój dostęp.</p>
          </>
        )}
      </div>
    </div>
  );
}

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'standard';
  const intent = searchParams.get('intent');
  const retryUrl = `/platnosc?type=${encodeURIComponent(type)}${intent ? `&intent=${encodeURIComponent(intent)}` : ''}`;

  return (
    <div className="max-w-xl mx-auto py-32 px-6 text-center">
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Płatność anulowana</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Nie pobraliśmy żadnej kwoty. Możesz spróbować ponownie, gdy będziesz gotowy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={retryUrl}
            className="inline-flex px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700"
          >
            Spróbuj ponownie
          </Link>
          <Link
            to="/"
            className="inline-flex px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Strona główna
          </Link>
        </div>
      </div>
    </div>
  );
}
