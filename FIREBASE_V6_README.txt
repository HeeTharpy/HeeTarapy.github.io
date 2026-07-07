희테라피 Firebase V6

수정 내용:
- admin.html에 Firebase SDK 연결 추가
- firebase-config.js에서 window.db 생성
- admin.js를 Firebase 저장 방식으로 재작성
- app.js를 Firebase 실시간 읽기 방식으로 재작성
- localStorage 저장 구조 제거

업로드 후 확인:
1. GitHub Desktop에서 변경 파일 Commit + Push
2. heetherapy.kr/admin.html 접속
3. 로그인
4. 관리사 출근시간 또는 이벤트 문구 수정 후 저장
5. Firebase Realtime Database 데이터 탭에서 managers, site, meta 생성 확인
6. 홈페이지에서 Ctrl+F5 새로고침

Commit Summary 추천:
V6 - Firebase realtime fix
