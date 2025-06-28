# 🤝 멘토-멘티 매칭 플랫폼

> 현대적인 웹 기술을 사용한 멘토와 멘티를 연결하는 완전한 매칭 플랫폼

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/Nohyunseung/lipcoding_Nohhyunseung)

## ✨ 주요 기능

- 🔐 **완전한 인증 시스템**: JWT 기반 회원가입/로그인
- 👤 **프로필 관리**: 이미지 업로드, 기술스택 관리
- 🔍 **멘토 검색**: 실시간 필터링 및 검색
- 💬 **매칭 요청**: 멘토-멘티 간 요청/응답 시스템
- 📱 **반응형 디자인**: 모바일/데스크톱 완벽 대응
- 🎯 **데모 모드**: 오프라인 테스트 지원
- 📚 **API 문서**: Swagger UI 제공

## 🛠 기술 스택

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **API Documentation**: Swagger UI

### Frontend
- **Languages**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Modern CSS (Flexbox, Grid)
- **Icons**: Font Awesome 6
- **Responsive**: Mobile-first design

### DevOps & Tools
- **Package Manager**: npm
- **Development**: Nodemon
- **Environment**: dotenv
- **Version Control**: Git

## 🚀 빠른 시작

### 🎯 방법 1: 완전 자동 설치 및 테스트 (권장)
```bash
# 프로젝트 루트에서
full_test.bat
```
> 의존성 설치부터 서버 시작까지 모든 과정을 자동화합니다.

### ⚡ 방법 2: 원클릭 실행 
```bash
# 프로젝트 루트에서 (의존성이 이미 설치된 경우)
start_all.bat
```

### 🔍 방법 3: 빠른 상태 확인
```bash
# 브라우저에서 바로 테스트
quick_test.bat
```

## 📋 상세 실행 가이드

### 1. 백엔드 서버 시작

PowerShell을 열고 다음 명령어를 순서대로 실행하세요:

```powershell
# 백엔드 디렉토리로 이동
cd "c:\Users\shrlg\OneDrive\Desktop\입코딩\backend"

# 의존성 설치 (처음 한 번만)
npm install

# 서버 시작
npm start
# 또는
node server.js
```

백엔드 서버가 정상적으로 시작되면 다음과 같은 메시지가 출력됩니다:
```
Connected to SQLite database
Server running on port 8080
```

## 2. 프론트엔드 서버 시작

새로운 PowerShell 창을 열고 다음 명령어를 실행하세요:

```powershell
# 프론트엔드 디렉토리로 이동
cd "c:\Users\shrlg\OneDrive\Desktop\입코딩\frontend"

## 🎯 테스트 계정 정보

### 기본 테스트 계정
- **멘토 계정**: `mentor@test.com` / `123456`
  - 이름: 김멘토 (10년 경력 풀스택 개발자)
  - 기술스택: React, Node.js, Python, JavaScript, TypeScript
  
- **멘티 계정**: `mentee@test.com` / `123456`
  - 이름: 이멘티 (프론트엔드 개발 학습자)
  - 기술스택: HTML, CSS, JavaScript

## 🌐 애플리케이션 접속

### 메인 애플리케이션
- **URL**: http://localhost:3000
- 브라우저에서 위 URL로 접속하여 메인 애플리케이션을 사용할 수 있습니다.

### 테스트 도구
- **파일**: `test_app.html` (더블클릭하여 실행)
- 서버 상태 확인 및 빠른 테스트를 수행할 수 있습니다.

### API 문서 (Swagger UI)
- **URL**: http://localhost:8080/swagger-ui
- 백엔드 API 문서를 확인하고 직접 테스트할 수 있습니다.

## 🧪 기능 테스트 순서

1. **로그인 테스트**
   - 테스트 계정으로 로그인 (위의 계정 정보 참고)
   - 데모 계정 정보가 로그인 폼에 표시됩니다

2. **프로필 관리**
   - 로그인 후 프로필 정보 조회/수정
   - 프로필 이미지 업로드 테스트

3. **멘토 목록 조회** (멘티 계정으로 로그인 시)
   - 등록된 멘토 목록 확인
   - 기술스택별 필터링 및 검색 테스트

4. **매칭 요청** (멘티 → 멘토)
   - 멘티 계정으로 멘토에게 매칭 요청 발송
   - 메시지 작성 및 전송

5. **요청 관리**
   - 멘토 계정: 받은 요청 확인 및 승인/거절
   - 멘티 계정: 보낸 요청 상태 확인

## � 프로젝트 구조

```
lipcoding_Nohhyunseung/
├── 📁 backend/                 # 백엔드 서버
│   ├── 📁 database/            # 데이터베이스 설정
│   ├── 📁 routes/              # API 라우트
│   │   ├── auth.js            # 인증 관련 API
│   │   ├── profile.js         # 프로필 관리 API
│   │   ├── mentors.js         # 멘토 목록 API
│   │   └── matchRequests.js   # 매칭 요청 API
│   ├── 📁 utils/              # 유틸리티 함수
│   ├── server.js              # 메인 서버 파일
│   ├── package.json           # 백엔드 의존성
│   └── .env                   # 환경 변수
├── 📁 frontend/               # 프론트엔드
│   ├── 📁 css/               # 스타일시트
│   │   └── styles.css        # 메인 CSS
│   ├── 📁 js/                # JavaScript 모듈
│   │   ├── app.js           # 메인 앱 로직
│   │   ├── auth.js          # 인증 처리
│   │   ├── profile.js       # 프로필 관리
│   │   ├── mentors.js       # 멘토 목록
│   │   ├── requests.js      # 요청 관리
│   │   └── debug.js         # 디버깅 도구
│   ├── index.html           # 메인 HTML
│   └── package.json         # 프론트엔드 의존성
├── 📄 openapi.yaml           # API 문서 스펙
├── 🚀 start_all.bat          # 전체 실행 스크립트
├── 🧪 test_app.html          # 테스트 도구
├── 📤 upload_to_github.bat   # GitHub 업로드 스크립트
└── 📋 README.md              # 프로젝트 문서
```

## 🎯 디버깅 도구

브라우저 개발자 도구 콘솔에서 사용 가능한 디버깅 명령어:

```javascript
// 빠른 로그인
DEBUG.quickLogin('mentor')     // 멘토로 로그인
DEBUG.quickLogin('mentee')     // 멘티로 로그인

