# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성 (README, ROADMAP 등 모든 `.md` 문서 포함)
- **변수명/함수명**: 영어 (코드 표준 준수)

## 프로젝트 개요

개인 개발자 이력서(포트폴리오) 정적 웹사이트. 별도 프레임워크나 빌드 도구 없이 순수 HTML/CSS/JavaScript와 Tailwind CSS(CDN 방식)로 구성된 단일 페이지 사이트다. 진행 계획과 단계별 체크리스트는 `ROADMAP.md`에 정리되어 있다.

## 개발 명령어

빌드 도구나 패키지 매니저가 없는 순수 정적 사이트이므로 별도의 빌드/린트/테스트 명령이 없다.

- **로컬 미리보기**: `index.html`을 브라우저에서 직접 열거나, 라이브 리로드가 필요하면 `python -m http.server`와 같은 정적 서버를 프로젝트 루트에서 실행한다.

## 아키텍처

- `index.html` — 전체 페이지를 구성하는 단일 HTML 파일. Tailwind CSS를 CDN 스크립트(`https://cdn.tailwindcss.com`)로 로드하며, 별도의 Tailwind 설정 파일이나 빌드 단계는 없다. 섹션은 앵커 링크(`#about`, `#skills`, `#experience`, `#projects`, `#contact`)로 연결되는 싱글 페이지 구조(Header/Nav → Hero → About → Skills → Experience → Projects → Contact → Footer)다.
- `css/style.css` — Tailwind 유틸리티 클래스로 표현하기 어려운 최소한의 커스텀 스타일만 둔다.
- `js/script.js` — 모바일 메뉴 토글 등 페이지 인터랙션을 담당하는 순수 JavaScript(프레임워크 없음).
- 이력서 콘텐츠(자기소개, 경력, 프로젝트 등)는 현재 `index.html`에 직접 하드코딩된 placeholder 상태다. `ROADMAP.md`의 1단계·3단계 항목에 따라 추후 별도 데이터 파일(JSON 등)로 분리하고 실제 정보로 교체할 예정이다.

## 진행 상태 참고

`ROADMAP.md`는 목표 정의 → 콘텐츠 준비 → 기술 스택 결정 → 프로젝트 구조 세팅 → 섹션 구현 → 반응형/접근성 → 성능/SEO → 배포 → 유지보수 순서의 단계별 체크리스트다. 작업 전 현재 어느 단계까지 완료되었는지 이 파일에서 확인한다.
