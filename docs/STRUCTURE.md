# STRUCTURE.md

This document defines **how project structure is described, maintained, and used**.
It is not a snapshot of the current file tree.

---

## Document Scope

This document describes the **logical and responsibility-based structure** of the project.

It does **not** define:
- state ownership
- data flow
- hook-level implementation details

Those concerns are defined separately in **STATE_FLOW.md**.

---

**Purpose:**
- **For humans:** Quick grasp of the whole; "what is this project divided into?", "why does this file exist?", "where are the responsibility boundaries?"
- **For AI:** Decide "which area?", "is it okay to touch this file?" — a **map** by domain / feature / responsibility.

All future projects based on this repository must:
- define their structure here before major implementation
- keep this document in sync when **responsibility or boundaries** change
- treat this document as the source of truth for **logical structure** (state/flow → STATE_FLOW.md)

---

## Structure Authoring Rules

- Structure is defined by **responsibility and role**, not by folder depth.
- Express as **root → children** (e.g. by page, feature, or domain). Intent and responsibility first; no need to match code order 1:1.
- UI layout and visual hierarchy are secondary and may change without structural updates.
- A file may be moved or renamed without changing its structural role.

---

## File / Module Contract Template

Each significant file or module is described with the following. Fill in as the project grows.

**For state ownership, flow, and hooks for this module → see STATE_FLOW.md.**

### `FileName` or `ModuleName`

**Role**
- What responsibility this file owns (human-readable)
- Why it exists; responsibility boundary

**Exports**
- Components / functions exported from this file

**Dependencies**
- Depends on (imports from)
- Depended on by (known consumers)

---

## AI Usage Rules

When working on this project:

**Update only when needed.** No need to update this document on every code change — only when **responsibility or boundaries** actually change.

1. **Before implementing a new feature:**
   - Check whether the responsible file/module is defined here.
   - If not, propose an update to STRUCTURE.md before writing code.
   - For "where does this state live?" or "who is source of truth?" → use **STATE_FLOW.md**.

2. **When modifying behavior:**
   - If **responsibility or boundaries** actually change → update STRUCTURE.md.
   - If **state ownership, data flow, or hooks** change → update STATE_FLOW.md (see STATE_FLOW.md).
   - If both change → update both when relevant; ask when unclear.

3. **If instructions conflict with this document:**
   - Ask for clarification before proceeding.

4. **Do not infer structure from folder names alone.**
   - Use Role, Exports, and Dependencies as signals.

---

## Priority

For **logical structure and responsibility**:

**STRUCTURE.md > Implementation Guides > Source Code**

When STRUCTURE.md and code disagree on "who owns what", treat STRUCTURE.md as the contract.

For **state ownership and flow** → **STATE_FLOW.md** is the source of truth.
