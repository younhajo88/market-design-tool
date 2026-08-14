# 홍보이미지디자인툴

과일 사진을 업로드하고 고정 템플릿 문구를 얹어 1000 x 1000 홍보 이미지를 만드는 웹앱입니다.

## 기능

- PC 파일 선택 및 드래그앤드롭 업로드
- 모바일 파일 선택 업로드
- 1000 x 1000 고정 편집 영역
- 사진 드래그 위치 조정
- 사진 확대/축소 슬라이더
- 고정 스타일 문구 3종 입력
- JPG, WebP, PNG 확장자 선택 저장
- 지원 브라우저에서 모바일 공유

## 개발

```bash
npm install
npm run dev
```

## 검증

```bash
npm test -- --run
npm run build
```

## Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
