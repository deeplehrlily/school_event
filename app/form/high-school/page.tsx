"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface HighSchoolData {
  schoolType: string
  customSchoolType: string
  gradeAverage: string
  absences: string
  earlyLeaves: string
  tardiness: string
  results: string
}

export default function HighSchoolPage() {
  const [formData, setFormData] = useState<HighSchoolData>({
    schoolType: "",
    customSchoolType: "",
    gradeAverage: "",
    absences: "",
    earlyLeaves: "",
    tardiness: "",
    results: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof HighSchoolData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    const schoolTypeValid =
      formData.schoolType === "기타" ? formData.customSchoolType.trim() !== "" : formData.schoolType !== ""

    return (
      schoolTypeValid &&
      formData.gradeAverage &&
      formData.absences !== "" &&
      formData.earlyLeaves !== "" &&
      formData.tardiness !== "" &&
      formData.results !== ""
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
      //   education: basicInfo.education || "고졸",
      //   phone: basicInfo.phone || "미입력",
      //   formType: "high-school",
      //   additionalData: {
      //     schoolType: formData.schoolType === "기타" ? formData.customSchoolType : formData.schoolType,
      //     gradeAverage: formData.gradeAverage,
      //     absences: formData.absences,
      //     earlyLeaves: formData.earlyLeaves,
      //     tardiness: formData.tardiness,
      //     results: formData.results,
      //   },
      // })

      sessionStorage.setItem("highSchoolInfo", JSON.stringify(formData))
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
            <CardTitle className="text-lg sm:text-xl text-center">고등학교 정보</CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 text-center">고등학교 관련 정보를 입력해주세요</p>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
            {/* School Type */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">재학중인 학교 유형 *</Label>
              <Select onValueChange={(value) => handleInputChange("schoolType", value)}>
                <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="학교 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="일반고" className="text-base sm:text-sm py-3 sm:py-2">
                    일반고
                  </SelectItem>
                  <SelectItem value="공고" className="text-base sm:text-sm py-3 sm:py-2">
                    공고
                  </SelectItem>
                  <SelectItem value="마이스터고" className="text-base sm:text-sm py-3 sm:py-2">
                    마이스터고
                  </SelectItem>
                  <SelectItem value="기타" className="text-base sm:text-sm py-3 sm:py-2">
                    기타
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom School Type */}
            {formData.schoolType === "기타" && (
              <div className="space-y-2">
                <Label htmlFor="customSchoolType" className="text-sm sm:text-base font-medium">
                  기타 학교 유형 *
                </Label>
                <Input
                  id="customSchoolType"
                  placeholder="학교 유형을 입력해주세요"
                  value={formData.customSchoolType}
                  onChange={(e) => handleInputChange("customSchoolType", e.target.value)}
                  className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {/* Grade Average */}
            <div className="space-y-2">
              <Label htmlFor="gradeAverage" className="text-sm sm:text-base font-medium">
                내신 등급 *
              </Label>
              <Input
                id="gradeAverage"
                type="number"
                step="0.1"
                placeholder="3.5"
                value={formData.gradeAverage}
                onChange={(e) => handleInputChange("gradeAverage", e.target.value)}
                className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500">소수점 첫째 자리까지 입력해주세요</p>
            </div>

            {/* Attendance Records */}
            <div className="space-y-4">
              <Label className="text-sm sm:text-base font-medium">출결 현황</Label>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="absences" className="text-xs sm:text-sm">
                    결석 *
                  </Label>
                  <Input
                    id="absences"
                    type="number"
                    placeholder="0"
                    value={formData.absences}
                    onChange={(e) => handleInputChange("absences", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="earlyLeaves" className="text-xs sm:text-sm">
                    조퇴 *
                  </Label>
                  <Input
                    id="earlyLeaves"
                    type="number"
                    placeholder="0"
                    value={formData.earlyLeaves}
                    onChange={(e) => handleInputChange("earlyLeaves", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tardiness" className="text-xs sm:text-sm">
                    지각 *
                  </Label>
                  <Input
                    id="tardiness"
                    type="number"
                    placeholder="0"
                    value={formData.tardiness}
                    onChange={(e) => handleInputChange("tardiness", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results" className="text-xs sm:text-sm">
                    결과 *
                  </Label>
                  <Input
                    id="results"
                    type="number"
                    placeholder="0"
                    value={formData.results}
                    onChange={(e) => handleInputChange("results", e.target.value)}
                    className="h-12 sm:h-10 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
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
              <p className="text-xs text-gray-500">{Object.values(formData).filter(Boolean).length}/6 항목 완료</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
