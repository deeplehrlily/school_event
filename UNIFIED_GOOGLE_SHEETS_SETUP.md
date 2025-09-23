# 통합 구글 스프레드시트 설정 가이드

## 1단계: 구글 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트 생성
2. 시트 이름을 "통합데이터"로 변경

## 2단계: 헤더 설정
**통합데이터 시트에 다음 헤더를 A1부터 순서대로 입력:**

### 기본 정보 (A1~D1)
- A1: 이름
- B1: 나이  
- C1: 학력
- D1: 전화번호

### 고등학교 정보 (E1~J1) - 고졸인 경우만 해당
- E1: 학교유형
- F1: 내신등급
- G1: 결석
- H1: 조퇴
- I1: 지각
- J1: 결과

### 대학교 정보 (K1~O1) - 대졸인 경우만 해당
- K1: 대학유형
- L1: 학교명
- M1: 전공
- N1: 학점
- O1: 만점

### 자격증 및 기타 정보 (P1~Z1, AA1~AB1)
- P1: 기술사기능장
- Q1: 기사산업기사
- R1: 기능사
- S1: 국가공인민간자격
- T1: 국제자격증
- U1: 어학관련
- V1: 컴퓨터활용능력
- W1: 기타자격증
- X1: 경력사항
- Y1: 어학성적
- Z1: 수상경력

### 메타 정보 (AA1)
- AA1: 제출일시

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
      // 기본 정보
      data.name || "",
      data.age || "",
      data.education || "",
      data.phone || "",
      
      // 고등학교 정보 (고졸인 경우만)
      data.schoolType || "",
      data.gradeAverage || "",
      data.absences || "",
      data.earlyLeaves || "",
      data.tardiness || "",
      data.results || "",
      
      // 대학교 정보 (대졸인 경우만)
      data.universityType || "",
      data.universityName || "",
      data.major || "",
      data.gpa || "",
      data.maxGpa || "",
      
      // 자격증 및 기타 정보
      data.technicalCerts || "",
      data.professionalCerts || "",
      data.skillCerts || "",
      data.publicCerts || "",
      data.internationalCerts || "",
      data.languageCerts || "",
      data.computerCerts || "",
      data.otherCerts || "",
      data.experience || "",
      data.languageScore || "",
      data.awards || "",
      
      // 메타 정보
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
복사한 웹앱 URL을 `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` 환경변수에 설정하면 완료됩니다.

## 데이터 구조 설명
- **기본 정보**: 모든 사용자 공통
- **고등학교 정보**: 학력이 "고졸"인 경우만 입력됨
- **대학교 정보**: 학력이 "초대졸" 또는 "대졸"인 경우만 입력됨
- **자격증 정보**: 선택된 자격증들이 쉼표로 구분되어 저장됨
- **기타 정보**: 경력, 어학성적, 수상경력 등

이제 모든 4단계 폼의 데이터가 하나의 "통합데이터" 시트에 체계적으로 저장됩니다!
