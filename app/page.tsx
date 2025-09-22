"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2, MessageCircle, Twitter, Instagram, Link } from "lucide-react"

export default function HomePage() {
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = "내 스펙, 현대자동차 가기 괜찮을까? 현대자동차 채용 스펙 분석 서비스"

    switch (platform) {
      case "kakao":
        // KakaoTalk sharing would require Kakao SDK
        alert("카카오톡 공유 기능은 준비 중입니다.")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "instagram":
        // Instagram doesn't support direct sharing via URL
        navigator.clipboard.writeText(url)
        alert("링크가 복사되었습니다. Instagram에서 공유해주세요!")
        break
      case "link":
        navigator.clipboard.writeText(url)
        alert("링크가 복사되었습니다!")
        break
    }
    setShowShareMenu(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/10 rounded-full"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300/20 rounded-full"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-blue-200/15 rounded-full"></div>
      </div>

      <div className="w-full max-w-md space-y-8 text-center relative z-10">
        <div className="space-y-3">
          <div className="inline-block bg-blue-600/30 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
            <p className="text-sm text-blue-200 font-semibold">채용 스펙 분석 서비스</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-balance leading-tight">
              내 스펙, 현대자동차 가기
              <br />
              <span className="text-blue-300">괜찮을까</span>
            </h2>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-200 text-sm font-medium">실시간 데이터 분석</span>
                </div>
                <p className="text-white text-base leading-relaxed">
                  현대자동차 <span className="text-blue-300 font-bold">실제 합격자 데이터</span>와 비교하여
                  <br />
                  나의 스펙을 정확히 분석해보세요
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-6 text-lg shadow-2xl border-0 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
            onClick={() => (window.location.href = "/form/basic-info")}
          >
            <span className="mr-3 text-xl">▶</span>
            스펙 분석 시작하기
          </Button>

          {/* Share Section */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>

            {showShareMenu && (
              <Card className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-3 bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-xl">
                <div className="flex space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare("link")}
                    className="flex flex-col items-center p-2 h-auto hover:bg-slate-100 rounded-lg"
                  >
                    <Link className="w-5 h-5 mb-1" />
                    <span className="text-xs">링크</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare("kakao")}
                    className="flex flex-col items-center p-2 h-auto text-yellow-600 hover:bg-yellow-50 rounded-lg"
                  >
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="text-xs">카카오톡</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare("twitter")}
                    className="flex flex-col items-center p-2 h-auto text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <Twitter className="w-5 h-5 mb-1" />
                    <span className="text-xs">X</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare("instagram")}
                    className="flex flex-col items-center p-2 h-auto text-pink-500 hover:bg-pink-50 rounded-lg"
                  >
                    <Instagram className="w-5 h-5 mb-1" />
                    <span className="text-xs">인스타그램</span>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
