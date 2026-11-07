# 四年级数学上册 · 互动课

人教版《数学》四年级上册（2022 课标修订版，2026 秋）做成的互动自学课件。

- **4 步 · 11 课**：每课有教材原页、可以动手操作的演示、自测题。
- **术语表**和**学习笔记**页。

默认用法：AI 讲师打开 Chrome 带孩子走读课件，配语音讲解，遇到疑问会向右栏的 AI 助教提问。孩子或家长也可以随时自己问助教。

## 需要

- [uv](https://docs.astral.sh/uv/)
- [just](https://just.systems)，版本 ≥ 1.54
- Chrome
- 你自己的 DeepSeek API Key

获取课程：

```bash
git clone https://github.com/aicoder2048/learn-grade4-math.git
cd learn-grade4-math
```

## 配置 API Key

```bash
cp lessons/.env.sample lessons/.env
```

打开 `lessons/.env`，填入你的 key：

| 变量 | 是否必须 | 用途 |
|---|---|---|
| `DEEPSEEK_API_KEY` | 必须 | AI 助教答疑、联网查资料、整理学习笔记；AI 讲师代孩子向助教提问 |
| `MOONSHOT_API_KEY` | 可选 | 只用于“换个讲法”（R 键），不填就用 DeepSeek。要用 Kimi Code 会员的 key，开放平台的 key 不行 |

DeepSeek key 在 https://platform.deepseek.com/api_keys 申请，按量计费，要先充值。每次提问、每次代问、每次整理笔记都是一次计费请求。`.env` 已被 `.gitignore` 排除，不会提交。

## 开始上课

第一次先合成讲师语音（edge-tts，免费，要联网；11 课约 400 段、50 MB，几分钟完成）。语音文件不在仓库里，克隆后要在本地生成：

```bash
just lecture-audio
```

然后开课：

```bash
just course --lecture
```

第一次启动时，uv 会自动安装依赖，需要几十秒。不用手动跑 `uv sync`。

上课时的按键：

| 按键 | 作用 |
|---|---|
| 空格 | 暂停 / 继续 |
| ← / → | 上一步 / 下一步 |
| R | 换个讲法 |
| Esc | 离开输入框 |

在右栏提问时，讲课会自动暂停，看完回答按空格继续。也可以点左栏换课，讲师会跟过去；回到讲了一半的课，会从上次那一步接着讲。关掉浏览器窗口或按 Ctrl+C 结束。

11 课都有讲稿。目前只有 L01 有人完整听过，L02–L11 只过了自动检查。听到问题时，请记下控制条上的“第 N 步”。

## 常见问题

- **右栏显示“未连接”**：页面是直接双击打开的。用 `just course` 启动，再打开 http://127.0.0.1:8771/lessons/ 。
- **提示没有 key，或报 401**：检查 `lessons/.env` 是否存在，`DEEPSEEK_API_KEY=` 后面的 key 对不对。
- **报 402**：DeepSeek 账户余额不足，需要充值。
- **讲师说话前要等一会儿**：还没合成语音，先跑 `just lecture-audio`。
- **找不到 Chrome**：运行 `cd lessons/lecturer && uv run playwright install chromium`。
- **端口被占用**：加 `--port 9000` 换个端口。
- **just 不认识 `[continue]`**：just 版本太老，升级到 1.54 以上。

## 目录与维护

| 路径 | 内容 |
|---|---|
| `lessons/index.html` | 课件首页；`L01–L11` 课程页、`glossary.html` 术语表、`notes.html` 学习笔记 |
| `lessons/img/` | 教材页图和裁切插图 |
| `lessons/lecturer/` | AI 讲师（Playwright + edge-tts）；`scripts/` 是讲稿 |
| `lessons/tools/` | `serve.py` 本地服务与助教转发，`course.py` 一键启动，`check_page.py` 页面检查，`finalize.mjs` 术语合并 |
| `lessons/AUTHORING.md` | 课程编写规范（含插图登记表、本课程的约定和坑） |
| `docs/` | 教材 PDF；`docs/articles/` 逐页文字、按单元切分的助教资料、页图 |

运行 `just` 可以看到全部命令，包括讲稿自检 `just lecture-check`。

## 说明

教材《义务教育教科书 数学 四年级上册》（人民教育出版社）的 PDF、页图、插图和文字版权归原出版社所有，本仓库收录它们只为个人学习，不用于商业用途。课程中的演示、讲解和讲稿是课程作者编写的，标为“补充”“推算”的内容不是教材原文。权利人如有异议，请提 issue，我们会尽快删除相关内容。

本仓库的课程页面、演示、讲稿、代码和文档采用 [MIT 许可证](LICENSE)。许可证不覆盖教材本身和取自教材的内容：教材 PDF、`docs/articles/`、`lessons/img/`，以及课程页里引用的教材原文。范围说明见 [NOTICE](NOTICE)。

---

不想听语音，可以只开课件和 AI 助教：运行 `just course`，然后打开 http://127.0.0.1:8771/lessons/ 。
