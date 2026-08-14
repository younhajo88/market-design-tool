# Market Design Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vercel-deployable web app that lets fruit sellers upload a photo, position and scale it in a fixed 1000 x 1000 template, add three fixed-style Korean promo text lines, and export a high-quality `.webp` image.

**Architecture:** Use a Vite + React + TypeScript single-page app. Keep canvas math and export behavior in testable pure modules, while React components handle upload, form state, pointer gestures, and responsive layout. Export always renders from the decoded source image into a fresh 1000 x 1000 canvas with high-quality smoothing.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, HTML Canvas API, CSS modules or plain CSS.

## Global Constraints

- Output file must always be WebP with `.webp` extension.
- Final export canvas must always be exactly 1000 x 1000 pixels.
- WebP export quality must be `0.98`.
- Uploaded images must be kept as decoded source image objects and must not be re-saved as intermediate compressed or resized assets.
- Preview may be visually scaled by CSS, but all edit math must use the 1000 x 1000 design coordinate system.
- Image smoothing must use `imageSmoothingEnabled = true` and `imageSmoothingQuality = 'high'`.
- Minimum image scale must never allow transparent/empty gaps inside the 1000 x 1000 output area.
- Text style is fixed; users can edit only title, subtitle, and footer copy.
- First screen must be the actual editor, not a landing page.
- App must be usable on PC and mobile browsers and deployable to Vercel as a static app.

---

## File Structure

- Create `package.json`: scripts, dependencies, dev dependencies.
- Create `index.html`: Vite root HTML.
- Create `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: TypeScript and test configuration.
- Create `src/main.tsx`: React app bootstrap.
- Create `src/App.tsx`: top-level editor state and layout composition.
- Create `src/styles.css`: responsive editor styling.
- Create `src/types.ts`: shared `PromoText`, `ImageTransform`, and export types.
- Create `src/canvas/constants.ts`: fixed canvas size, defaults, colors, export quality.
- Create `src/canvas/geometry.ts`: cover-fit, scale clamping, display-to-design coordinate mapping.
- Create `src/canvas/renderPromo.ts`: draw source image and fixed text template into a canvas context.
- Create `src/canvas/exportWebp.ts`: render to a fresh 1000 x 1000 canvas, create WebP blob and filename.
- Create `src/components/ImageUploader.tsx`: file input and desktop drag-and-drop.
- Create `src/components/PromoCanvas.tsx`: responsive canvas preview and pointer drag handling.
- Create `src/components/TextControls.tsx`: three fixed text inputs.
- Create `src/components/TransformControls.tsx`: scale slider.
- Create `src/components/ExportActions.tsx`: download and optional share actions.
- Create `src/test/canvasMock.ts`: canvas test helpers.
- Create `src/canvas/geometry.test.ts`: geometry tests.
- Create `src/canvas/exportWebp.test.ts`: export behavior tests.
- Create `src/App.test.tsx`: basic workflow/state tests.

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/types.ts`
- Create: `src/canvas/constants.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `PromoText`, `ImageTransform`, `CANVAS_SIZE`, `WEBP_QUALITY`, `DEFAULT_TEXT`, and the initial React app shell.

- [ ] **Step 1: Write the failing smoke test**

```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the editor as the first screen', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '홍보이미지디자인툴' })).toBeInTheDocument();
    expect(screen.getByLabelText('타이틀')).toHaveValue('상품명');
    expect(screen.getByLabelText('서브타이틀')).toHaveValue('수량 또는 그람 및 가격');
    expect(screen.getByLabelText('하단 타이틀')).toHaveValue('예약후 당일수령');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because project dependencies and app files are not installed or not implemented yet.

- [ ] **Step 3: Add scaffold and minimal app**

Create `package.json`:

```json
{
  "name": "market-design-tool",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.5",
    "typescript": "^5.7.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "jsdom": "^25.0.1",
    "vitest": "^2.1.8"
  }
}
```

Create `src/types.ts`:

```ts
export type PromoText = {
  title: string;
  subtitle: string;
  footer: string;
};

export type ImageTransform = {
  x: number;
  y: number;
  scale: number;
};

export type ExportResult = {
  blob: Blob;
  fileName: string;
  mimeType: 'image/webp';
};
```

