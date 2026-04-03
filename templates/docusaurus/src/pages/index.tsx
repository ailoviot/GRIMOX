import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function Home(): JSX.Element {
  return (
    <Layout title="Home" description="Documentation site">
      <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <h1>My Docs</h1>
          <p>Documentation made simple.</p>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Get Started
          </Link>
        </div>
      </main>
    </Layout>
  );
}
