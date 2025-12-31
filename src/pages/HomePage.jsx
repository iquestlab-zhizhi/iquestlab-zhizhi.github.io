import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiGitBranch,
  FiCpu,
  FiMessageSquare,
  FiLayers,
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import { assetUrl } from "../utils/assetUrl.js";

export default function HomePage() {
  const demoSrc = (fileName) => assetUrl(`demo/${fileName}`);

  const sections = useMemo(
    () => [
      { id: "features", label: "核心特点" },
      { id: "pipeline", label: "训练流程" },
      { id: "benchmark", label: "基准表现" },
      { id: "specs", label: "规格" },
      { id: "showcases", label: "使用示例" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState("hero");
  // 点击导航后的短暂“锁定”：避免滚动动画开始时 ScrollSpy 立即把高亮切回上一段造成闪烁
  const scrollLockRef = useRef(null);

  useEffect(() => {
    // OLMo 风格：正文始终清晰展示；只对媒体（图片/iframe）做轻量入场动效
    const items = Array.from(
      document.querySelectorAll(".home-page [data-reveal]")
    );
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        }
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // ScrollSpy：明确用户进入了哪个区域（不改变文字呈现）
    const els = Array.from(
      document.querySelectorAll(".home-page [data-section]")
    );
    if (!els.length) return;

    const lastSectionId = sections[sections.length - 1]?.id;

    // 采用“marker 线”判定：在导航栏下方放一条参考线，
    // 哪个 section 覆盖这条线（top <= markerY < bottom）就认为它是 active。
    // 这样不会被“上一段很长导致 intersectionRatio 更大”所干扰。
    const getMarkerY = () => {
      const nav = document.querySelector(".navbar");
      const navH = nav?.getBoundingClientRect().height ?? 0;
      return navH + 24; // marker 线位于 navbar 下方一点点，更贴近用户视觉“当前段落”的感知
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const markerY = getMarkerY();

      // 点击锁定：点击后短时间内保持高亮目标项，直到目标项覆盖 marker 线
      const lock = scrollLockRef.current;
      if (lock && lock.id && typeof lock.until === "number") {
        const now =
          typeof performance !== "undefined" ? performance.now() : Date.now();
        if (now < lock.until) {
          const target = document.getElementById(lock.id);
          if (target) {
            const r = target.getBoundingClientRect();
            const reached = r.top <= markerY && r.bottom > markerY;
            if (!reached) {
              setActiveSection((prev) => (prev === lock.id ? prev : lock.id));
              return;
            }
          }
        }
        // 过期或已到达：解除锁定，恢复正常 ScrollSpy
        scrollLockRef.current = null;
      }

      // 正常情况：找到覆盖 marker 线的 section（从后往前找，匹配“最深的当前段”）
      let activeEl = null;
      for (let i = els.length - 1; i >= 0; i--) {
        const rect = els[i].getBoundingClientRect();
        if (rect.top <= markerY && rect.bottom > markerY) {
          activeEl = els[i];
          break;
        }
      }

      // 底部兜底：滚到页面最底部时强制选中最后一个导航项（通常是“使用示例”）
      if (lastSectionId) {
        const doc = document.documentElement;
        const bottom = window.scrollY + window.innerHeight;
        const docH = doc.scrollHeight;
        if (bottom >= docH - 2) {
          setActiveSection((prev) =>
            prev === lastSectionId ? prev : lastSectionId
          );
          return;
        }
      }

      const id = activeEl?.getAttribute("id");
      if (id) setActiveSection(id);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [sections]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    // 更“准”的落点：对齐到该 section 的标题，而不是 section 顶部（否则会叠加 section 内 padding）
    const target =
      section.querySelector("h2") ||
      section.querySelector("h3") ||
      section.querySelector(".content-section") ||
      section;

    const nav = document.querySelector(".navbar");
    const navH = nav?.getBoundingClientRect().height ?? 0;
    const y = target.getBoundingClientRect().top + window.scrollY - navH - 12;

    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  return (
    <main className="home-page">
      <nav className="section-nav" aria-label="页面分区导航">
        <div className="section-nav-inner">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={[
                "section-nav-item",
                activeSection === s.id ? "is-active" : "",
              ].join(" ")}
              onClick={(e) => {
                e.preventDefault();
                // 点击时先更新选中态，避免滚动动画过程中短暂“跳回”上一段
                setActiveSection(s.id);
                scrollLockRef.current = {
                  id: s.id,
                  // 1.2s 基本覆盖 smooth scroll 的启动与大多数滚动距离；到达目标后会提前解锁
                  until:
                    (typeof performance !== "undefined"
                      ? performance.now()
                      : Date.now()) + 1200,
                };
                scrollToSection(s.id);
              }}
            >
              <span className="section-nav-label">{s.label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* 主视觉区 */}
      <section
        id="hero"
        data-section
        className="hero page-section section-hero"
        aria-label="Hero"
      >
        <div className="content-section">
          <div className="hero-image" data-reveal>
            <img src={assetUrl("images/image1.png")} alt="首页主视觉图" />
          </div>
          <p className="subtitle">
            <span className="subtitle-lead">
              新一代面向软件工程、竞赛编程和工具使用的代码大模型系列
            </span>
            <span className="subtitle-sep" aria-hidden="true">
              ：
            </span>
            <span
              className="subtitle-models"
              aria-label="模型规格：7B、14B、40B、40B-Loop"
            >
              <span className="subtitle-chip">7B</span>
              <span className="subtitle-chip">14B</span>
              <span className="subtitle-chip">40B</span>
              <span className="subtitle-chip">40B-Loop</span>
            </span>
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/download">
              模型下载
              <FiDownload className="btn-icon" size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn-secondary" to="/report">
              技术报告
              <FiFileText className="btn-icon" size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 核心介绍 */}
      <section
        id="features"
        data-section
        className="page-section section-features"
        aria-label="核心特点"
      >
        <div className="content-section">
          <h2>核心特点</h2>
          <ul className="feature-grid">
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <FiGitBranch size={18} />
              </div>
              <div className="feature-body">
                <div className="feature-title">Code-flow 多阶段训练</div>
                <div className="feature-desc">
                  基于 code-flow 的多阶段训练策略，跟踪代码逻辑演化过程
                </div>
              </div>
            </li>
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <FiCpu size={18} />
              </div>
              <div className="feature-body">
                <div className="feature-title">长上下文过程推理</div>
                <div className="feature-desc">
                  加入 32k 推理与智能体轨迹，增强过程推理与长上下文稳定性
                </div>
              </div>
            </li>
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <FiMessageSquare size={18} />
              </div>
              <div className="feature-body">
                <div className="feature-title">Thinking / Instruct 双路径</div>
                <div className="feature-desc">
                  两条后训练路径：Thinking（强化推理）与 Instruct（通用协助）
                </div>
              </div>
            </li>
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <FiLayers size={18} />
              </div>
              <div className="feature-body">
                <div className="feature-title">Loop 结构高效部署</div>
                <div className="feature-desc">
                  Loop 结构用于降低显存占用，提升部署效率
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 训练流程 */}
      <section
        id="pipeline"
        data-section
        className="page-section section-pipeline"
        aria-label="训练流程"
      >
        <div className="content-section">
          <h2>训练流程</h2>
          <p>
            训练包含Pre-Train、Annealing、Mid-Train，以及Post-Train，形成完整的能力进阶结构。
            通过引入代码库变更流、长上下文数据与思维强化信号，模型在真实任务中获得更稳定的行为与更低的错误传播率。
          </p>
          <div className="media-wrap" data-reveal>
            <img
              src={assetUrl("images/pipeline.png")}
              className="pipeline-image"
              alt="训练流程图"
            />
          </div>
        </div>
      </section>

      {/* 模型效果 */}
      <section
        id="benchmark"
        data-section
        className="page-section section-benchmark"
        aria-label="基准表现"
      >
        <div className="content-section">
          <h2>基准表现</h2>
          <p>
            在多个关键编码任务基准中取得领先表现，包括 SWE-Bench
            Verified、LiveCodeBench v6、BFCL 等。
          </p>
          <div className="media-wrap" data-reveal>
            <img src={assetUrl("images/benchmark.jpg")} alt="基准柱状图" />
          </div>
        </div>
      </section>

      {/* 参数与规格 */}
      <section
        id="specs"
        data-section
        className="page-section section-specs"
        aria-label="规格"
      >
        <div className="content-section">
          <h2>规格</h2>
          <div className="spec-table-wrap">
            <div className="spec-table-scroll">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>模型配置</th>
                    <th>参数规模</th>
                    <th>最大上下文</th>
                    <th>路径</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>IQuest-Coder-7B</td>
                    <td>7B</td>
                    <td>32K</td>
                    <td>
                      <div
                        className="path-flow"
                        aria-label="Stage1 到 Stage2 到 Instruct 到 Thinking"
                      >
                        <span className="path-step">Stage1</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Stage2</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Instruct</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Thinking</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>IQuest-Coder-14B</td>
                    <td>14B</td>
                    <td>32K</td>
                    <td>
                      <div
                        className="path-flow"
                        aria-label="Stage1 到 Stage2 到 Instruct 到 Thinking"
                      >
                        <span className="path-step">Stage1</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Stage2</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Instruct</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Thinking</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>IQuest-Coder-40B</td>
                    <td>40B</td>
                    <td>128K</td>
                    <td>
                      <div
                        className="path-flow"
                        aria-label="Stage1 到 Stage2 到 Instruct 到 Thinking"
                      >
                        <span className="path-step">Stage1</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Stage2</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Instruct</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Thinking</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>LoopCoder-40B-A80B</td>
                    <td>40B</td>
                    <td>128K</td>
                    <td>
                      <div
                        className="path-flow"
                        aria-label="Loop 到 Instruct 到 Thinking"
                      >
                        <span className="path-step">Loop</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Instruct</span>
                        <span className="path-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="path-step">Thinking</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* showcase */}
      <section
        id="showcases"
        data-section
        className="page-section section-showcases"
        aria-label="使用示例"
      >
        <div className="content-section">
          <h2>使用示例</h2>

          <blockquote className="showcase-quote">
            <h3>粒子文字汇聚与炸裂特效</h3>
            <p className="prompt-intro">实现一个粒子文字动画，满足以下要求：</p>
            <ol className="prompt-list">
              <li>
                <strong>文字采样</strong>：在 <code>Canvas</code>{" "}
                上将指定文字（如 <code>IQuest</code>
                ）转化为由数百个微小粒子组成的点阵。
              </li>
              <li>
                <strong>位置状态</strong>
                ：每个粒子拥有当前坐标与目标坐标（组成文字）。
              </li>
              <li>
                <strong>交互物理</strong>
                ：鼠标靠近时施加斥力四散逃离；鼠标移开后施加弹力，平滑回到目标位置。
              </li>
              <li>
                <strong>视觉与缓动</strong>
                ：粒子颜色随机或渐变，整体动作带缓动（Easing）效果。
              </li>
            </ol>
          </blockquote>
          <div className="showcase-demo" data-reveal>
            <iframe
              src={demoSrc("demo1.html")}
              title="粒子文字汇聚与炸裂特效 Demo"
              frameBorder="0"
              loading="lazy"
              className="showcase-iframe"
            />
          </div>

          <blockquote className="showcase-quote showcase-quote--mt16">
            <h3>像素风 Falling Sand 元素沙盒</h3>
            <p>
              给出一个实时刷新的像素沙盘玩具，左边有按钮切换沙子、水、石头、酸液，我在画布上涂抹就能生成，对应不同颜色，还能大规模更新很多像素点也不会明显卡顿，各种元素要有比较真实的下落和流动效果。
            </p>
          </blockquote>
          <div className="showcase-demo" data-reveal>
            <iframe
              src={demoSrc("demo2.html")}
              title="像素风 Falling Sand 元素沙盒"
              frameBorder="0"
              loading="lazy"
              className="showcase-iframe"
            />
          </div>

          <blockquote className="showcase-quote showcase-quote--mt16">
            <h3>太阳系模拟</h3>
            <p>
              Write a web page to show a realistic simulation of solar system
            </p>
          </blockquote>
          <div className="showcase-demo" data-reveal>
            <iframe
              src={demoSrc("demo3.html")}
              title="太阳系模拟"
              frameBorder="0"
              loading="lazy"
              className="showcase-iframe"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
