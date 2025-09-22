"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface CertificationData {
  gineungsa: string[]
  saneopgisa: string[]
  gisa: string[]
  gineungjang: string[]
  gisulsa: string[]
  experience: string
  languageScore: string
  awards: string
}

const certificationOptions = {
  gineungsa: [
    "전기",
    "전자",
    "컴퓨터응용가공",
    "컴퓨터응용밀링",
    "위험물",
    "자동차정비",
    "가스",
    "환경",
    "산업안전",
    "건축",
    "토목",
    "조경",
    "화공",
    "금형",
    "용접",
    "기계가공",
    "선반",
    "밀링",
    "연삭",
    "보일러",
    "냉동공조",
    "건설기계정비",
    "자동차차체수리",
    "도장",
    "배관",
    "건축목공",
    "건축도장",
    "타일",
    "방수",
    "조적",
    "철근",
    "거푸집",
    "미장",
    "한식조리",
    "양식조리",
    "중식조리",
    "일식조리",
    "제과",
    "제빵",
    "바리스타",
    "조경",
    "화훼장식",
    "산림",
    "임업종묘",
    "측량",
    "지적",
    "농기계정비",
    "축산",
    "원예",
    "농산물품질관리",
    "종자",
    "화학분석",
    "금속재료시험",
    "비파괴검사",
    "품질경영",
    "에너지관리",
    "소방설비",
    "전기공사",
    "정보처리",
    "웹디자인",
    "컴퓨터그래픽스",
    "사진",
    "인쇄",
    "제본",
    "광고도장",
    "간판",
    "섬유",
    "의복",
    "양장",
    "한복",
    "편물",
    "자수",
    "염색",
    "피혁",
    "신발",
    "가구",
    "목재가공",
    "악기",
    "귀금속가공",
    "시계",
    "안경",
    "이용",
    "미용",
    "네일아트",
    "피부미용",
    "반려동물관리",
    "수산양식",
    "어로",
    "수산물가공",
    "항해",
    "기관",
    "통신",
    "전파전자",
    "항공",
    "철도",
    "자동차운전",
    "지게차운전",
    "크레인운전",
    "굴삭기운전",
    "로더운전",
    "불도저운전",
    "모터그레이더운전",
    "롤러운전",
    "아스팔트살포기운전",
    "콘크리트믹서트럭운전",
    "콘크리트펌프카운전",
    "타워크레인",
    "천장크레인",
    "컨베이어",
    "승강기",
    "삭도",
    "궤도장비정비",
    "철도차량정비",
    "항공정비",
    "선박정비",
    "잠수",
    "해양플랜트설치",
    "해양자원개발",
    "해양환경",
    "수중용접",
    "수중절단",
  ],
  saneopgisa: [
    "전기",
    "전자",
    "정보처리",
    "컴퓨터시스템응용",
    "통신",
    "방송통신",
    "전파전자",
    "제어계측",
    "로봇",
    "메카트로닉스",
    "기계",
    "기계설계",
    "자동차",
    "조선",
    "항공",
    "건축",
    "건축설비",
    "토목",
    "교통",
    "측량및지형공간정보",
    "지적",
    "건설안전",
    "소방설비",
    "가스",
    "에너지관리",
    "환경",
    "대기환경",
    "수질환경",
    "폐기물처리",
    "소음진동",
    "화공",
    "금속재료",
    "세라믹",
    "화학",
    "석유화학",
    "고분자",
    "염색",
    "섬유",
    "의류",
    "식품",
    "농업기계",
    "종자",
    "화훼장식",
    "조경",
    "산림",
    "임업종묘",
    "축산",
    "수산양식",
    "어로",
    "항해",
    "기관",
    "해양환경",
    "해양자원개발",
    "광업",
    "지질및지반",
    "응용지질",
    "품질경영",
    "생산관리",
    "물류관리",
    "유통관리",
    "경영",
    "회계",
    "세무",
    "관광",
    "호텔관리",
    "조리",
    "제과제빵",
    "바리스타",
    "소믈리에",
    "미용",
    "이용",
    "의료기기",
    "임상병리",
    "방사선",
    "물리치료",
    "작업치료",
    "치과기공",
    "치과위생",
    "간호",
    "영양",
    "보건",
    "사회복지",
    "보육",
    "평생교육",
    "직업상담",
    "청소년지도",
    "문화예술교육",
    "학예",
    "기록물관리",
    "사서",
    "출판편집",
    "광고홍보",
    "영상제작",
    "음향",
    "무대예술",
    "의상",
    "분장",
    "헤어",
    "네일아트",
    "피부미용",
    "애완동물미용",
    "반려동물관리",
    "승마",
    "골프",
    "수영",
    "스키",
    "태권도",
    "검도",
    "유도",
    "복싱",
    "레슬링",
    "역도",
    "체조",
    "육상",
    "축구",
    "야구",
    "농구",
    "배구",
    "테니스",
    "탁구",
    "배드민턴",
    "볼링",
    "당구",
    "사격",
    "양궁",
    "펜싱",
    "카누",
    "조정",
    "요트",
    "윈드서핑",
    "스쿠버다이빙",
    "패러글라이딩",
    "행글라이딩",
    "암벽등반",
    "산악",
    "자전거",
    "오토바이",
    "자동차경주",
    "카트",
    "모터보트",
    "제트스키",
  ],
  gisa: [
    "전기",
    "전자",
    "정보처리",
    "컴퓨터시스템응용",
    "통신",
    "방송통신",
    "전파전자",
    "제어계측",
    "로봇",
    "메카트로닉스",
    "기계",
    "기계설계",
    "자동차",
    "조선",
    "항공",
    "건축",
    "건축설비",
    "토목",
    "교통",
    "측량및지형공간정보",
    "지적",
    "건설안전",
    "소방설비",
    "가스",
    "에너지관리",
    "환경",
    "대기환경",
    "수질환경",
    "폐기물처리",
    "소음진동",
    "화공",
    "금속재료",
    "세라믹",
    "화학",
    "석유화학",
    "고분자",
    "염색",
    "섬유",
    "의류",
    "식품",
    "농업기계",
    "종자",
    "화훼장식",
    "조경",
    "산림",
    "임업종묘",
    "축산",
    "수산양식",
    "어로",
    "항해",
    "기관",
    "해양환경",
    "해양자원개발",
    "광업",
    "지질및지반",
    "응용지질",
    "품질경영",
    "생산관리",
    "물류관리",
    "유통관리",
  ],
  gineungjang: [
    "전기",
    "전자",
    "기계",
    "자동차정비",
    "용접",
    "건축",
    "토목",
    "조경",
    "화공",
    "금형",
    "냉동공조",
    "보일러",
    "배관",
    "건축목공",
    "한식조리",
    "양식조리",
    "중식조리",
    "일식조리",
    "제과",
    "제빵",
    "미용",
    "이용",
    "의복",
    "가구",
    "목재가공",
    "인쇄",
    "제본",
    "사진",
    "귀금속가공",
    "시계",
    "안경",
    "피혁",
    "신발",
    "섬유",
    "염색",
    "도장",
    "타일",
    "방수",
    "조적",
    "철근",
    "거푸집",
    "미장",
    "측량",
    "지적",
    "농기계정비",
    "축산",
    "원예",
    "화학분석",
    "금속재료시험",
    "비파괴검사",
    "에너지관리",
    "소방설비",
    "전기공사",
    "정보처리",
    "웹디자인",
    "컴퓨터그래픽스",
  ],
  gisulsa: [
    "전기",
    "전자",
    "정보",
    "통신",
    "기계",
    "자동차",
    "조선",
    "항공",
    "건축",
    "건축설비",
    "토목",
    "교통",
    "측량",
    "지적",
    "건설안전",
    "소방",
    "가스",
    "에너지",
    "환경",
    "대기환경",
    "수질환경",
    "폐기물",
    "소음진동",
    "화공",
    "금속",
    "세라믹",
    "화학",
    "석유화학",
    "고분자",
    "섬유",
    "식품",
    "농업기계",
    "조경",
    "산림",
    "축산",
    "수산",
    "어로",
    "항해",
    "기관",
    "해양",
    "광업",
    "지질",
    "응용지질",
    "품질경영",
    "생산관리",
    "물류관리",
  ],
}