// 상태 확인
DEBUG.getCurrentUser()         // 현재 사용자 정보
DEBUG.testNetwork()           // 백엔드 연결 테스트
DEBUG.getStorage()            // 로컬 스토리지 내용

// 문제 해결
DEBUG.resetAuth()             // 로그인 상태 초기화
```

## �🔧 문제 해결

### 백엔드 서버가 시작되지 않는 경우
```powershell
# 의존성 재설치
cd "c:\Users\shrlg\OneDrive\Desktop\입코딩\backend"
npm install
npm start
```

### 프론트엔드 서버가 시작되지 않는 경우
```powershell
# http-server 설치 및 시작
npm install -g http-server
cd "c:\Users\shrlg\OneDrive\Desktop\입코딩\frontend"
http-server . -p 3000 -c-1
```

### 포트 충돌 문제
- 백엔드: 8080 포트
- 프론트엔드: 3000 포트
- 다른 애플리케이션이 해당 포트를 사용 중이라면 다른 포트로 변경하세요.

## 6. 주요 API 엔드포인트

- `POST /api/signup` - 회원가입
- `POST /api/login` - 로그인
- `GET /api/me` - 내 프로필 조회
- `PUT /api/me` - 프로필 수정
- `GET /api/mentors` - 멘토 목록 조회 (멘티만)
- `POST /api/match-requests` - 매칭 요청 생성
- `GET /api/match-requests/incoming` - 받은 요청 조회
- `GET /api/match-requests/outgoing` - 보낸 요청 조회
- `PUT /api/match-requests/:id` - 요청 상태 변경

## 7. 데이터베이스

SQLite 데이터베이스 파일: `backend/database.sqlite`
- 서버 첫 실행 시 자동으로 테이블이 생성됩니다.
- 데이터 초기화가 필요한 경우 해당 파일을 삭제하고 서버를 재시작하세요.

## 🚀 배포

### GitHub Pages (프론트엔드만)
```bash
# GitHub Pages 브랜치 생성
git checkout -b gh-pages
git push origin gh-pages
```

### Heroku (풀스택)
```bash
# Heroku CLI 설치 후
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**노현승 (Nohyunseung)**
- GitHub: [@Nohyunseung](https://github.com/Nohyunseung)
- 프로젝트: [lipcoding_Nohhyunseung](https://github.com/Nohyunseung/lipcoding_Nohhyunseung)

## 🙏 감사의 말

- Font Awesome - 아이콘 제공
- Swagger UI - API 문서화
- Express.js - 백엔드 프레임워크
- 모든 오픈소스 기여자들

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
#   l i p c o d i n g _ N o h h y u n s e u n g 
 
 #   l i p c o d i n g _ N o h h y u n s e u n g  
 #   l i p c o d i n g _ N o h h y u n s e u n g  
 