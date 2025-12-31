import { Link, NavLink, Outlet } from "react-router-dom";
import { assetUrl } from "../utils/assetUrl.js";

const navLinkClassName = ({ isActive }) => {
  // 保持原视觉：仍然用 a 的样式，active 不额外加样式（避免界面变化）
  return isActive ? "active" : undefined;
};

export default function Layout() {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearText =
    currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;

  return (
    <div className="layout-shell">
      {/* 顶部导航 */}
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" aria-label="IQuest Home">
            <img
              src={assetUrl("images/logo-full.jpg")}
              alt="IQuest Logo"
              className="logo"
            />
          </Link>

          <nav className="nav-links">
            {/* <NavLink to="/report" className={navLinkClassName}>
              技术报告
            </NavLink>
            <NavLink to="/download" className={navLinkClassName}>
              模型下载
            </NavLink> */}
            <NavLink to="/contact" className={navLinkClassName}>
              联系我们
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="layout-main">
        <Outlet />
      </div>

      {/* 底部 */}
      <footer className="footer">
        <p>
          <small>
            © <time dateTime={String(startYear)}>{yearText}</time> IQuest Coder
            Group. All rights reserved.
          </small>
        </p>
      </footer>
    </div>
  );
}
