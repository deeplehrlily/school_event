# 최종 구글 스프레드시트 연결 가이드

## 1단계: 구글 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트 생성
2. 시트 이름을 **"통합데이터"**로 변경

## 2단계: 헤더 설정 (총 18개 컬럼)
**통합데이터 시트에 다음 헤더를 A1부터 순서대로 입력:**

### 기본 정보 (A1~D1)
- A1: 이름
- B1: 나이  
- C1: 학력
- D1: 전화번호

### 고등학교 정보 (E1~J1) - 고졸인 경우만
- E1: 학교유형
- F1: 내신등급
- G1: 결석
- H1: 조퇴
- I1: 지각
- J1: 결과

### 대학교 정보 (K1~O1) - 대졸인 경우만
- K1: 대학유형
- L1: 학교명
- M1: 전공
- N1: 학점
- O1: 만점

### 자격증 정보 (P1~T1) - 5개 분류만
- P1: 기술사
- Q1: 기사
- R1: 산업기사
- S1: 기능사
- T1: 기능장

### 기타 정보 (U1~X1)
- U1: 경력사항
- V1: 어학성적
- W1: 수상경력
- X1: 제출일시

## 3단계: Google Apps Script 설정
1. 스프레드시트에서 `확장 프로그램` → `Apps Script` 클릭
2. 기본 코드를 삭제하고 다음 코드 입력:

\`\`\`javascript
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const data = requestData.data;
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("통합데이터");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Sheet not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 데이터를 배열로 구성 (헤더 순서와 일치)
    const rowData = [
      // 기본 정보 (A~D)
      data.name || "",
      data.age || "",
      data.education || "",
      data.phone || "",
      
      // 고등학교 정보 (E~J) - 고졸인 경우만
      data.schoolType || "",
      data.gradeAverage || "",
      data.absences || "",
      data.earlyLeaves || "",
      data.tardiness || "",
      data.results || "",
      
      // 대학교 정보 (K~O) - 대졸인 경우만
      data.universityType || "",
      data.universityName || "",
      data.major || "",
      data.gpa || "",
      data.maxGpa || "",
      
      // 자격증 정보 (P~T) - 5개 분류만
      data.technicalMaster || "",    // 기술사
      data.engineer || "",           // 기사
      data.industrialEngineer || "", // 산업기사
      data.craftsman || "",          // 기능사
      data.masterCraftsman || "",    // 기능장
      
      // 기타 정보 (U~X)
      data.experience || "",
      data.languageScore || "",
      data.awards || "",
      new Date(data.submittedAt) || new Date()
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

## 4단계: 웹앱 배포
1. Apps Script에서 `배포` → `새 배포` 클릭
2. 유형을 "웹앱"으로 선택
3. 실행 대상: 나
4. 액세스 권한: 모든 사용자
5. `배포` 클릭하고 웹앱 URL 복사

## 5단계: 환경변수 설정
복사한 웹앱 URL을 `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` 환경변수에 설정하면 완료!

## 데이터 저장 방식
- **모든 4단계 폼 데이터가 하나의 행에 저장됨**
- 학력에 따라 고등학교 또는 대학교 정보만 입력됨
- 자격증은 5개 분류(기술사, 기사, 산업기사, 기능사, 기능장)만 저장
- 총 18개 컬럼으로 깔끔하게 정리됨

이제 완전히 단순화된 시스템으로 모든 데이터가 체계적으로 수집됩니다!
