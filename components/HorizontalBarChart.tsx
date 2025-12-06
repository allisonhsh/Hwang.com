"use client"

import { Bar } from "react-chartjs-2"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function HorizontalBarChart() {
  const labels = [
    "데이터 분석",
    "입지·상권 분석",
    "보고서 작성",
    "문제 해결",
    "협업",
    "PropTech 이해도",
  ]

  const finalScores = [8, 7, 9, 7, 9, 7]

  // 애니메이션
  const [animatedScores, setAnimatedScores] = useState<number[]>(
    finalScores.map(() => 0)
  )

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let frame = 0
          const duration = 60

          const timer = setInterval(() => {
            frame++
            setAnimatedScores(
              finalScores.map((v) => (v * frame) / duration)
            )
            if (frame >= duration) clearInterval(timer)
          }, 15)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
  }, [])

  // ⭐ Gradient은 Chart.js 자체 기능으로 해결 — Turbopack 오류 없음
  const backgroundColor = function (context: any) {
    const chart = context.chart
    const { ctx } = chart
    const gradient = ctx.createLinearGradient(0, 0, chart.width, 0)

    gradient.addColorStop(0, "rgba(99,102,241,0.25)")
    gradient.addColorStop(1, "rgba(79,70,229,1)")

    return gradient
  }

  // ⭐ chart.js가 요구하는 순수 객체 — 절대 에러 안 남
  const data = {
    labels,
    datasets: [
      {
        label: "역량 점수",
        data: animatedScores,
        backgroundColor,
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  }

  // ⭐ options도 순수 객체로 유지 — 타입 추론 때문에 빨간줄 안 생김
const options: any = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      suggestedMax: 10,
      grid: { color: "rgba(0,0,0,0.06)" },
    },
    y: {
      grid: { display: false },
      ticks: { font: { size: 15 } },
    },
  },
  animation: false,
}


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-5xl h-[420px] mx-auto"
    >
      {/* ⭐⭐ 이제 절대 빨간줄 안 난다 ⭐⭐ */}
      <Bar data={data} options={options} />
    </motion.div>
  )
}
