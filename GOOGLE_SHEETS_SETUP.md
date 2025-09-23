# 구글 스프레드시트 연동 설정 가이드

## 1. 구글 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트 생성
2. 첫 번째 행에 다음 헤더 추가:
   \`\`\`
   timestamp | name | age | education | phone | formType | schoolName | major | graduationDate | gpa | gineungsa | saneopgisa | gisa | gineungjang | gisulsa | experience | languageScore | awards
   \`\`\`

## 2. Google Apps Script 설정
1. 스프레드시트에서 `확장 프로그램` > `Apps Script` 클릭
2. 기본 코드를 다음으로 교체:

\`\`\`javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // 데이터 행 추가
    const row = [
      data.timestamp,
      data.name,
      data.age,
      data.education,
      data.phone,
      data.formType,
      data.additionalData?.schoolName || '',
      data.additionalData?.major || '',
      data.additionalData?.graduationDate || '',
      data.additionalData?.gpa || '',
      data.additionalData?.gineungsa || '',
      data.additionalData?.saneopgisa || '',
      data.additionalData?.gisa || '',
      data.additionalData?.gineungjang || '',
      data.additionalData?.gisulsa || '',
      data.additionalData?.experience || '',
      data.additionalData?.languageScore || '',
      data.additionalData?.awards || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

## 3. 웹앱 배포
1. Apps Script에서 `배포` > `새 배포` 클릭
2. 유형: `웹앱` 선택
3. 실행 대상: 본인 계정
4. 액세스 권한: `모든 사용자` 선택
5. `배포` 클릭하여 웹앱 URL 복사

## 4. 환경 변수 설정
Vercel 프로젝트 설정에서 다음 환경 변수 추가:
\`\`\`
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=복사한_웹앱_URL
\`\`\`

## 주의사항
- Google Apps Script는 CORS를 지원하지 않으므로 `no-cors` 모드 사용
- 응답 확인이 어려우므로 스프레드시트에서 직접 데이터 확인 필요
- 웹앱 URL은 공개되므로 민감한 데이터 처리 시 추가 보안 고려 필요
