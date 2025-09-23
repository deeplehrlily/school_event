"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface UniversityData {
  universityType: string
  universityName: string
  major: string
  gpa: string
  maxGpa: string
}

export default function UniversityPage() {
  const [formData, setFormData] = useState<UniversityData>({
    universityType: "",
    universityName: "",
    major: "",
    gpa: "",
    maxGpa: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const majorOptions = [
    "기계 (기계, 기계설계, 컴퓨터응용기계, 항공기계 등)",
    "전기/전자 (전기공학, 전기에너지, 신재생에너지, 디지털 전자, 전자정보통신 등)",
    "반도체/디스플레이 (반도체디스플레이, ict반도체전자, 반도체장비 등)",
    "메카트로닉스 (자동화, 로봇 등)",
    "화학공학 (화공산업공학, 생명환경화학공, 산업기술화학, 화공 등)",
    "자동차 (자동차기계, 자동차 등)",
    "산업설비 (산업설비자동화, 냉동공조설비 등)",
    "신소재 (IT소재, 신소재응용, 금속재료 등)",
    "통신 (정보통신, 통신 등)",
    "제철 (제철, 제철산업 등)",
    "조선 (조선해양 등)",
    "안전 (산업안전관리, 소방안전관리 등)",
    "금형 (금형디자인 등)",
    "기타",
  ]

  const handleInputChange = (field: keyof UniversityData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    return (
      formData.universityType && formData.universityName.trim() && formData.major && formData.gpa && formData.maxGpa
    )
  }

  const handleNext = async () => {
    if (!isFormValid()) return

    setIsSubmitting(true)

    try {
      // 기본 정보 가져오기
      const basicInfo = JSON.parse(sessionStorage.getItem("basicInfo") || "{}")

      // Google Sheets에 데이터 제출
      // await submitToGoogleSheets({
      //   timestamp: new Date().toISOString(),
      //   name: basicInfo.name || "미입력",
      //   age: basicInfo.age || "미입력",
      //   education: basicInfo.education || "대졸",
      //   phone: basicInfo.phone || "미입력",
      //   formType: "university",
      //   additionalData: {
      //     universityType: formData.universityType,
      //     universityName: formData.universityName,
      //     major: formData.major,
      //     gpa: formData.gpa,
      //     maxGpa: formData.maxGpa,
      //   },
      // })

      // 세션 스토리지에 저장하고 최종 단계에서 통합 제출
      sessionStorage.setItem("universityInfo", JSON.stringify(formData))
      window.location.href = "/form/certifications"
    } catch (error) {
      console.error("Form submission error:", error)
      alert("폼 제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
      <div className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
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
              <div className="bg-blue-500 h-2 rounded-full w-2/4"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">2/4 단계</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl text-center">대학교 정보</CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 text-center">대학교 관련 정보를 입력해주세요</p>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
            {/* University Type */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">재학중인 학교 유형 *</Label>
              <Select onValueChange={(value) => handleInputChange("universityType", value)}>
                <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="학교 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전문대" className="text-base sm:text-sm py-3 sm:py-2">
                    전문대
                  </SelectItem>
                  <SelectItem value="폴리텍" className="text-base sm:text-sm py-3 sm:py-2">
                    폴리텍
                  </SelectItem>
                  <SelectItem value="4년제" className="text-base sm:text-sm py-3 sm:py-2">
                    4년제
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* University Name */}
            <div className="space-y-2">
              <Label htmlFor="universityName" className="text-sm sm:text-base font-medium">
                학교명 *
              </Label>
              <Input
                id="universityName"
                placeholder="예: 서울대학교"
                value={formData.universityName}
                onChange={(e) => handleInputChange("universityName", e.target.value)}
                className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Major */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">학과 계열 *</Label>
              <Select onValueChange={(value) => handleInputChange("major", value)}>
                <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="학과 계열을 선택해주세요" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {majorOptions.map((major, index) => (
                    <SelectItem key={index} value={major} className="text-base sm:text-sm py-3 sm:py-2">
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GPA */}
            <div className="space-y-4">
              <Label className="text-sm sm:text-base font-medium">학점 정보</Label>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpa" className="text-xs sm:text-sm">
                    평균 학점 *
                  </Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    placeholder="3.75"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">만점 *</Label>
                  <Select onValueChange={(value) => handleInputChange("maxGpa", value)}>
                    <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="만점" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.0" className="text-base sm:text-sm py-3 sm:py-2">
                        4.0
                      </SelectItem>
                      <SelectItem value="4.3" className="text-base sm:text-sm py-3 sm:py-2">
                        4.3
                      </SelectItem>
                      <SelectItem value="4.5" className="text-base sm:text-sm py-3 sm:py-2">
                        4.5
                      </SelectItem>
                      <SelectItem value="100" className="text-base sm:text-sm py-3 sm:py-2">
                        100
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-xs text-gray-500">학점은 소수점 둘째 자리까지 입력 가능합니다</p>
            </div>

            {/* Validation feedback */}
            {!isFormValid() && Object.values(formData).some((value) => value !== "") && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-700">* 모든 필수 항목을 입력해주세요</p>
              </div>
            )}

            {/* Next Button */}
            <Button
              className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold rounded-lg transition-all duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? "제출 중..." : "다음 단계"}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>

            {/* Progress indicator */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">{Object.values(formData).filter(Boolean).length}/5 항목 완료</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
