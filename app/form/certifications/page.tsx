"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { submitToGoogleSheets } from "@/lib/google-sheets"

interface CertificationData {
  craftsman: string[]
  industrialEngineer: string[]
  engineer: string[]
  masterCraftsman: string
  technicalMaster: string
  experience: string
  languageScore: string
  awards: string
}

interface NoneCheckboxes {
  masterCraftsman: boolean
  technicalMaster: boolean
  experience: boolean
  languageScore: boolean
  awards: boolean
}

const certificationOptions = {
  craftsman: [
    "전기",
    "지게차운전",
    "컴퓨터응용선반",
    "위험물",
    "전자기기",
    "설비보전",
    "컴퓨터응용밀링",
    "정보처리",
    "가스",
    "전산응용기계제도",
    "공유압",
    "용접",
    "전자캐드",
    "화학분석",
    "기계가공조립",
    "환경",
    "생산자동화",
    "승강기",
    "자동차정비",
    "에너지관리",
    "전자계산기",
    "특수용접",
    "압연",
    "제선",
    "제강",
    "금형",
    "공조냉동기계",
    "기계정비",
    "항공기체정비",
    "3D프린터운용",
    "천장크레인운전",
    "산업안전",
    "금속재료시험",
  ],
  industrialEngineer: ["산업안전", "전기", "공조냉동기계", "가스", "전기공사", "에너지"],
  engineer: ["산업안전", "전기", "공조냉동기계", "전기공사", "에너지"],
}

