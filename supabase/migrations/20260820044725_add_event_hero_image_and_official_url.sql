-- TASK-301 DB 연결: Event asset/link 원본 데이터 보완
-- Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.6 events)
--
-- events는 Event 단위로 대표 이미지(hero_image_url)와 MCM 공식 페이지 링크(official_url)를
-- 아직 저장할 곳이 없었다(TASK-301 "Event asset/link 데이터 저장 위치 확인" 분석에서 확인).
-- 기존 20260817132615_initial_schema.sql은 수정하지 않고, 신규 컬럼만 추가한다.
--
-- 둘 다 nullable이다 — 현재 seed에 실제 값이 없고(placeholder를 넣지 않기로 함), 기존
-- events row(및 향후 실제 이벤트)가 이 값 없이도 계속 유효해야 하기 때문이다.

alter table events
  add column hero_image_url text,
  add column official_url text;
