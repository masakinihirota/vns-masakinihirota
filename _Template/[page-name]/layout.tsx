export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <header>
        <h2>Header Section</h2>
      </header>
      <main>{children}</main>
      <footer>
        <p>Footer Section</p>
      </footer>
    </div>
  );
}
