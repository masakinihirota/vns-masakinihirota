export function BackgroundCanvas() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.16),transparent_40%),linear-gradient(to_bottom,rgba(255,255,255,0.75),rgba(248,250,252,0.95))] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.2),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.8),rgba(15,23,42,0.95))]"
        />
    );
}
