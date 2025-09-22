"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface BasicInfoData {
  name: string
  age: string
  education: string
  phone: string
}

export default function BasicInfoPage() {
  const [formData, setFormData] = useState<BasicInfoData>({
    name: "",
    age: "",
    education: "",
    phone: "",
  })

  const handleInputChange = (field: keyof BasicInfoData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhoneChange = (value: string) => {
    // Format phone number as 000-0000-0000
    const numbers = value.replace(/\D/g, "")
    let formatted = numbers
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 3) + "-" + numbers.slice(3)
    }
    if (numbers.length >= 7) {
      formatted = numbers.slice(0, 3) + "-" + numbers.slice(3, 7) + "-" + numbers.slice(7, 11)
    }
    handleInputChange("phone", formatted)
  }

  const isFormValid = () => {
    return formData.name && formData.age && formData.education && formData.phone.length >= 13
  }

  const handleNext = () => {
    if (isFormValid()) {
      // Store data in sessionStorage for later use
      sessionStorage.setItem("basicInfo", JSON.stringify(formData))

      // Navigate based on education level
      if (formData.education === "고졸") {
        window.location.href = "/form/high-school"
      } else {
        window.location.href = "/form/university"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Hidden Netlify form for data collection */}
        <form name="hyundai-basic-info" netlify="true" hidden>
          <input type="text" name="name" value={formData.name} />
          <input type="text" name="age" value={formData.age} />
          <input type="text" name="education" value={formData.education} />
          <input type="text" name="phone" value={formData.phone} />
        </form>

        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">1/4 단계</p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">기본 정보</CardTitle>
            <p className="text-sm text-gray-600 text-center">개인정보를 입력해주세요</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">나이 *</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label>학력 *</Label>
              <Select onValueChange={(value) => handleInputChange("education", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="학력을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="고졸">고졸</SelectItem>
                  <SelectItem value="초대졸">초대졸 (전문대)</SelectItem>
                  <SelectItem value="대졸">대졸 (4년제)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호 *</Label>
              <Input
                id="phone"
                placeholder="010-0000-0000"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={13}
              />
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
