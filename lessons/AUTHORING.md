# 课程编写规范（给写课程的人和 AI 看）

本课程精读原文《义务教育教科书 数学 四年级上册（人教版 2022 课标修订版）》。原文存档：`docs/articles/textbook.md`（项目根目录下），它是**唯一事实来源**。
布局：左 = 学习路线与本课小节，中 = 图文课程，右 = AI 助教。

每篇课程 = 课程目录根下一个独立 HTML。双击就能打开（`file://`）；AI 助教需要本地服务 `tools/serve.py`。

**参考样板：`L01-*.html`（第一课写好后它就是样板）。** 写新课之前先完整读一遍它，照它的结构、组件和语气写。

## 1. 文件与目录

| 路径 | 用途 |
|---|---|
| `Lxx-*.html` | 课程页。文件名必须和 `assets/course-lib.js` 里 `CL.LESSONS` 的 `file` 一致 |
| `assets/course.css` | 公用样式。局部样式写在课程 `<style>` 里，只用 CSS 变量，不写死颜色 |
| `assets/course-lib.js` | 公用脚本 + 课程配置（`CL.STEPS`、`CL.LESSONS`） |
| `assets/course-tutor.js` | AI 助教前端（自动加载；可拖宽、可“记笔记”） |
| `notes.html` | 学习笔记页：列出并渲染 `study-notes/*.md` |
| `study-notes/` | 从助教对话整理出的 Markdown 笔记（服务端写入） |
| `assets/glossary-data.js` | 共用术语表 + 分类表 `CL_GLOSSARY_CATS` |
| `assets/glossary-add-<课号>.js` | 写课时新增术语的临时文件，最后由 `node tools/finalize.mjs --merge` 合并 |
| `img/tNNN.png` | 教材第 NNN 页（印刷页码）整页图，110 dpi，约 797×1126 px。PDF 页码 = 印刷页码 + 5 |
| `img/tNNN-<名>.png` | 从第 NNN 页裁出的插图（用 Pillow 裁切），见下表 |
| `tools/sources.json` | 来源清单：课程名、端口、助教人设与课程规则，以及每个来源的 `path` / `scope` / `aliases` / `snapshot`（见第 9 节） |
| `tools/serve.py` | 本地服务 + DeepSeek 转发。各门课逐字相同，不要改；课程配置都在 `sources.json` |
| `errata.md` | AI 助教发现的“课文与来源矛盾”（服务端写入，作者核对后改课文、删条目） |
| `tools/check_page.py` | 真 Chrome 检查：JS 错误、坏链接、缺术语、演示没渲染、图片没加载、横向滚动 |
| `tools/finalize.mjs` | 合并术语、生成“出现在哪些课程”反向链接、报告缺失术语 |

## 2. 页面骨架（照抄 L01）

```html
<head>  course.css → glossary-data.js → [glossary-add-X.js] → course-lib.js
<header id="cl-topbar"></header>
<div class="layout">
  <aside class="toc"> 本课目录 <ol><li><a href="#s1">…</a></li>… </ol></aside>
  <main>
    .hero（kicker = "Lxx · 步骤名"，h1，一句导语，.meta）
    .objectives（学完本课，你能够：3–5 条，动词开头）
    section.lesson-sec#s1 … #sN   每节 h2 带 <span class="num">01</span>
    最后一节：自测（3–5 道 .quiz）+ 速记表 + 相关课程 .related
    <nav id="cl-pager" data-current="本文件名.html"></nav>
    <p class="disclaimer">原文出处 + “补充内容和模拟演示是课程作者的解释”</p>
  </main>
</div>
<script> CL.onReady(function(){ … }) </script>
```

## 3. 组件速查

