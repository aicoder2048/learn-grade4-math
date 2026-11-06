# 四年级数学上册 · 互动课

人教版《数学》四年级上册（2022 课标修订版，2026 秋）做成的互动自学课件：4 步 11 课，每课有教材原页、可动手的演示、自测题，右栏 AI 助教，外加带读的 AI 讲师。

## 快速开始

1. **准备**：[uv](https://docs.astral.sh/uv/)、本机 Chrome（AI 讲师用）、[just](https://github.com/casey/just) ≥ 1.54（可选），以及你**自己的** [DeepSeek API key](https://platform.deepseek.com/api_keys)。
2. **克隆**：
   ```bash
   git clone https://github.com/aicoder2048/learn-grade4-math.git
   cd learn-grade4-math
   ```
3. **填 key**：`cp lessons/.env.sample lessons/.env`，把 `DEEPSEEK_API_KEY` 改成你的 key。`.env` 已被 git 忽略；key 只在本机的 `tools/serve.py` 里使用，不会进入浏览器页面。
4. **合成讲师语音**（只用 AI 助教可以跳过）：语音文件不在仓库里，要在本机生成一次。用 edge-tts，免费，需要联网；11 课约 400 段、50 MB，几分钟就能完成。
   ```bash
   just lecture-audio                                   # 全部 11 课；只合成一课：just lecture-audio L01
   # 没装 just：cd lessons/lecturer && uv run lecturer.py audio
   ```
   跳过这一步也能开讲，讲师会边讲边合成，但每句话开口前会多等一会儿。
5. **启动**：见下一节。

## 启动

```bash
just course                 # 只开课程（含 AI 助教），打开 http://127.0.0.1:8771/lessons/
just course --lecture L01   # 课程 + AI 讲师从第 1 课开讲（不写课号从第一课开始）
```

没装 just（需要 ≥ 1.54）：`cd lessons && uv run --no-project python tools/course.py [--lecture L01]`。
直接双击 `lessons/index.html` 也能学，只是没有 AI 助教和讲师。

## AI 讲师

- 讲师照离线写好的讲稿 `lessons/lecturer/scripts/<课号>.json` 讲课：高亮页面、亲手操作演示、语音讲解，每课 1–2 次公开请助教答疑，讲完自动进入下一课。
- 快捷键：空格暂停/继续，←/→ 上一步/下一步，R 换个讲法，Esc 离开输入框。
- 讲课中可以自己点左栏换课：讲师会跟过去讲那一课，回到讲了一半的课时从上次那步接着讲。打开首页、术语表这类没有讲稿的页面，讲师会暂停，按空格回到原来那课。
- 语音用 edge-tts（免费，要联网），第一次讲某课会先合成；可以预先合成：`just lecture-audio`。音频不进 git。
- 讲稿自检：`just lecture-check L01 --readouts`。
- 11 课都有讲稿。只有 L01 有人完整听过，L02–L11 只过了自动检查。听到问题时，记下控制条上的“第 N 步”。

## 计费

- AI 助教、讲师的代问、“换个讲法”都走 **DeepSeek 官方 API，按量计费**。key 放在 `lessons/.env`（已被 git 忽略）。
- 每次提问、每次代问是一个请求；“记笔记”整理一次约 20–60 秒，也计费。

## 目录

| 路径 | 内容 |
|---|---|
| `docs/人教版_数学_四年级上册_…pdf` | 教材 PDF（版权归人民教育出版社，仅供个人学习） |
| `docs/articles/textbook.md`、`units/`、`pages/` | 逐页抽取的文字、按单元切分的助教资料、页图 |
| `lessons/` | 课程页 `L01–L11`、首页、术语表、学习笔记页 |
| `lessons/AUTHORING.md` | 课程编写规范（含插图登记表、本课程的约定和坑） |
| `lessons/lecturer/` | AI 讲师（Playwright + edge-tts）和讲稿 |

## 常见问题

- **右栏显示“未连接”**：页面是直接双击打开的。用 `just course` 启动，再打开 `http://127.0.0.1:8771/lessons/`。
- **助教报“没有 key”或 401**：`lessons/.env` 不存在，或 key 填错了。
- **助教报 402**：DeepSeek 账户余额不足，需要充值。
- **端口被占用**：`just course --port 9000`。

## 版权

教材《义务教育教科书 数学 四年级上册》（人民教育出版社）的 PDF、页图、插图和文字版权归原出版社所有，本仓库收录它们只为个人学习，不用于商业用途。课程中的演示、讲解和讲稿是课程作者编写的，标为“补充”“推算”的内容不是教材原文。权利人如有异议，请提 issue，我们会尽快删除相关内容。

## 许可证

本仓库的课程页面、演示、讲稿、代码和文档采用 [MIT 许可证](LICENSE)。许可证不覆盖教材本身和取自教材的内容：教材 PDF、`docs/articles/`（抽取的文字、页图）、`lessons/img/`（页图和裁切插图），以及课程页里引用的教材原文。这些内容的版权归人民教育出版社。范围说明见 [NOTICE](NOTICE)。
