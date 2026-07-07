희테라피 V5 Firebase 연결 버전

수정 내용:
1. admin.html에 Firebase SDK와 firebase-config.js 연결 추가
2. admin.js를 localStorage 저장 방식에서 Firebase Realtime Database 저장 방식으로 변경
3. app.js를 Firebase Realtime Database 실시간 읽기 방식으로 변경
4. 관리자에서 저장하면 홈페이지에 즉시 반영되도록 변경
5. 처음 로그인 시 Firebase 데이터가 비어 있으면 기본 관리사/기본 정보를 자동 등록

업로드 방법:
- 이 ZIP 안의 파일들을 기존 GitHub 폴더에 덮어쓰기
- GitHub Desktop에서 변경사항 확인
- Commit to main
- Push origin

확인 방법:
1. https://heetherapy.kr/admin.html 접속
2. 로그인
3. 관리사 출근시간 수정 후 저장
4. Firebase 콘솔 > Realtime Database > 데이터 탭에서 managers/site/meta 생성 확인
5. 홈페이지 새로고침 후 출근부 반영 확인
