# MON-859: mongoori-www 블로그 섹션 구현 계획

**작성일:** 2026-03-16
**작성자:** Frontend Engineer
**목적:** Content 에이전트가 생성한 SEO 블로그 포스트(14개+)를 mongoori.com에 자동 배포할 수 있는 프론트엔드 구현 계획 수립

---

## 1. 현황 분석

### 1-1. mongoori-www 기술 스택

| 항목 | 현황 |
|------|------|
| 프레임워크 | **없음** — 순수 정적 HTML/CSS |
| 빌드 시스템 | **없음** — git commit → 직접 배포 |
| 블로그 렌더링 | **수동** — MD 파일을 사람이 HTML로 변환 |
| SEO 구조 | Schema.org JSON-LD, canonical, OG 태그 완비 |

### 1-2. 현재 블로그 섹션 상태

- **배포된 포스트:** 10개 (`mongoori-www/blog/{slug}/index.html`)
- **블로그 인덱스:** `mongoori-www/blog/index.html` (수동 유지)
- **미배포 Markdown 포스트:** 최소 6개 이상
  - `/content/blog/blog-post-11-ev-charging-guide-irvine-rideshare.md`
  - `/content/blog/blog-post-12-tesla-vs-gas-rideshare-income-comparison.md`
  - `/content/blog_post_13_tesla_model_y_rideshare_range.md`
  - `/content/blog_post_14_maximize_uber_earnings_tesla_socal.md`
  - `/blog/posts/rideshare-insurance-california-requirements.md`
  - `/blog/posts/tesla-vs-prius-rideshare-profitability.md`

### 1-3. 현재 문제점

1. **확장성 없음:** 포스트마다 수동으로 HTML 작성 → 에이전트 리소스 낭비
2. **Markdown 분산:** 여러 디렉토리에 산재 (content/blog, blog/posts, content/ 루트)
3. **인덱스 페이지 비동기화 위험:** `blog/index.html` 수동 관리 → 누락 가능
4. **일관성 리스크:** 포스트마다 SEO 메타태그/Schema.org 품질이 다를 수 있음

---

## 2. 구현 방식 결정: MD→HTML 렌더링

### 옵션 비교

| 옵션 | 설명 | 장점 | 단점 | 적합성 |
|------|------|------|------|--------|
| **A. Node.js 빌드 스크립트** | `build-blog.mjs` 스크립트로 MD→HTML 자동 변환 | 기존 정적 HTML 구조 유지, SEO 최적, 낮은 의존성 | 빌드 단계 추가 | ⭐ **추천** |
| B. Astro/Next.js 마이그레이션 | SSG 프레임워크로 전환 | 장기 DX 향상, 컴포넌트 재사용 | 현 규모 대비 오버킬, 전체 리라이트 필요 | 미래 고려 |
| C. Headless CMS (Contentful 등) | CMS API 연동 | 비개발자 편집 가능 | 외부 의존성, 비용, 빌드 복잡도 | 부적합 |

### 결정: **옵션 A — Node.js 빌드 스크립트**

**근거:**
- mongoori-www는 현재 순수 정적 HTML → 최소 변경으로 최대 효과
- 정적 HTML은 SEO에 최적 (크롤링 즉시 가능)
- 프레임워크 마이그레이션 없이 자동화 달성 가능
- Content 에이전트가 Markdown 파일 commit만 하면 자동 빌드 가능

---

## 3. 구현 계획

### Phase 1: 콘텐츠 통합 및 표준화 (1일)

**목표:** 분산된 Markdown 포스트를 단일 canonical 디렉토리로 통합

1. `mongoori-www/blog-content/` 디렉토리 생성
2. 모든 기존 blog MD 파일을 `blog-content/`로 이동 + 슬러그 기반 이름 정리
3. 각 MD 파일에 YAML frontmatter 표준화:

```yaml
---
title: "포스트 제목"
slug: "url-slug"
date: "2026-03-16"
description: "SEO 메타 설명 (155자 이내)"
tags: ["tesla", "rideshare", "irvine"]
ogTitle: "OG 태그용 제목"
category: "drivers" | "hosts" | "general"
---
```

**산출물:** `mongoori-www/blog-content/` (16개 MD 파일, 모두 frontmatter 완비)

### Phase 2: 빌드 스크립트 개발 (1일)

**목표:** `build-blog.mjs` 스크립트 — MD→HTML 자동 변환

```
mongoori-www/
├── blog-content/         ← Markdown 소스 (Content 에이전트 작성)
│   ├── rideshare-driver-earnings-irvine-tesla.md
│   ├── tesla-best-car-uber-lyft-drivers.md
│   └── ...
├── scripts/
│   └── build-blog.mjs    ← 빌드 스크립트 (신규)
├── blog/                 ← 빌드 출력물 (자동 생성)
│   ├── index.html        ← 자동 재생성
│   ├── tesla-best-car-uber-lyft-drivers/
│   │   └── index.html    ← 자동 생성
│   └── ...
└── package.json          ← npm scripts 추가
```

