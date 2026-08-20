# TASK-404-2 Email Detail UI Specification

## 목적

Inbox에서 선택한 MCM Editorial Email 상세 화면 구현


---

# Scope

Email Header

표시:

- Sender
- Subject
- Date
- Recipient


---

# Email Body

구조:

Email Header

↓

Editorial Content Area


---

# Connection

Mail Body 내부에 TASK-403 Renderer 연결


Flow:

Mock Email

↓

Editorial Renderer

↓

Personal Magazine


---

# Constraint

- TASK-403 Component 수정 금지
- Email Layout Layer에서만 연결
- Mock Email Data 사용