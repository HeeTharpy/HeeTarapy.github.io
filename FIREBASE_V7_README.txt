HeeTarapy Firebase V7

수정 내용:
1. admin.html에 Firebase SDK, firebase-config.js, data.js, admin.js 순서로 연결했습니다.
2. firebase-config.js에서 window.db를 생성하도록 수정했습니다.
3. admin.js는 localStorage가 아니라 Firebase Realtime Database에 저장합니다.
4. app.js는 Firebase Realtime Database를 실시간으로 읽어서 홈페이지에 반영합니다.
5. index.html 스크립트는 defer로 바꿔서 HTML 로드 후 실행되게 했습니다.

업로드 방법:
1. 이 ZIP 압축을 풉니다.
2. 안에 있는 파일과 폴더 전체를 GitHub 프로젝트 폴더에 덮어씁니다.
3. GitHub Desktop에서 Summary: V7 - Firebase realtime final
4. Commit to main -> Push origin
5. 2~5분 뒤 Ctrl+F5로 admin.html을 새로고침합니다.
