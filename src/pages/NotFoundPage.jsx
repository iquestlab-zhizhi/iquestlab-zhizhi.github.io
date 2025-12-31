import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="content-section" style={{ marginTop: 120 }}>
      <h2>页面不存在</h2>
      <p>
        你访问的页面不存在。返回 <Link to="/">首页</Link>。
      </p>
    </section>
  );
}


