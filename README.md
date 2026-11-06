# 四年级数学上册 · 互动课

人教版《数学》四年级上册（2022 课标修订版，2026 秋）做成的互动自学课件：4 步 11 课，每课有教材原页、可动手的演示、自测题，右栏 AI 助教，外加带读的 AI 讲师。

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
