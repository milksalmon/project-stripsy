const SERVER_BASE = import.meta.env.VITE_SERVER_URL;

export async function fetchHistory() {
    const res = await fetch(`${SERVER_BASE}/history`, {
        credentials: 'include',
    });

    if (res.status === 401) {
        return null;
    }

    if (!res.ok) {
        throw await res.json();
    }

    return res.json();
}