- 原文配图：`<figure class="fig"><img src="img/fig04.jpg" alt="…"><figcaption><b>原文图 4</b>说明</figcaption></figure>`。点图放大；AI 助教自动加“问 AI”（把图片发给模型）。
- 原文金句：`blockquote.src` + `<cite>§2.1</cite>`，原样引用，少量。
- `.callout.rule` 核心规则；`.callout.note` 补充（**作者补充一律放这里，标题写“补充”**）；`.callout.tip` 提示；`.callout.warn` 局限/常见误解。第一行 `<span class="ttl">标题</span>`。
- `.grid-2 / .grid-3 > .kp`（`.k` 标签、`.v` 大字、`p`）；`.vs` 方案对照卡（`.good` / `.bad`）。
- `ol.steps`；`ul.checklist`；`.tbl-wrap > table.tbl`；`.pill.fast/.slow/.hot`；`.src-ref`。
- 互动演示：`.chart-card` > `.chart-head`（`.chart-title` + `label.ctrl` / `.btn`）→ `.demo#id` → `.readout` → `.chart-foot`。**结论数字写进 `.readout` 或 `.chart-foot`**，AI 助教才能读到。
- 时间线：`CL.lanes("#el", [{name, segs:[{t0,t1,cls:"c1".."c6",text}], ticks:[t]}], {t1, unit})`。
- 消息流：`ul.msgs > li.(drop|fast|slow|act)`，内含 `.src`、正文、`.verdict`。
- 内联 SVG：放在 `.diagram` 或 `.demo` 里，用 `.box .box.hl .box.dim .edge .edge.hl .edge.dash`、`text.sm`，自动适配主题。注意：共享样式会覆盖 SVG text 的 `fill="…"` 属性，特殊颜色用内联 `style="fill:…"`。
- `.quiz[data-answer=正确选项下标从0起]` > `.q` + `.opts > button…` + `.explain`。
- 术语：`<a class="term" href="glossary.html#id">词</a>`，ID 必须存在。课程互链：`<a href="L03-xxx.html#s3">`。

## 4. course-lib.js 速查

```js
CL.$("#id")  CL.$$(".x")  CL.fmt(x, 1)  CL.esc(s)  CL.pctl(arr, 95)
const r = CL.rng(42); r()      // 可复现随机数。小种子前几十个数会高低交替，需要时先丢弃约 50 个
CL.lanes(el, lanes, opts)      // 时间线泳道
CL.C.blue/orange/teal/purple/red/gray/gold/pink
CL.onTheme(fn)                 // 主题切换回调（JS 里用了颜色时重画）
CL.cssVar("--ink")
```

## 5. 术语表

- 先查 `assets/glossary-data.js`，有就用那个 ID。
- 没有：写进自己的 `assets/glossary-add-<课号>.js`（并在页面 head 引入）：
  `Object.assign(window.CL_GLOSSARY, { "id-kebab": { term, en, cat, short, body, see: [] } });`
- `cat` 只用 `CL_GLOSSARY_CATS` 里的分类。不要改 `glossary-data.js` 本身。

## 6. 写作规范（ASD-STE100 风格的简明中文）

完整规则、中文落地和改写示例：skill 的 `references/asd-ste100-zh.md`。交付前运行 `python3 ~/.claude/skills/interactive-courseware/scripts/ste_lint.py 你的文件.html`，逐条判断并改写。下面是要点：


1. 一句话只说一件事，≤ 25 字为佳。2. 主动语态，主语明确。3. 先结论后理由，每节第一段说清这节讲什么。
4. 术语第一次出现就解释或链接术语表。5. 同一个东西始终用同一个词，沿用原文用词。6. 指令用祈使句。
7. 数字具体，只用原文给出的数字；演示数字标明“模拟”。8. 语气专业平实，不夸张，不堆感叹号。
9. **忠于原文**：观点、例子、数字、限定语（“初步”“原型”“尚未默认开启”）都要讲到；补充放 `.callout.note` 标“补充”。

## 7. 互动演示（课程的核心价值）