export default function CertificationsPage() {
  const [formData, setFormData] = useState<CertificationData>({
    craftsman: [],
    industrialEngineer: [],
    engineer: [],
    masterCraftsman: "",
    technicalMaster: "",
    experience: "",
    languageScore: "",
    awards: "",
  })

  const [noneChecked, setNoneChecked] = useState<NoneCheckboxes>({
    masterCraftsman: false,
    technicalMaster: false,
    experience: false,
    languageScore: false,
    awards: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleNoneToggle = (field: keyof NoneCheckboxes) => {
    setNoneChecked((prev) => {
      const newState = { ...prev, [field]: !prev[field] }

      // If "none" is checked, set the field value to "없음"
      if (newState[field]) {
        setFormData((prevData) => ({ ...prevData, [field]: "없음" }))
      } else {
        // If "none" is unchecked, clear the field
        setFormData((prevData) => ({ ...prevData, [field]: "" }))
      }

      return newState
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const basicInfo = JSON.parse(sessionStorage.getItem("basicInfo") || "{}")
      const highSchoolInfo = JSON.parse(sessionStorage.getItem("highSchoolInfo") || "{}")
      const universityInfo = JSON.parse(sessionStorage.getItem("universityInfo") || "{}")

      const unifiedData = {
        name: basicInfo.name || "",
        age: basicInfo.age || "",
        education: basicInfo.education || "",
        phone: basicInfo.phone || "",
        ...(basicInfo.education === "고졸" && {
          schoolType:
            highSchoolInfo.schoolType === "기타" ? highSchoolInfo.customSchoolType : highSchoolInfo.schoolType || "",
          gradeAverage: highSchoolInfo.gradeAverage || "",
          absences: highSchoolInfo.absences || "",
          earlyLeaves: highSchoolInfo.earlyLeaves || "",
          tardiness: highSchoolInfo.tardiness || "",
          results: highSchoolInfo.results || "",
        }),
        ...(basicInfo.education !== "고졸" && {
          universityType: universityInfo.universityType || "",
          universityName: universityInfo.universityName || "",
          major: universityInfo.major || "",
          gpa: universityInfo.gpa || "",
          maxGpa: universityInfo.maxGpa || "",
        }),
        technicalMaster: formData.technicalMaster || "없음",
        engineer: formData.engineer.join(", ") || "없음",
        industrialEngineer: formData.industrialEngineer.join(", ") || "없음",
        craftsman: formData.craftsman.join(", ") || "없음",
        masterCraftsman: formData.masterCraftsman || "없음",
        experience: formData.experience || "없음",
        languageScore: formData.languageScore || "없음",
        awards: formData.awards || "없음",
        submittedAt: new Date().toISOString(),
      }

      await submitToGoogleSheets(unifiedData)

      console.log("Form submitted successfully to Google Sheets")

      sessionStorage.setItem("certificationInfo", JSON.stringify(formData))
      sessionStorage.setItem("allFormData", JSON.stringify(unifiedData))

      window.location.href = "/analysis/result"
    } catch (error) {
      console.error("Form submission error:", error)
      alert("데이터 전송 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 relative">
      <div className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6">
        <form name="hyundai-spec-analysis" netlify="true" hidden>
          <input type="text" name="name" />
          <input type="text" name="age" />
          <input type="text" name="education" />
          <input type="text" name="phone" />
          <input type="text" name="technicalMaster" />
          <input type="text" name="engineer" />
          <input type="text" name="industrialEngineer" />
          <input type="text" name="craftsman" />
          <input type="text" name="masterCraftsman" />
          <input type="text" name="experience" />
          <input type="text" name="languageScore" />
          <input type="text" name="awards" />
        </form>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="min-h-[44px] min-w-[44px] touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-full"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">4/4 단계</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl text-center">자격증 및 기타 스펙</CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              보유하신 자격증과 기타 스펙을 선택해주세요 (다수선택 가능)
            </p>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
            <div className="space-y-5 sm:space-y-6">
              <Label className="text-sm sm:text-base font-medium">보유 자격증 (다수선택 가능)</Label>

              <div className="space-y-3">
                <Label className="text-xs sm:text-sm font-medium text-gray-700">기능사</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 sm:max-h-56 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.craftsman.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`craftsman-${cert}`}
                        checked={formData.craftsman.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("craftsman", cert)}
                        className="min-h-[20px] min-w-[20px] touch-manipulation"
                      />
                      <Label htmlFor={`craftsman-${cert}`} className="text-xs cursor-pointer leading-tight">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.craftsman.length > 0 && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    선택됨: {formData.craftsman.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-xs sm:text-sm font-medium text-gray-700">산업기사</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 sm:max-h-40 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.industrialEngineer.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`industrial-${cert}`}
                        checked={formData.industrialEngineer.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("industrialEngineer", cert)}
                        className="min-h-[20px] min-w-[20px] touch-manipulation"
                      />
                      <Label htmlFor={`industrial-${cert}`} className="text-xs cursor-pointer leading-tight">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.industrialEngineer.length > 0 && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    선택됨: {formData.industrialEngineer.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-xs sm:text-sm font-medium text-gray-700">기사</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 sm:max-h-40 overflow-y-auto border rounded-lg p-3">
                  {certificationOptions.engineer.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`engineer-${cert}`}
                        checked={formData.engineer.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle("engineer", cert)}
                        className="min-h-[20px] min-w-[20px] touch-manipulation"
                      />
                      <Label htmlFor={`engineer-${cert}`} className="text-xs cursor-pointer leading-tight">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.engineer.length > 0 && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded">선택됨: {formData.engineer.join(", ")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="masterCraftsman" className="text-xs sm:text-sm font-medium text-gray-700">
                  기능장 (서술형)
                </Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="none-masterCraftsman"
                    checked={noneChecked.masterCraftsman}
                    onCheckedChange={() => handleNoneToggle("masterCraftsman")}
                    className="min-h-[20px] min-w-[20px] touch-manipulation"
                  />
                  <Label htmlFor="none-masterCraftsman" className="text-xs cursor-pointer text-gray-600">
                    없음
                  </Label>
                </div>
                <Input
                  id="masterCraftsman"
                  placeholder="예: 전기기능장, 용접기능장"
                  value={formData.masterCraftsman}
                  onChange={(e) => handleInputChange("masterCraftsman", e.target.value)}
                  disabled={noneChecked.masterCraftsman}
                  className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicalMaster" className="text-xs sm:text-sm font-medium text-gray-700">
                  기술사 (서술형)
                </Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="none-technicalMaster"
                    checked={noneChecked.technicalMaster}
                    onCheckedChange={() => handleNoneToggle("technicalMaster")}
                    className="min-h-[20px] min-w-[20px] touch-manipulation"
                  />
                  <Label htmlFor="none-technicalMaster" className="text-xs cursor-pointer text-gray-600">
                    없음
                  </Label>
                </div>
                <Input
                  id="technicalMaster"
                  placeholder="예: 전기기술사, 기계기술사"
                  value={formData.technicalMaster}
                  onChange={(e) => handleInputChange("technicalMaster", e.target.value)}
                  disabled={noneChecked.technicalMaster}
                  className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm sm:text-base font-medium">
                경력 사항
              </Label>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="none-experience"
                  checked={noneChecked.experience}
                  onCheckedChange={() => handleNoneToggle("experience")}
                  className="min-h-[20px] min-w-[20px] touch-manipulation"
                />
                <Label htmlFor="none-experience" className="text-xs cursor-pointer text-gray-600">
                  없음
                </Label>
              </div>
              <Textarea
                id="experience"
                placeholder="예: 삼성전자 3개월, LG전자 6개월"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                disabled={noneChecked.experience}
                rows={3}
                className="text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors resize-none disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languageScore" className="text-sm sm:text-base font-medium">
                어학 성적
              </Label>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="none-languageScore"
                  checked={noneChecked.languageScore}
                  onCheckedChange={() => handleNoneToggle("languageScore")}
                  className="min-h-[20px] min-w-[20px] touch-manipulation"
                />
                <Label htmlFor="none-languageScore" className="text-xs cursor-pointer text-gray-600">
                  없음
                </Label>
              </div>
              <Input
                id="languageScore"
                placeholder="예: TOEIC 850, TEPS 600"
                value={formData.languageScore}
                onChange={(e) => handleInputChange("languageScore", e.target.value)}
                disabled={noneChecked.languageScore}
                className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="awards" className="text-sm sm:text-base font-medium">
                수상 경력
              </Label>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="none-awards"
                  checked={noneChecked.awards}
                  onCheckedChange={() => handleNoneToggle("awards")}
                  className="min-h-[20px] min-w-[20px] touch-manipulation"
                />
                <Label htmlFor="none-awards" className="text-xs cursor-pointer text-gray-600">
                  없음
                </Label>
              </div>
              <Textarea
                id="awards"
                placeholder="예: 전국기능경기대회 금메달, 교내 우수상"
                value={formData.awards}
                onChange={(e) => handleInputChange("awards", e.target.value)}
                disabled={noneChecked.awards}
                rows={3}
                className="text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors resize-none disabled:bg-gray-100"
              />
            </div>

            <Button
              className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold rounded-lg transition-all duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "제출 중..." : "분석 결과 보기"}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
