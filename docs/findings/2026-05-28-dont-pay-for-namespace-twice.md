---
date: 2026-05-28
status: confirmed
---

# 不要在 namespace 付兩次錢 —— `<plugin>:<skill>` 已經分組,別在 skill 名再加 family prefix

## What I tried

Plugin 叫 `skills`(generic 容器),skills 叫 `nav-audit` / `nav-refactor` / `nav-headers` / `nav-map` / `nav-doctor`。理由:`skills` 太 generic,`nav-` prefix 補 topic context。

## What happened

Slash command 變 `/skills:nav-doctor`。讀起來重複 —— `skills:` 跟 `nav-` 兩層在做同一件事(group by family)。看 ADR-001 #2 寫的理由(「plugin 名沒 topic,所以 skill 名要補」),其實是把問題押在錯的層。

## Root cause

Claude Code 已經用 `<plugin>:<skill>` 內建 namespace。Plugin 名本身就可以承載 topic;在 skill 名裡再加 prefix = 重複編碼同一個 namespace。

## How I fixed it

Restructure 成 Matt Pocock 真正的形狀:

| 層 | 原本 | 改後 |
|---|---|---|
| Marketplace | `skills` | `skills`(不變,personal 容器) |
| Plugin | `skills` | `nav`(topic) |
| Skill | `nav-audit` | `audit`(bare verb) |
| 觸發 | `/skills:nav-audit` | `/nav:audit` |

`/nav:doctor` 也對齊 `brew doctor` / `flutter doctor` / `npm doctor` 的肌肉記憶。決定記在 ADR-005。

## Future-self note

加新 plugin 時:

- Plugin 名 = **topic**(`nav`, `spec`, `craft`),不要 generic 容器名。
- Skill 名 = **bare verb**(`audit`, `build`, `review`)。
- 一旦想取 `<topic>-<verb>` 形式的 skill 名,訊號:**plugin 名應該就是那個 topic**。
- Marketplace 名才是 generic 容器(`skills`)—— identity 從 GitHub username 來(`ChenPaulYu/skills`)。

**通則**:當系統已經提供 namespacing,不要在被 namespace 的項目名稱裡再重複編碼 namespace。同樣套用於:env var prefix、table column prefix、CSS class prefix、file path prefix。