Create `src/canvas/constants.ts`:

```ts
import type { PromoText } from '../types';

export const CANVAS_SIZE = 1000;
export const WEBP_QUALITY = 0.98;
export const DEFAULT_TEXT: PromoText = {
  title: '상품명',
  subtitle: '수량 또는 그람 및 가격',
  footer: '예약후 당일수령',
};
export const TEMPLATE_BLUE = '#17207a';
export const TEMPLATE_WHITE = '#ffffff';
export const TEMPLATE_SHADOW = 'rgba(0, 0, 0, 0.95)';
```

Create the minimal React app with labels matching the test.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json index.html tsconfig.json tsconfig.node.json vite.config.ts src
git commit -m "feat: scaffold promo editor app"
```

### Task 2: Canvas Geometry

**Files:**
- Create: `src/canvas/geometry.ts`
- Test: `src/canvas/geometry.test.ts`

**Interfaces:**
- Consumes: `CANVAS_SIZE` from `src/canvas/constants.ts`.
- Produces:
  - `type SourceImageSize = { width: number; height: number }`
  - `type DisplayRect = { width: number; height: number }`
  - `getCoverScale(source: SourceImageSize, targetSize?: number): number`
  - `getMinimumCoverScale(source: SourceImageSize, targetSize?: number): number`
  - `clampScale(scale: number, source: SourceImageSize, targetSize?: number): number`
  - `getInitialTransform(source: SourceImageSize, targetSize?: number): ImageTransform`
  - `displayDeltaToDesignDelta(deltaX: number, deltaY: number, display: DisplayRect, targetSize?: number): { x: number; y: number }`

- [ ] **Step 1: Write failing geometry tests**

```ts
import { describe, expect, it } from 'vitest';
import {
  clampScale,
  displayDeltaToDesignDelta,
  getCoverScale,
  getInitialTransform,
} from './geometry';