- 每课至少 2 个演示，必须**揭示原文的一个机制或权衡**，不是装饰。
- 演示是简化模型：`.chart-foot` 写清假设、与原文数据的关系；不要把模拟结果说成原文结论。
- 数字由页面 JS 现算；正文引用演示结果时写“在这个模拟里”。用 `CL.rng(seed)` 保证可复现。
- **演示的简化假设要在终点状态下成立。** 播完、全部勾选、切到最后一个场景时，读数仍要和课文、来源一致。常见错误：工作已全部完成（`allDone`）之后的调用，演示仍按“成功”或“可补救”计。写完用 learner driver 的 `settle` 把每个演示推到终点，逐条看读数。
- 演示控件的标签沿用速记表和术语表里的词，同一个东西始终同一个词。

## 8. 自检（交付前必须做）

```bash
uv run --no-project --with playwright python tools/check_page.py 你的文件.html --shots <scratchpad>
uv run --no-project --with playwright python tools/check_page.py 你的文件.html --theme dark --shots <scratchpad>
uv run --no-project --with playwright python tools/check_page.py 你的文件.html --theme ink --width 1500 --shots <scratchpad>
```
- 只允许“链接到还没写好的其他课程”这类 broken link。
- 打开截图看：演示有内容、文字没溢出/重叠、三个主题都可读。元素截图里压在上面的顶栏是 sticky 造成的假象，不是 bug。

## 9. 来源清单、勘误与漂移

