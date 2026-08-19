# TASK-404-1 Inbox UI Specification

## 목적

고객이 Personal Editorial Issue를 전달받는 첫 번째 Experience 화면 구현.

실제 Gmail API/메일 발송은 사용하지 않고,
MCM 고객 이메일 Inbox를 Mock UI로 구현한다.

---

# Scope

## Inbox Layout

구현:

- Email client 형태의 Inbox 화면
- Header 영역
- Mail list 영역
- Sidebar 영역

---

# Mail Item

표시 데이터:

- sender
- subject
- preview
- date
- read/unread 상태

예:

Sender:
MCM Editorial Team

Subject:
Your Personal MCM Issue 01 has arrived

Preview:
Discover a new chapter inspired by your taste.

---

# Interaction

Mail item 클릭

↓

TASK-404-2 Email Detail 이동

---

# Constraint

- 실제 이메일 API 사용 금지
- Mock Data 사용
- 403 Renderer 수정 금지