describe('canvas geometry', () => {
  it('calculates cover scale for portrait photos', () => {
    expect(getCoverScale({ width: 2000, height: 4000 })).toBe(0.5);
  });

  it('centers the source image at cover scale', () => {
    expect(getInitialTransform({ width: 2000, height: 4000 })).toEqual({
      x: 0,
      y: -500,
      scale: 0.5,
    });
  });

  it('does not allow scale below the cover minimum', () => {
    expect(clampScale(0.1, { width: 2000, height: 4000 })).toBe(0.5);
  });

  it('maps displayed pointer movement to design-space movement', () => {
    expect(displayDeltaToDesignDelta(50, -25, { width: 500, height: 500 })).toEqual({
      x: 100,
      y: -50,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/canvas/geometry.test.ts`

Expected: FAIL because `geometry.ts` does not exist.

- [ ] **Step 3: Implement geometry**

```ts
import { CANVAS_SIZE } from './constants';
import type { ImageTransform } from '../types';

export type SourceImageSize = { width: number; height: number };
export type DisplayRect = { width: number; height: number };

export function getCoverScale(source: SourceImageSize, targetSize = CANVAS_SIZE): number {
  return Math.max(targetSize / source.width, targetSize / source.height);
}

export function getMinimumCoverScale(source: SourceImageSize, targetSize = CANVAS_SIZE): number {
  return getCoverScale(source, targetSize);
}

export function clampScale(scale: number, source: SourceImageSize, targetSize = CANVAS_SIZE): number {
  return Math.max(scale, getMinimumCoverScale(source, targetSize));
}

export function getInitialTransform(source: SourceImageSize, targetSize = CANVAS_SIZE): ImageTransform {
  const scale = getCoverScale(source, targetSize);
  return {
    x: (targetSize - source.width * scale) / 2,
    y: (targetSize - source.height * scale) / 2,
    scale,
  };
}

export function displayDeltaToDesignDelta(
  deltaX: number,
  deltaY: number,
  display: DisplayRect,
  targetSize = CANVAS_SIZE,
): { x: number; y: number } {
  return {
    x: deltaX * (targetSize / display.width),
    y: deltaY * (targetSize / display.height),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/canvas/geometry.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/canvas/geometry.ts src/canvas/geometry.test.ts
git commit -m "feat: add canvas geometry helpers"
```

### Task 3: Canvas Rendering And WebP Export

**Files:**
- Create: `src/canvas/renderPromo.ts`
- Create: `src/canvas/exportWebp.ts`
- Create: `src/test/canvasMock.ts`
- Test: `src/canvas/exportWebp.test.ts`

**Interfaces:**
- Consumes: `PromoText`, `ImageTransform`, `CANVAS_SIZE`, `WEBP_QUALITY`.
- Produces:
  - `renderPromo(ctx: CanvasRenderingContext2D, source: CanvasImageSource, text: PromoText, transform: ImageTransform): void`
  - `exportWebp(source: CanvasImageSource, text: PromoText, transform: ImageTransform, now?: Date): Promise<ExportResult>`
  - `formatExportFileName(now: Date): string`

- [ ] **Step 1: Write failing export tests**

```ts
import { describe, expect, it, vi } from 'vitest';
import { exportWebp, formatExportFileName } from './exportWebp';
import { DEFAULT_TEXT } from './constants';
import { installCanvasMock } from '../test/canvasMock';

describe('WebP export', () => {
  it('creates a timestamped webp filename', () => {
    expect(formatExportFileName(new Date('2026-08-14T09:08:07'))).toBe(
      'market-design-20260814-090807.webp',
    );
  });

  it('renders to a 1000 x 1000 high-quality webp canvas', async () => {
    const mock = installCanvasMock();
    const source = new Image();

    const result = await exportWebp(source, DEFAULT_TEXT, { x: 0, y: 0, scale: 1 }, new Date('2026-08-14T09:08:07'));

    expect(mock.canvas.width).toBe(1000);
    expect(mock.canvas.height).toBe(1000);
    expect(mock.context.imageSmoothingEnabled).toBe(true);
    expect(mock.context.imageSmoothingQuality).toBe('high');
    expect(mock.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.98);
    expect(result.mimeType).toBe('image/webp');
    expect(result.fileName).toBe('market-design-20260814-090807.webp');
  });

  it('rejects when the browser cannot create a webp blob', async () => {
    installCanvasMock({ blob: null });

    await expect(
      exportWebp(new Image(), DEFAULT_TEXT, { x: 0, y: 0, scale: 1 }),
    ).rejects.toThrow('WEBP_EXPORT_FAILED');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/canvas/exportWebp.test.ts`

Expected: FAIL because export modules do not exist.

- [ ] **Step 3: Implement render and export**

Implement `renderPromo` so it clears the canvas, draws the source image with `transform`, then draws fixed text lines with `ctx.strokeText` followed by `ctx.fillText`. Use a bold Korean-friendly font stack:

```ts
const FONT_FAMILY = '"Arial Black", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
```

Implement `exportWebp` with:

```ts
const canvas = document.createElement('canvas');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('CANVAS_CONTEXT_UNAVAILABLE');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
renderPromo(ctx, source, text, transform);
```

Then call `canvas.toBlob(callback, 'image/webp', WEBP_QUALITY)` and reject with `WEBP_EXPORT_FAILED` if the blob is null.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/canvas/exportWebp.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/canvas/renderPromo.ts src/canvas/exportWebp.ts src/test/canvasMock.ts src/canvas/exportWebp.test.ts
git commit -m "feat: export high quality webp promos"
```

### Task 4: Editor Interaction Components

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/ImageUploader.tsx`
- Create: `src/components/PromoCanvas.tsx`
- Create: `src/components/TextControls.tsx`
- Create: `src/components/TransformControls.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `getInitialTransform`, `clampScale`, `displayDeltaToDesignDelta`, `renderPromo`.
- Produces: a working editor that can load an image, edit text, drag image position, and clamp scale.

- [ ] **Step 1: Extend failing app tests**

Add tests that:

```tsx
it('updates promo text inputs', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.clear(screen.getByLabelText('타이틀'));
  await user.type(screen.getByLabelText('타이틀'), '델몬트 바나나');

  expect(screen.getByLabelText('타이틀')).toHaveValue('델몬트 바나나');
});
```

Also add a file upload test that uploads a fake image file and expects a low-resolution warning when the decoded image size is below 1000 x 1000.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because interactive components are not implemented.

- [ ] **Step 3: Implement components**

Requirements:

- `ImageUploader` accepts `onImageLoaded(image: HTMLImageElement): void` and `onError(message: string): void`.
- It rejects non-image files with `이미지 파일만 업로드할 수 있습니다.`
- It supports `onDrop`, `onDragOver`, and file input selection.
- `PromoCanvas` renders a `<canvas>` and listens to pointer events.
- `PromoCanvas` converts displayed pointer delta to design-space delta using `displayDeltaToDesignDelta`.
- `TransformControls` uses `min={minimumScale}`, `max={minimumScale * 3}`, and `step={0.01}`.
- `TextControls` exposes three controlled fields labelled `타이틀`, `서브타이틀`, and `하단 타이틀`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components src/App.test.tsx
git commit -m "feat: add promo editor interactions"
```

### Task 5: Download, Share, Styling, And Vercel Readiness

**Files:**
- Create: `src/components/ExportActions.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `.gitignore`
- Create: `README.md`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `exportWebp`.
- Produces: `downloadBlob(blob: Blob, fileName: string): void`, optional Web Share support, responsive finished UI, and build-ready documentation.

- [ ] **Step 1: Write failing export action tests**

Add an app test that loads a mock source image, clicks `WebP 저장`, and expects `exportWebp` to be called. If mocking module imports is too brittle, test `ExportActions` directly with an injected `onExport` prop.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because export actions are not wired.

- [ ] **Step 3: Implement export actions and final UI**

Requirements:

- Primary button text: `WebP 저장`.
- Disabled export state until an image is loaded.
- Download uses an object URL and revokes it after clicking.
- Share button appears only when `navigator.canShare` and `navigator.share` support a WebP `File`.
- Error copy for export failure: `이미지 저장에 실패했습니다. 브라우저를 업데이트하거나 다른 브라우저에서 다시 시도해주세요.`
- Styling must be responsive, dense, and tool-focused: no landing hero, no decorative card nesting, no one-note purple/blue palette.
- Preview canvas must have stable square dimensions with `aspect-ratio: 1 / 1` and scale down on mobile.

- [ ] **Step 4: Run all automated checks**

Run:

```bash
npm test -- --run
npm run build
```

Expected: all tests pass and production build completes.

- [ ] **Step 5: Manual browser verification**

Run: `npm run dev -- --host 127.0.0.1`

Verify in a desktop browser:

- Upload image by file picker.
- Upload image by drag-and-drop.
- Drag image inside preview.
- Scale image with slider.
- Edit all three text fields.
- Save and confirm downloaded file ends in `.webp`.

Verify mobile viewport:

- Controls stack below preview.
- File input is usable.
- Touch drag moves image without page scroll fighting the canvas.
- Text does not overlap controls.

- [ ] **Step 6: Commit**

```bash
git add src .gitignore README.md
git commit -m "feat: finish webp promo editor"
```

### Task 6: Push To GitHub And Prepare Vercel

**Files:**
- No source changes expected unless verification finds a defect.

**Interfaces:**
- Consumes: clean git history from previous tasks.
- Produces: code pushed to `origin` and ready for Vercel import.

- [ ] **Step 1: Verify remote**

Run: `git remote -v`

Expected: fetch and push remotes are `https://github.com/younhajo88/market-design-tool.git`.

- [ ] **Step 2: Push branch**

Run: `git push -u origin master`

Expected: branch is pushed to GitHub. If GitHub requires `main`, rename with `git branch -M main` and push `main`.

- [ ] **Step 3: Vercel settings**

In Vercel, import `younhajo88/market-design-tool` with:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

- [ ] **Step 4: Final verification after deployment**

Open the Vercel URL on PC and mobile. Confirm upload, drag, scale, text edit, and `.webp` save.

## Self-Review

- Spec coverage: upload, desktop drag-and-drop, mobile file selection, 1000 x 1000 editing, drag positioning, scale slider, fixed text template, WebP-only export, high-quality rendering, low-resolution warning, Vercel readiness, and GitHub remote are all covered.
- Incomplete-marker scan: no incomplete marker instructions are present.
- Type consistency: `PromoText`, `ImageTransform`, `ExportResult`, `renderPromo`, and `exportWebp` signatures are defined before use and reused consistently.