export default function CertificationsPage() {
  const [formData, setFormData] = useState<CertificationData>({
    gineungsa: [],
    saneopgisa: [],
    gisa: [],
    gineungjang: [],
    gisulsa: [],
    experience: "",
    languageScore: "",
    awards: "",
  })

  const handleCertificationToggle = (type: keyof typeof certificationOptions, certification: string) => {
    setFormData((prev) => {
      const currentList = prev[type] as string[]
      const isSelected = currentList.includes(certification)

      return {
        ...prev,
        [type]: isSelected ? currentList.filter((cert) => cert !== certification) : [...currentList, certification],
      }
    })
  }

  const handleInputChange = (field: keyof CertificationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Collect all form data from sessionStorage
    const basicInfo = JSON.parse(sessionStorage.getItem("basicInfo") || "{}")
    const educationInfo = JSON.parse(
      sessionStorage.getItem(basicInfo.education === "고졸" ? "highSchoolInfo" : "universityInfo") || "{}",
    )

    const allData = {
      ...basicInfo,
      ...educationInfo,
      ...formData,
      submittedAt: new Date().toISOString(),
    }

    try {
      // Submit to Netlify Forms
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "hyundai-spec-analysis",
          ...Object.fromEntries(
            Object.entries(allData).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(", ") : String(value),
            ]),
          ),
        }).toString(),
      })

      if (response.ok) {
        // Store data for analysis
        sessionStorage.setItem("certificationInfo", JSON.stringify(formData))
        sessionStorage.setItem("allFormData", JSON.stringify(allData))
        window.location.href = "/analysis/result"
      } else {
        alert("데이터 전송에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("데이터 전송 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Hidden Netlify form */}
        <form name="hyundai-spec-analysis" netlify="true" hidden>
          <input type="text" name="name" />
          <input type="text" name="age" />
          <input type="text" name="education" />
          <input type="text" name="phone" />
          <input type="text" name="gineungsa" />
          <input type="text" name="saneopgisa" />
          <input type="text" name="gisa" />
          <input type="text" name="gineungjang" />
          <input type="text" name="gisulsa" />
          <input type="text" name="experience" />
          <input type="text" name="languageScore" />
          <input type="text" name="awards" />
        </form>

        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">3/4 단계</p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">자격증 및 기타 스펙</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              보유하신 자격증과 기타 스펙을 선택해주세요 (다수선택 가능)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <Label className="text-base font-medium">보유 자격증 (다수선택 가능)</Label>

              {/* 기능사 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">기능사</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.gineungsa.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gineungsa-${cert}`}
                        checked={formData.gineungsa.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("gineungsa", cert)}
                      />
                      <Label htmlFor={`gineungsa-${cert}`} className="text-xs cursor-pointer">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.gineungsa.length > 0 && (
                  <p className="text-xs text-blue-600">선택됨: {formData.gineungsa.join(", ")}</p>
                )}
              </div>

              {/* 산업기사 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">산업기사</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.saneopgisa.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={`saneopgisa-${cert}`}
                        checked={formData.saneopgisa.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("saneopgisa", cert)}
                      />
                      <Label htmlFor={`saneopgisa-${cert}`} className="text-xs cursor-pointer">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.saneopgisa.length > 0 && (
                  <p className="text-xs text-green-600">선택됨: {formData.saneopgisa.join(", ")}</p>
                )}
              </div>

              {/* 기사 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">기사</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.gisa.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gisa-${cert}`}
                        checked={formData.gisa.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("gisa", cert)}
                      />
                      <Label htmlFor={`gisa-${cert}`} className="text-xs cursor-pointer">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.gisa.length > 0 && (
                  <p className="text-xs text-purple-600">선택됨: {formData.gisa.join(", ")}</p>
                )}
              </div>

              {/* 기능장 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">기능장</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.gineungjang.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gineungjang-${cert}`}
                        checked={formData.gineungjang.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("gineungjang", cert)}
                      />
                      <Label htmlFor={`gineungjang-${cert}`} className="text-xs cursor-pointer">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.gineungjang.length > 0 && (
                  <p className="text-xs text-orange-600">선택됨: {formData.gineungjang.join(", ")}</p>
                )}
              </div>

              {/* 기술사 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">기술사</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.gisulsa.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gisulsa-${cert}`}
                        checked={formData.gisulsa.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("gisulsa", cert)}
                      />
                      <Label htmlFor={`gisulsa-${cert}`} className="text-xs cursor-pointer">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.gisulsa.length > 0 && (
                  <p className="text-xs text-red-600">선택됨: {formData.gisulsa.join(", ")}</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">경력 사항</Label>
              <Textarea
                id="experience"
                placeholder="예: 삼성전자 3개월, LG전자 6개월 (없으면 '없음'으로 입력)"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                rows={3}
              />
            </div>

            {/* Language Score */}
            <div className="space-y-2">
              <Label htmlFor="languageScore">어학 성적</Label>
              <Input
                id="languageScore"
                placeholder="예: TOEIC 850, TEPS 600 (없으면 '없음'으로 입력)"
                value={formData.languageScore}
                onChange={(e) => handleInputChange("languageScore", e.target.value)}
              />
            </div>

            {/* Awards */}
            <div className="space-y-2">
              <Label htmlFor="awards">수상 경력</Label>
              <Textarea
                id="awards"
                placeholder="예: 전국기능경기대회 금메달, 교내 우수상 (없으면 '없음'으로 입력)"
                value={formData.awards}
                onChange={(e) => handleInputChange("awards", e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button className="w-full" onClick={handleSubmit}>
              분석 결과 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
