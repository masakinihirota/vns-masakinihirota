// app/(protected)/layout.tsx
export default async function Layout({ children }) {
    const session = await auth.api.getSession({ headers: await headers() });
    const isAdmin = session?.user.role === "admin";

    return (
        <>
            <Navbar isAdmin={isAdmin} user={session?.user} />
            {children}
        </>
    );
}
