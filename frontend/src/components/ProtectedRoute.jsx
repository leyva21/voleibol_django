import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";
import { fetchProfile, getCachedProfile } from "../lib/user";

export default function ProtectedRoute({ children, roles }) {
    const [ready, setReady] = useState(false);
    const [allowed, setAllowed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let alive = true;

        (async () => {
        if (!isLoggedIn()) {
            if (alive) { setAllowed(false); setReady(true); }
            return;
        }

        let profile = getCachedProfile();
        if (!profile) {
            try {
                profile = await fetchProfile();
            } catch {
                if (alive) { setAllowed(false); setReady(true); }
                return;
            }
        }

        const ok =
            !roles?.length || profile?.is_superuser || roles.some((r) => (profile?.groups || []).includes(r));

        if (alive) {
            setAllowed(ok);
            setReady(true);
        }
        })();

        return () => { alive = false; };
    }, [roles, location.pathname]);

    if (!ready) return null;
    if (!allowed) return <Navigate to="/login" replace />;
    return children;
}