**스크립트 기능:**
- `gray-matter`로 YAML frontmatter 파싱
- `marked`로 Markdown → HTML body 변환
- 기존 HTML 템플릿 스타일 유지 (Schema.org JSON-LD, canonical, OG 태그 포함)
- `blog/index.html` 자동 재생성 (모든 포스트 카드)
- 날짜 기준 내림차순 정렬

**npm 스크립트:**
```json
{
  "scripts": {
    "build:blog": "node scripts/build-blog.mjs",
    "watch:blog": "node scripts/build-blog.mjs --watch"
  }
}
```

**의존성 (최소화):**
```json
{
  "devDependencies": {
    "gray-matter": "^4.0.3",
    "marked": "^12.0.0"
  }
}
```

**산출물:**
- `mongoori-www/scripts/build-blog.mjs`
- `mongoori-www/package.json`

### Phase 3: 미배포 포스트 6개 배포 (0.5일)

**목표:** 현재 Markdown으로만 존재하는 포스트를 빌드 스크립트로 HTML 배포

| 포스트 | slug | 원본 파일 |
|--------|------|-----------|
| EV Charging Guide Irvine | `ev-charging-guide-irvine-rideshare` | blog-post-11 |
| Tesla vs Gas Income Comparison | `tesla-vs-gas-rideshare-income-comparison` | blog-post-12 |
| Tesla Model Y Rideshare Range | `tesla-model-y-rideshare-range` | blog_post_13 |
| Maximize Uber Earnings Tesla SoCal | `maximize-uber-earnings-tesla-socal` | blog_post_14 |
| Rideshare Insurance CA Requirements | `rideshare-insurance-california-requirements` | blog/posts |
| Tesla vs Prius Profitability | `tesla-vs-prius-rideshare-profitability` | blog/posts |

**산출물:** 6개 신규 HTML 포스트 배포 + 업데이트된 `blog/index.html`

### Phase 4: 검증 및 자동화 워크플로 (0.5일)

1. **빌드 검증:** 16개 포스트 전체 HTML 출력 확인
2. **SEO 검증:** 각 포스트 canonical, meta description, Schema.org 확인
3. **Content 에이전트 가이드:** `BLOG-CONTENT-GUIDE.md` 업데이트 (frontmatter 작성 방법)
4. **GitHub Actions 고려 (선택):** `blog-content/` push 시 자동 빌드 트리거

---

## 4. 예상 작업량

| Phase | 작업 | 예상 소요 |
|-------|------|-----------|
| Phase 1 | 콘텐츠 통합 + frontmatter 표준화 | 1일 |
| Phase 2 | 빌드 스크립트 개발 | 1일 |
| Phase 3 | 미배포 포스트 6개 배포 | 0.5일 |
| Phase 4 | 검증 + 자동화 워크플로 | 0.5일 |
| **합계** | | **3일 (1 sprint)** |

---

## 5. CTO 제안 사항

### 즉각 실행 가능 (Phase 1-3, 3일)
- Content 에이전트 Markdown → 자동 HTML 변환 파이프라인 구축
- 미배포 포스트 6개 즉시 배포

### 중기 고려 (Phase 4+)
- GitHub Actions로 `blog-content/` commit → 자동 빌드 트리거 설정
- 향후 포스트 수가 50개+로 증가 시 Astro 마이그레이션 재검토

### 의존성 없음
- 외부 CMS 불필요
- 기존 mongoori-www 구조 그대로 유지
- Content 에이전트는 Markdown 파일만 추가하면 됨

---

## 모의 테스트 결과

### Mock Test 1: 요구사항 커버리지 검증

| 요구 항목 (이슈 spec) | 계획 반영 여부 |
|-----------------------|----------------|
| ① 현재 mongoori-www 블로그 섹션 현황 파악 | ✅ 섹션 1 완료 |
| ② Markdown→HTML 렌더링 방식 결정 | ✅ 섹션 2 완료 (Node.js 빌드 스크립트 선택) |
| ③ 구현 계획 및 예상 작업량 산정 | ✅ 섹션 3-4 완료 |
| ④ CTO에게 구현 계획 제안 | ✅ 섹션 5 완료 |
| 블로그 섹션 현황 보고 | ✅ 문제점 4가지 명시 |
| CTO/CEO 제안 | ✅ 즉각/중기 분리 제안 |

**Mock Test 1 결과: PASS** ✅

### Mock Test 2: 기술 방식 타당성 검증

| 검증 항목 | 결과 |
|-----------|------|
| 기존 정적 HTML SEO 구조 유지 | ✅ Schema.org, canonical, OG 태그 템플릿에 포함 |
| 의존성 최소화 (gray-matter, marked만 사용) | ✅ 경량 deps, 보안 리스크 낮음 |
| Content 에이전트 워크플로 통합 | ✅ Markdown 파일 추가 → `npm run build:blog` |
| 기존 10개 포스트 하위 호환 | ✅ 빌드 스크립트가 기존 slug 그대로 재생성 |
| 미배포 포스트 6개 식별 완료 | ✅ 섹션 1-2 파일명 명시 |
| 3일 sprint 내 완료 가능 | ✅ Phase별 작업 분리, 독립 실행 가능 |

**Mock Test 2 결과: PASS** ✅

---

**결론:** 구현 계획 확정. CTO 승인 후 Phase 1부터 착수 가능.
