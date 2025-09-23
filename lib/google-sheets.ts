// Google Sheets integration utility for Hyundai Motor Company spec analysis
export interface HyundaiSpecData {
  // 기본 정보
  name: string
  age: string
  education: string
  phone: string

  // 고등학교 정보 (고졸인 경우)
  schoolType?: string
  gradeAverage?: string
  absences?: string
  earlyLeaves?: string
  tardiness?: string
  results?: string

  // 대학교 정보 (대졸인 경우)
  universityType?: string
  universityName?: string
  major?: string
  gpa?: string
  maxGpa?: string

  // 자격증 정보 (각각 별도 필드)
  technicalMaster?: string // 기술사
  engineer?: string // 기사
  industrialEngineer?: string // 산업기사
  craftsman?: string // 기능사
  masterCraftsman?: string // 기능장

  // 기타 정보
  experience?: string
  languageScore?: string
  awards?: string

  // 메타 정보
  submittedAt: string
}

export async function submitToGoogleSheets(data: HyundaiSpecData) {
  try {
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycby0X9vdcMLvAEbYDeAmtQGxlbp3Veuzq6mKTyKA9nN85-S82_WiyEhbkFdOpsFOGIst/exec"

    console.log("[v0] Submitting to Google Sheets:", data)

    // 사용자가 요청한 구조에 맞춰 데이터 매핑
    const mappedData = {
      // 이름, 나이, 학력, 전화번호
      name: data.name || "",
      age: data.age || "",
      education: data.education || "",
      phone: data.phone || "",

      // 학교유형, 내신등급, 결석, 조퇴, 지각, 결과 (고등학교)
      schoolType: data.schoolType || "",
      gradeAverage: data.gradeAverage || "",
      absences: data.absences || "",
      earlyLeaves: data.earlyLeaves || "",
      tardiness: data.tardiness || "",
      results: data.results || "",

      // 대학유형, 학교명, 전공, 학점, 만점 (대학교)
      universityType: data.universityType || "",
      universityName: data.universityName || "",
      major: data.major || "",
      gpa: data.gpa || "",
      maxGpa: data.maxGpa || "",

      // 기술사, 기사, 산업기사, 기능사, 기능장 (각각 별도)
      technicalMaster: data.technicalMaster && data.technicalMaster !== "없음" ? data.technicalMaster : "",
      engineer: data.engineer && data.engineer !== "없음" ? data.engineer : "",
      industrialEngineer: data.industrialEngineer && data.industrialEngineer !== "없음" ? data.industrialEngineer : "",
      craftsman: data.craftsman && data.craftsman !== "없음" ? data.craftsman : "",
      masterCraftsman: data.masterCraftsman && data.masterCraftsman !== "없음" ? data.masterCraftsman : "",

      // 경력사항, 어학성적, 수상경력
      experience: data.experience && data.experience !== "없음" ? data.experience : "",
      languageScore: data.languageScore && data.languageScore !== "없음" ? data.languageScore : "",
      awards: data.awards && data.awards !== "없음" ? data.awards : "",

      // 제출일시
      submittedAt: new Date().toLocaleString("ko-KR"),
    }

    // URL 파라미터로 데이터 전송 (GET 방식)
    const params = new URLSearchParams()
    Object.entries(mappedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })

    const fullUrl = `${GOOGLE_SCRIPT_URL}?${params.toString()}`
    console.log("[v0] Request URL:", fullUrl)

    const response = await fetch(fullUrl, {
      method: "GET",
      mode: "no-cors",
    })

    console.log("[v0] Google Sheets submission completed")

    return { success: true, message: "데이터가 성공적으로 전송되었습니다." }
  } catch (error) {
    console.error("[v0] Google Sheets 제출 오류:", error)
    throw new Error(`Google Sheets 연동 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}
