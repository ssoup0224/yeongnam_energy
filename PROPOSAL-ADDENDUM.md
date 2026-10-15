# Proposal Addendum — Mid-Project Redesign of the Control Site

**Trigger:** Yeongnam Energy redesigned its desktop site during the project.
Observed and measured 2026-10-01 at `https://www.skens.com/pohang/main/index.do`.
Supporting measurements: `NEW-SITE-ANALYSIS.md`.

Items below are written to slot into the existing proposal sections.

---

## 0. The headline: the proposal already predicted this

The PROJECT PREMISE says regional sites "may look dated **or receive partial
visual updates** while essential services remain fragmented," and section 02 is
literally titled "Why this problem remains after a visual update."

That framing was a hypothesis when written. **It is now a documented event.**
This is the single most valuable addition to the proposal: the redesign does not
weaken the project, it validates its premise. Say so explicitly and early.

> Suggested insert, end of PROJECT PREMISE:
> *During the proposal period the provider released a desktop redesign
> (observed 2026-10-01). The redesign changed visual style and expanded the
> menu inventory while leaving the fragmented task structure, the entry-point
> competition, and the core accessibility barriers in place — and introduced a
> new inconsistency between desktop and mobile. The premise of this project is
> therefore no longer hypothetical.*

---

## 1. ADD to §01 — a device axis in Objective 3

Objective 3 currently covers consistency **across regions** only. The redesign
created a second, sharper inconsistency the proposal does not cover: the same
provider now ships different *functions* to different devices.

| Available only on desktop | Available only on mobile |
| --- | --- |
| 간편요금조회 (quick bill lookup) | 안전점검 예약 (inspection booking) |
| 합산요금조회 (aggregated billing) | 온라인 자율점검 (online self-inspection) |
| | 사용자계약서 (user contract) |
| | 계량기교체 예약 (meter replacement) |

The business lineup disagrees too: desktop dropped 신재생에너지 and added
사회공헌; the mobile homepage still lists 신재생에너지.

> Suggested revision to Objective 3:
> *Create a responsive structure that preserves local details while keeping
> functions, terminology, and status patterns consistent **across regions and
> across devices**, so that a task discovered on one device can be completed on
> another.*

Also add to **Design problem** in §01: *the provider currently maintains two
separate front-ends (`/pohang/...` and `/m/kr/pohang/...`) whose feature sets
have diverged in both directions.*

---

## 2. ADD to §02 — a dated evidence subsection

Replace hypothesis language with these measured values. All captured
2026-10-01, desktop at 1440×900 and mobile at 375×812.

### Still failing after the redesign

| Finding | Measurement |
| --- | --- |
| Entry-point competition **worsened** | Modal `.popupWrap` retained, **plus** a top KakaoTalk banner and a bottom safety banner — three overlays before any content |
| **No site search exists** | 0 search inputs, against a menu inventory of ~50 items |
| Page has no accessible title | 1 `<h1>`, text content empty |
| Target size | 93 of 160 visible controls (**58%**) under 44 px tall — the proposal's own target, and WCAG 2.5.5 (Level AAA) |
| Desktop is not responsive | `<meta name="viewport">` absent; relies on UA redirect |
| **Mobile blocks zoom** | `maximum-scale=1.0` — fails WCAG 1.4.4 (Resize Text) |
| Mobile not updated | Redirects to the 2024-era `/m/kr/` build; footer still reads `COPYRIGHT 2024` |

### Already fixed by the redesign — remove from our claims

Intellectual honesty matters for the audit's credibility. Drop these:

- **Rotating-banner pause control now exists**, with correct alt text
  (`롤링배너 재생` / `롤링배너 정지`). WCAG 2.2.2 is satisfied.
- **All 53 images carry an `alt` attribute.**
- **A skip link (`본문 바로가기`) is present**, so WCAG 2.4.1 Bypass Blocks passes.

Narrow the accessibility claim to target size, empty `h1`, blocked zoom, and
absent search — all still verifiable.

---

## 3. ADD to §02 Benchmark — an internal benchmark axis

The comparative scope is currently Pohang vs. Gumi vs. Seoul City Gas, i.e.
*between providers*. Add a **within-provider, cross-device** comparison:
Yeongnam Pohang desktop vs. Yeongnam Pohang mobile.

This is the cheapest and most defensible benchmark available — same company,
same customers, same tasks, measurably different capability — and no other team
is likely to have it.

