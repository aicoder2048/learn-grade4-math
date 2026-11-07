/* 课程配置：按课程修改。这是课程自己的文件，sync_course.py 不会动它。
 * 框架文件（course-lib.js、course-tutor.js、course.css）各门课相同，用 sync_course.py 升级。
 * 页面里它要排在 course-lib.js 之前（见 AUTHORING.md 第 2 节）。
 */
window.CL = window.CL || {};

CL.CONFIG = {
  prefix: "g4m",          // localStorage 键前缀，每门课唯一（file:// 下所有课程共用一个源）
  title: "四年级数学上册 · 互动课",
  seal: "数",              // 顶栏图章，一个字
  sourceLink: "../docs/articles/textbook.md", // 顶栏“原文”链接，相对课程目录
  port: 8771,                // tools/serve.py 的端口，和 tools/sources.json 的 course.port 一致
  lessonsDir: "lessons", // 课程目录名，离线提示里的命令和地址用它
};

// 学习路线：3–5 步。课程顺序 = 推荐学习顺序（翻页也按这个顺序）
CL.STEPS = [
  { n: 1, name: "大数的世界", desc: "认识万以上的数：读、写、比较、改写和求近似数，感受 1 亿有多大。" },
  { n: 2, name: "角与图形", desc: "量角、画角，认识平行与垂直、平行四边形和梯形。" },
  { n: 3, name: "乘法与数量关系", desc: "多位数乘两位数，用估算解决问题，认识加法模型和乘法模型。" },
  { n: 4, name: "统计、方向与复习", desc: "条形统计图、校园寻宝里的方向，最后把整册知识连起来。" },
];
// file 必须和课程文件名一致；src = 对应原文章节
CL.LESSONS = [
  { step: 1, file: "L01-yi-yinei.html", id: "L01", title: "亿以内数的认识", src: "第一单元 p1–9" },
  { step: 1, file: "L02-yi-yishang.html", id: "L02", title: "亿以上数、比大小与近似数", src: "第一单元 p10–23 · 1 亿有多大 p24–27" },
  { step: 2, file: "L03-jiao.html", id: "L03", title: "角的度量", src: "第二单元 p28–38" },
  { step: 2, file: "L04-pingxing-chuizhi.html", id: "L04", title: "平行与垂直", src: "第五单元 p70–77" },
  { step: 2, file: "L05-sibianxing.html", id: "L05", title: "平行四边形和梯形", src: "第五单元 p78–87" },
  { step: 3, file: "L06-kousuan-bisuan.html", id: "L06", title: "口算乘法与笔算乘法", src: "第三单元 p39–47" },
  { step: 3, file: "L07-chengfa-guilv-gusuan.html", id: "L07", title: "乘数末尾有 0、积的变化规律与估算", src: "第三单元 p48–57" },
  { step: 3, file: "L08-moxing.html", id: "L08", title: "加法模型和乘法模型", src: "第四单元 p58–69" },
  { step: 4, file: "L09-tongjitu.html", id: "L09", title: "条形统计图", src: "第六单元 p88–101" },
  { step: 4, file: "L10-xunbao.html", id: "L10", title: "寻找宝藏：方向与平面图", src: "综合与实践 p102–107" },
  { step: 4, file: "L11-fuxi.html", id: "L11", title: "复习与关联", src: "第七单元 p108–119" },
];
// 面向四年级学生的快捷提问（替换默认的技术向问题）；第二项 = 是否附截图
CL.TUTOR_QUICK_BASE = [
  ["用更简单的话讲讲这一节", false],
  ["这张图怎么看？", true],
  ["考考我：就这一节出一道题", false],
  ["这一节容易错在哪里？", false],
  ["生活里哪里会用到这个知识？", false],
];
CL.TUTOR_ASK_FIG = "这张图怎么看？它讲的是本课哪个知识？";
CL.TUTOR_ASK_DEMO = "这个演示怎么玩？现在的结果说明了什么？";

// 可选：AI 助教的快捷问题 CL.TUTOR_QUICK / CL.TUTOR_QUICK_BASE，“问 AI”预填问题 CL.TUTOR_ASK_FIG / CL.TUTOR_ASK_DEMO。
// 多课共用的课程自己的函数也写在这里，挂到 CL 上（course-lib.js 会保留它们）。改动会改变演示读数：写进正文和讲稿的数字要重核。

/* ================= 本课程的数学小工具（多课共用，改动会改变演示读数） ================= */
// 数位名，从个位往高位：PLACE[0] = "个位"
CL.PLACE = ["个", "十", "百", "千", "万", "十万", "百万", "千万", "亿", "十亿", "百亿", "千亿"];
CL.ZH_DIGIT = "零一二三四五六七八九";
// 按教材规则读数（最多 12 位）：先分级，从最高级读起；每级末尾的 0 不读；其他数位上一个或连续几个 0 只读一个“零”。
CL.readNum = function (s) {
  s = String(s).replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!s || s.length > 12) return "";
  if (s === "0") return "零";
  const U = ["千", "百", "十", ""], G = ["", "万", "亿"];
  const pad = s.padStart(Math.ceil(s.length / 4) * 4, "0");
  const nG = pad.length / 4;
  let out = "", started = false;
  for (let g = 0; g < nG; g++) {
    const grp = pad.slice(g * 4, g * 4 + 4);
    let zero = false, any = false;
    for (let i = 0; i < 4; i++) {
      const d = +grp[i];
      if (d === 0) { if (started) zero = true; continue; }
      if (zero) { out += "零"; zero = false; }
      // 整个数以“1 × 十”开头时读“十”，不读“一十”（如 102345 读作十万二千三百四十五）
      out += (d === 1 && U[i] === "十" && !started) ? "十" : CL.ZH_DIGIT[d] + U[i];
      started = true; any = true;
    }
    if (any) out += G[nG - 1 - g];   // 级末尾的 0 不读：zero 标记不带到下一级
  }
  return out;
};
// 从右边起每四位空一格，如 21893095 → "2189 3095"
CL.groupNum = function (s) { s = String(s).replace(/\D/g, ""); let o = ""; while (s.length > 4) { o = " " + s.slice(-4) + o; s = s.slice(0, -4); } return s + o; };
