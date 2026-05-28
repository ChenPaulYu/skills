---
date: 2026-05-28
status: confirmed
---

# Symlink + `/reload-plugins` ≠ plugin discovery — 需要 marketplace.json + `/plugin marketplace add` + `/plugin install`

## What I tried

```bash
mkdir -p .claude-plugin && # write plugin.json
ln -s <local-path> ~/.claude/plugins/marketplaces/skills
/reload-plugins
```

## What happened

`/reload-plugins` 跑成功,但 plugin 的 skills 沒出現在可用列表。跑兩次同樣結果。

## Root cause

三個漏洞:

1. `.claude-plugin/marketplace.json` 缺。`plugin.json` 一個不夠 —— Claude Code 先讀 `marketplace.json` 才知道資料夾裡有哪些 plugin。
2. Marketplace 沒註冊。`/reload-plugins` 只重讀 `known_marketplaces.json` 已列的;symlink 不會自動寫進去,只有 `/plugin marketplace add <path>` 會。
3. Plugin 沒安裝。註冊只是讓 marketplace 可見,還要 `/plugin install <plugin>@<marketplace>` 才會寫進 `installed_plugins.json`。

驗證方式:檢查 `~/.claude/plugins/known_marketplaces.json` + `installed_plugins.json`,兩邊都沒有對應 entry。對照 `planning-with-files` 等正常 plugin,`.claude-plugin/` 兩個 json 檔都有。

## How I fixed it

```bash
# 1. 補 marketplace.json（plugins[] 列出 name + source + version）
# 2. 砍掉 symlink（用不到）
rm ~/.claude/plugins/marketplaces/skills

# 以下兩條 user 跑（/plugin commands agent 不能跑）
/plugin marketplace add <absolute-local-path>
/plugin install <plugin>@<marketplace>
```

裝完 skills 才會出現。之後改 SKILL.md 內容,`/reload-plugins` 才有意義。

## Future-self note

心智模型:**三個 explicit verbs,不是 file-on-disk discovery**。

| 動作 | 寫到哪 | 何時用 |
|---|---|---|
| `/plugin marketplace add <path>` | `known_marketplaces.json` | 首次認識一個 marketplace |
| `/plugin install <p>@<m>` | `installed_plugins.json` | 開啟一個 plugin |
| `/reload-plugins` | 無(只重讀檔案) | 改了 SKILL.md 內容 |

Local dev 不用先推 GitHub —— `/plugin marketplace add` 吃絕對路徑。`/plugin*` 都是 user-only,agent 不能呼叫。

**通則**:Claude Code 把「register / install / reload」當三個獨立動詞。registry 檔是 source of truth,不是檔案系統。
