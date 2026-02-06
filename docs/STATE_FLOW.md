# STATE_FLOW.md

This document defines **state ownership and flow** for the project.

---

## Document Scope

This document defines **state ownership and flow**.

It is written primarily for:
- preventing accidental state duplication
- guiding AI-driven implementation
- validating structural consistency

**UI structure and visual hierarchy are intentionally omitted.**  
For logical structure and responsibility → see **STRUCTURE.md**.

---

## What Belongs Here

- Where state is **declared** (which file / module)
- Who is **source of truth** for each piece of state
- Which **events** change which state
- Where state **flows down** to (props, context)
- Which components **only read** (no setState)
- **Side effects** that read/write state (API, storage, timers, subscriptions)
- **Hooks** that own or consume this state (at the level needed for "where to implement")

What does **not** belong here:
- UI / domain stories for humans
- Detailed "why we built this feature" narrative

---

## State / Module Flow Template

Fill in per state tree or per module as the project grows.

### State or module identifier

**Declared in**
- File / hook / store

**Source of truth**
- This module vs derived elsewhere

**Updated by (events / triggers)**
- User action, effect, subscription, etc.

**Flows down to**
- Components / hooks that receive via props or context

**Read-only consumers**
- Components that only read, never set

**Side effects**
- API calls, storage, timers, subscriptions that read or write this state

**Hooks involved**
- useState, useReducer, custom hooks that own or consume this state

---

## AI Usage Rules

**Update only when needed.** No need to update this document on every code change — only when **state ownership or flow** actually changes.

1. **Before adding or moving state:**
   - Check STATE_FLOW.md for existing owner and flow.
   - If not defined, propose an update to STATE_FLOW.md before writing code.

2. **When changing where state lives or how it flows:**
   - Update STATE_FLOW.md when that change happens.

3. **When STATE_FLOW.md and code disagree:**
   - Treat STATE_FLOW.md as the contract; align code or propose a STATE_FLOW.md update.

4. **Use this document to decide:**
   - "Should this state be created here?" → see Declared in / Source of truth.
   - "Is this change a structural change?" → if state ownership or flow changes, yes.

---

## Priority

For **state ownership and flow**:

**STATE_FLOW.md > Implementation Guides > Source Code**
