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

  const handleNext = () => {
    if (isFormValid()) {
      sessionStorage.setItem("highSchoolInfo", JSON.stringify(formData))
      window.location.href = "/form/certifications"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Hidden Netlify form for high school data */}
        <form name="hyundai-high-school" netlify="true" hidden>
          <input type="text" name="schoolType" value={formData.schoolType} />
          <input type="text" name="customSchoolType" value={formData.customSchoolType} />
          <input type="text" name="gradeAverage" value={formData.gradeAverage} />
          <input type="text" name="absences" value={formData.absences} />
          <input type="text" name="earlyLeaves" value={formData.earlyLeaves} />
          <input type="text" name="tardiness" value={formData.tardiness} />
          <input type="text" name="results" value={formData.results} />
        </form>

        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-2/4"></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">2/4 단계</p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">고등학교 정보</CardTitle>
            <p className="text-sm text-gray-600 text-center">고등학교 관련 정보를 입력해주세요</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* School Type */}
            <div className="space-y-2">
              <Label>재학중인 학교 유형 *</Label>
              <Select onValueChange={(value) => handleInputChange("schoolType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="학교 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="일반고">일반고</SelectItem>
                  <SelectItem value="공고">공고</SelectItem>
                  <SelectItem value="마이스터고">마이스터고</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom School Type */}
            {formData.schoolType === "기타" && (
              <div className="space-y-2">
                <Label htmlFor="customSchoolType">기타 학교 유형 *</Label>
                <Input
                  id="customSchoolType"
                  placeholder="학교 유형을 입력해주세요"
                  value={formData.customSchoolType}
                  onChange={(e) => handleInputChange("customSchoolType", e.target.value)}
                />
              </div>
            )}

            {/* Grade Average */}
            <div className="space-y-2">
              <Label htmlFor="gradeAverage">내신 등급 *</Label>
              <Input
                id="gradeAverage"
                type="number"
                step="0.1"
                placeholder="3.5"
                value={formData.gradeAverage}
                onChange={(e) => handleInputChange("gradeAverage", e.target.value)}
              />
              <p className="text-xs text-gray-500">소수점 첫째 자리까지 입력해주세요</p>
            </div>

            {/* Attendance Records */}
            <div className="space-y-4">
              <Label className="text-base font-medium">출결 현황</Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="absences">결석 *</Label>
                  <Input
                    id="absences"
                    type="number"
                    placeholder="0"
                    value={formData.absences}
                    onChange={(e) => handleInputChange("absences", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="earlyLeaves">조퇴 *</Label>
                  <Input
                    id="earlyLeaves"
                    type="number"
                    placeholder="0"
                    value={formData.earlyLeaves}
                    onChange={(e) => handleInputChange("earlyLeaves", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tardiness">지각 *</Label>
                  <Input
                    id="tardiness"
                    type="number"
                    placeholder="0"
                    value={formData.tardiness}
                    onChange={(e) => handleInputChange("tardiness", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results">결과 *</Label>
                  <Input
                    id="results"
                    type="number"
                    placeholder="0"
                    value={formData.results}
                    onChange={(e) => handleInputChange("results", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Next Button */}
            <Button className="w-full" onClick={handleNext} disabled={!isFormValid()}>
              다음 단계
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