Note also that the redesign **raises the visual floor**: an argument based on
"the site looks dated" is now weak. The benchmark must be framed around task
structure, step count, and continuity, not appearance.

---

## 4. ADD to §04 — baseline versioning (methodological necessity)

The within-subjects study compares "the current website" against the prototype.
**"Current" is now ambiguous and unstable.** This must be resolved in writing
or the comparison is not reproducible.

> Suggested insert under Study design:
> *Control condition. The control interface is a live third-party site that
> changed once during the project and may change again. The control is
> therefore defined as a **dated capture** of the service as users encounter it
> on 2026-10-01: the redesigned desktop build at `/pohang/...` and the
> unchanged mobile build at `/m/kr/pohang/...`. Screenshots and saved pages are
> archived before testing begins, and all participants see the same captured
> version. Any further provider change during the test window is logged as a
> deviation and excluded from the paired analysis.*

Add to the **Analysis plan** a threat-to-validity line: *the control interface
is not under the team's control; mid-study change is a known confound,
mitigated by a frozen capture.*

---

## 5. ADD to §04 — one new test task, one sharpened task

**New task 6 (cross-device continuity).**
> *On the phone, find the online self-inspection service and note what it asks
> for. Then, on the laptop, continue the same task.*

On the current service this task **cannot be completed** — the feature does not
exist on desktop. That is a clean, non-subjective failure the prototype fixes
by construction. It directly measures the objective added in §1.

**Sharpen task 3.** It currently ends "locate one relevant energy-saving or
local support item," which is vague to score. The redesign added a concrete
target: *다자녀 경감신청 / 요금경감 제도*. Rewrite as:
> *…and find out whether a household with three children can reduce this bill,
> and what that requires.*

---

## 6. ADD to §03 — three service-model consequences

1. **Non-member lookup must be a first-class path, not a fallback.**
   The provider introduced 간편요금조회 (lookup with no login) at the same time
   as its membership system. That is a strong signal that login friction is
   real for this user base. The proposal's account-centered dashboard should
   state explicitly how a non-member reaches a bill in one step, otherwise the
   redesign is less usable than the control for the most common task.

2. **합산요금조회 is a partial precedent for the deferred management-fee work.**
   §01 defers apartment-management-fee integration as "a future data
   connection." The provider has now shipped multi-account aggregated billing
   itself. Cite it: the deferred scope is validated as a real need, and there is
   an existing interaction model to compare against.

3. **이사날 체크포인트 is convergent validation.**
   The provider independently added a *situation-named* guide ("moving day
   checkpoint") rather than a menu-named one. This is the same move the
   proposal argues for in its Priority task flows. Cite it as external
   evidence that situation-based entry is the correct direction — then show
   the prototype extends it to the other four priority flows, which the
   provider did not.

---

## 7. ADD to §01 scope — newly shipped services to absorb

The task inventory predates these. Add them, or state why each is out of scope:

간편요금조회 · 합산요금조회 · 요금경감 제도 / 다자녀 경감신청 ·
보일러 서류접수 · 명의변경 · 공급중지·재공급 요청 · 온라인 자율점검 ·
계량기교체 예약 · 사용자계약서 · 열량계수 조회 · 자료실 · 이사날 체크포인트

---

## 8. ADD to §06 References

Cite the two front-ends as distinct artifacts with capture dates:

- Yeongnam Energy Service (Pohang), desktop build — `https://www.skens.com/pohang/main/index.do` (captured 2026-10-01)
- Yeongnam Energy Service (Pohang), mobile build — `https://www.skens.com/m/kr/pohang/main/index.do` (captured 2026-10-01)

Cite WCAG 2.2 success criteria by number:

- Failing on the control: **1.4.4 Resize Text** (AA, mobile zoom blocked),
  **2.5.5 Target Size (Enhanced)** (AAA, 44 px).
- Passing on the control, so do not claim them as improvements:
  **2.2.2 Pause, Stop, Hide** and **2.4.1 Bypass Blocks**.

Be precise about levels: the AA target-size criterion (2.5.8) is only 24 px.
The 44 px standard is the proposal's own design target plus 2.5.5 (AAA); state
it that way so a reviewer cannot dismiss it as overstated.

---

## 9. One line for §05 Schedule

Add to the Week 7 decision gate: *the task inventory freeze must account for
services added by the provider's 2026-10 redesign; re-audit before freezing.*
