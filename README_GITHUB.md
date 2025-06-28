# 🤝 멘토-멘티 매칭 플랫폼

> 현대적인 웹 기술을 사용한 멘토와 멘티를 연결하는 풀스택 플랫폼

![Platform Preview](https://img.shields.io/badge/Platform-Web-blue)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-SQLite-lightgrey)

## 📋 프로젝트 소개

멘토와 멘티를 매칭해주는 웹 플랫폼입니다. 실무 경험이 풍부한 멘토와 배우고자 하는 멘티를 연결하여 지식 공유와 성장을 도모합니다.

### 🎯 주요 기능

- **👤 사용자 인증**: JWT 기반 로그인/회원가입
- **📝 프로필 관리**: 개인 정보, 기술 스택, 프로필 이미지 관리
- **🔍 멘토 검색**: 기술 스택별 멘토 필터링 및 검색
- **💌 매칭 요청**: 멘티에서 멘토로 매칭 요청 발송
- **📊 요청 관리**: 받은/보낸 요청 상태 관리 및 응답
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

### 🛠️ 기술 스택

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Font Awesome Icons
- Responsive Design

**Backend:**
- Node.js & Express.js
- SQLite Database
- JWT Authentication
- bcryptjs for password hashing
- Multer for file uploads

**API & Documentation:**
- RESTful API
- Swagger/OpenAPI Documentation
- CORS enabled

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

### 🔧 수동 설치

#### 1. 저장소 클론
```bash
git clone https://github.com/YOUR_USERNAME/mentor-mentee-platform.git
cd mentor-mentee-platform
```

#### 2. 백엔드 설정
```bash
cd backend
npm install
npm start
```

#### 3. 프론트엔드 설정
```bash
cd frontend
npm install
npm start
# 또는
python -m http.server 3000
```

## 🎯 테스트 계정

### 기본 테스트 계정
- **멘토 계정**: `mentor@test.com` / `123456`
  - 이름: 김멘토 (10년 경력 풀스택 개발자)
  - 기술스택: React, Node.js, Python, JavaScript, TypeScript
  
- **멘티 계정**: `mentee@test.com` / `123456`
  - 이름: 이멘티 (프론트엔드 개발 학습자)
  - 기술스택: HTML, CSS, JavaScript

## 🌐 접속 정보

- **메인 애플리케이션**: http://localhost:3000
- **API 문서 (Swagger)**: http://localhost:8080/swagger-ui
- **백엔드 서버**: http://localhost:8080
- **테스트 도구**: `test_app.html` (더블클릭)

## 🧪 기능 테스트 순서

1. **로그인/회원가입** - 테스트 계정 또는 새 계정 생성
2. **프로필 관리** - 개인 정보 수정 및 프로필 이미지 업로드
3. **멘토 검색** - 기술스택별 필터링 및 검색 (멘티 계정)
4. **매칭 요청** - 멘토에게 매칭 요청 발송
5. **요청 관리** - 받은/보낸 요청 확인 및 처리

## 📂 프로젝트 구조

```
mentor-mentee-platform/
├── backend/                 # 백엔드 서버
│   ├── routes/             # API 라우트
│   ├── database/           # 데이터베이스 설정
│   ├── utils/              # 유틸리티 함수
│   ├── server.js           # 메인 서버 파일
│   └── package.json
├── frontend/               # 프론트엔드
│   ├── css/               # 스타일시트
│   ├── js/                # JavaScript 모듈
│   ├── index.html         # 메인 HTML
│   └── package.json
├── test_app.html          # 테스트 도구
├── setup_github.bat       # GitHub 설정 스크립트
└── README.md
```

## 🔧 문제 해결

### 자주 발생하는 문제들

**포트 충돌**
```bash
# 포트 사용 확인
netstat -ano | findstr :8080
netstat -ano | findstr :3000
```

**의존성 문제**
```bash
# 백엔드 의존성 재설치
cd backend
rm -rf node_modules
npm install

# 프론트엔드 의존성 재설치
cd frontend
rm -rf node_modules
npm install
```

**CORS 에러**
- 백엔드 서버가 실행 중인지 확인
- 브라우저에서 http://localhost:8080/api/health 접속 테스트

## 🛡️ 보안 고려사항

- JWT 토큰 기반 인증
- 비밀번호 해싱 (bcryptjs)
- Rate Limiting 적용
- CORS 정책 설정
- 파일 업로드 제한 (크기, 형식)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