- **登记来源。** 课文引用的每个来源（原文、某个源码文件、另一篇文章、论文、笔记）都登记在 `tools/sources.json`。`scope` 取 `all`（每课都带）、`cited`（课文提到 `path` 或任一 `aliases` 时才带）或课程文件名列表（列出的课一定带，其余课提到时也带）。`aliases` 写课文里实际用的写法，例如 `state.ts`、书名、小节前缀；有歧义的写法（如两个 `index.ts`）不要做 alias。
- **检查。** `uv run --no-project python tools/serve.py --check` 列出每课带了哪些资料、超出预算省略了哪些、哪些文件缺失（报错），以及课文里像文件名或《书名》、但没有登记的引用（警告）。
- **快照。** 课文和来源核对一致后运行 `uv run --no-project python tools/serve.py --snapshot`。在 git 里且没有未提交改动的来源记提交号，其他来源记 sha256，并把内容副本存进 `tools/.snapshots/`。之后来源一变，引用它的课程顶部会出现提示，`/api/drift` 列出变化，助教也会拿到提交列表和 diff 节选。改完课文，再拍一次快照。
- **勘误。** 助教发现课文与来源矛盾时，在回答末尾输出 ```` ```errata ```` 块；服务端记进 `errata.md`（`GET /api/errata` 可列出），页面显示“疑似勘误”卡片。助教也会误报：先对照来源核实，再改课文，最后删掉条目。

## 10. AI 讲师的讲稿

每课可以有一份讲稿 `lecturer/scripts/<课号>.json`，讲师照着它高亮页面元素、操作演示、讲解。写法见 `lecturer/AUTHORING.md`。
讲稿用选择器指向页面元素，并引用演示的读数。所以改了课程页（小节 id、演示控件的 id、演示的计算、自测题顺序）之后，重跑讲稿自检：

```bash
cd lecturer && uv run lecturer.py check <课号> --readouts
```

有错误就改讲稿；读数变了就改讲稿里的数字，再 `uv run lecturer.py audio <课号>` 重新合成改过的句子。

## 11. 本课程的约定（四年级数学）

- **读者是四年级小学生**（9–10 岁）。句子更短，多举生活例子，用“你”。不引入后面年级才学的知识（负数、小数乘法、方程、乘方）；必须提到时写“以后会学”。
- **页码**：一律写“教材第 N 页”（书上印的页码）。存档 `docs/articles/textbook.md` 每页标题写着“教材第 N 页（PDF 第 N+5 页）”。
- **原文图**：`<figure class="fig"><img src="img/t002-jishuqi.png" …><figcaption><b>教材第 2 页</b>说明</figcaption></figure>`。整页图用 `img/tNNN.png`；需要局部时用 Pillow 裁切成 `img/tNNN-<名>.png`，并登记到下表。
- **数学用语照教材**：如“先分级，再从高位起按级读”“相同数位对齐”“四舍五入”“二千”（不写“两千”）。读数统一用 `CL.readNum()`（course-lib.js，已按教材规则测过），分级用 `CL.groupNum()`。
- **演示**：每课 ≥ 2 个。做成小学生能“拨一拨、拖一拖、填一填”的操作，readout 写成完整的句子。练习类演示要有“检查 / 看答案 / 下一题”，题目尽量取自教材的“做一做”和练习，并在 `.chart-foot` 写明出处。
- **自测题**解释里引用教材页码。
- **不给练习的完整答案大全**：自测题和演示里可以有答案；正文讲例题，不把整套练习的答案都列出来。

### 裁切插图登记表

| 文件 | 教材页 | 内容 |
|---|---|---|
| `t002-jishuqi.png` | 第 2 页 | 北京人口 21893095；计数器一万一万地数 |
| `t002-shuweibiao.png` | 第 2 页 | 数位顺序表（21893095 中 8 表示 8 个十万） |
| `t005-sanwei.png` | 第 5 页 | “先分级，比较容易读”插图 |
| `t010-shijinzhi.png` | 第 10 页 | 计数器从一亿数下去；到千亿位的数位顺序表；十进制计数法 |
| `t017-sishewuru.png` | 第 17 页 | 张阿姨 182068≈18 万、李阿姨 218309≈22 万；“四舍五入”法 |
| `t025-yizhang.png` | 第 25 页 | 100 张纸厚 1 cm，算 1 亿张纸有多高 |
| `t028-xuanzhuan.png` | 第 28 页 | 扇子演示周角、平角、直角、锐角、钝角 |
| `t029-sanjiaochi.png` | 第 29 页 | ∠1、∠2 哪个大，用三角尺量 |
| `t030-liangjiaoqi.png` | 第 30 页 | 1 周角 = 360° 等；量角器的中心和 0° 刻度线 |
| `t031-liangjiao.png` | 第 31 页 | 用量角器量 ∠1 和量角的步骤 |
| `t032-huajiao.png` | 第 32 页 | 画 60° 的角的三个步骤 |
| `t035-jiqiren.png` | 第 35 页 | 信息技术应用：指挥机器人送餐 |
| `t039-chaifen.png` | 第 39 页 | 16×3 拆分，小方块图 |
| `t040-zhengshi.png` | 第 40 页 | 例 2：6×10、12×20 |
| `t043-xiaoliang.png` | 第 43 页 | 小亮、小红的想法，12×13 竖式 |
| `t044-fazhe.png` | 第 44 页 | 例 2：37×48，三步法则 |
| `t048-zhongjian0.png` | 第 48 页 | 例 3：106×63，160×60 |
| `t048-gezi.png` | 第 48 页 | 格子乘法 46×75 |
| `t049-guilv.png` | 第 49 页 | 例 4：积的变化规律 |
| `t050-jisuanqi.png` | 第 50 页 | 例 5：11×11…… |
| `t053-gusuan.png` | 第 53 页 | 例 6：估算选服装 |
| `t055-jiegou.png` | 第 55 页 | 第三单元知识结构图 |
| `t058-zongliang.png` | 第 58 页 | 借阅人数表、总量 = 分量 + 分量 |
| `t062-xiaopiao.png` | 第 62 页 | 购物小票 |
| `t065-niunai.png` | 第 65 页 | 牛奶三种买法 |
| `t066-shangxue.png` | 第 66 页 | 小红、小明、小丽上学路线图 |
| `t070-liangtiao.png` | 第 70 页 | 两条直线的五种情况，画长后 |
| `t071-pingxing.png` | 第 71 页 | 平行线，a // b |
| `t071-chuizhi.png` | 第 71 页 | 互相垂直，垂足 O |
| `t072-huachuixian.png` | 第 72 页 | 画垂线 |
| `t073-juli.png` | 第 73 页 | 垂直线段最短；点到直线的距离 |
| `t074-huapingxing.png` | 第 74 页 | 画平行线 |
| `t074-chuizhixianduan.png` | 第 74 页 | 两条平行线之间的垂直线段相等 |
| `t075-changfangxing.png` | 第 75 页 | 画长方形的三步 |
| `t078-shenghuo.png` | 第 78 页 | 生活中的平行四边形 |
| `t079-duijiao.png` | 第 79 页 | 量一量；对角相等 |
| `t080-tixing.png` | 第 80 页 | 生活中的梯形，梯形各部分名称 |
| `t080-zhijiao-dengyao.png` | 第 80 页 | 直角梯形；折等腰梯形 |
| `t085-jiegou.png` | 第 85 页 | 第五单元知识结构图 |
| `t088-tiaoxing.png` | 第 88 页 | 圆圈表示法和 8 月天气条形统计图 |
| `t090-gezi.png` | 第 90 页 | “1 个格代表 2 个人”和空白方格图 |
| `t096-fushi.png` | 第 96 页 | 城乡人口两幅单式图和复式图 |
| `t097-jinchukou.png` | 第 97 页 | 2020—2024 年货物进出口总额统计图 |
| `t102-xiaoyuan.png` | 第 102 页 | 校园全景，4 号、5 号宝藏的对话 |
| `t103-cangbaotu.png` | 第 103 页 | 藏宝图和寻宝指令 |
| `t104-zhinanzhen.png` | 第 104 页 | 指南针八个方向 |
| `t105-cangbaotu.png` | 第 105 页 | 标出 1–5 号宝藏的藏宝图 |
| `t107-dianzhong.png` | 第 107 页 | 点钟方向定位图 |
| `t108-zhishitu.png` | 第 108 页 | 数与运算知识结构图和计数器 |
| `t108-shuweibiao.png` | 第 108 页 | 数位顺序表（60174690000） |
| `t109-shushi.png` | 第 109 页 | 14 × 12 竖式和对话 |
| `t109-shuliang.png` | 第 109 页 | 数量关系结构图和骑行路程 |
| `t110-tuxing.png` | 第 110 页 | 图形的认识与测量结构图 |
| `t111-tongji.png` | 第 111 页 | 电话用户数条形统计图 |
| `t111-fangxiang.png` | 第 111 页 | 八个方向示意图 |
| `t113-dongwuyuan.png` | 第 113 页 | 动物园导游图 |
| `t118-yuanti.png` | 第 118 页 | 鸡兔同笼原题 |
| `t118-huatu.png` | 第 118 页 | 画图法（暂未使用） |
| `t119-liebiao.png` | 第 119 页 | 列表和对话 |
| `t119-taijiao.png` | 第 119 页 | 古人的抬脚法 |
| `t119-baiseng.png` | 第 119 页 | 百僧百馍原题 |

### 本课程踩过的坑

- **不要用 `data-step` 当演示控件的属性。** 左栏学习路线已经用了 `[data-step]`，`[data-step='1']` 会先选中左栏，讲师和测试脚本会点错。改用别的名字（如 `data-per`）。
- **教材前后不一致时以图为准，并在课里说明。** 例：第 102、103 页的宝藏位置描述和第 105 页的藏宝图不一致，L10 按第 105 页的图做演示。
- **推算出来的中间数要标“推算”。** 例：教材只给“1 亿粒大米约 2 t”，L02 倒推的“100 粒约 2 g”标了“推算”。
- **这一版教材没有平行四边形、梯形的“高”，也没有“平行线间的距离”这个词**（第 74 页只说垂直线段都相等）。不要按旧版教材补进去。
- **演示要能被讲师重放。** 讲稿每步跑两次，结果必须一样：
  - 练习题类演示加选题下拉框（L01 `#wr-q`、L02 `#rq-q`、L03 `#pr-q`），选题时状态全部复位。
  - 不要显示“已答对 n 题”“已经点过 n 个”这类累计数；非要有，就配一个“清空”按钮把它归零（L08 `#bk-clear`）。
  - 开关式按钮（“拼起来/分开”）在换选项时先复位（L05 `#pn-join`）。
- **SVG 里的辅助线加 `pointer-events: none`**，否则会挡住下面的可点区域（L10 方向盘十字轴线挡住了东南西北四格）。
