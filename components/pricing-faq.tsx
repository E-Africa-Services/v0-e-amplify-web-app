"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How do credits work?",
    answer:
      "Credits are used to book mentorship sessions. Each session costs a certain number of credits based on the mentor's rate. You can purchase credits in packages or earn them by mentoring others.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access to your plan benefits until the end of your billing period.",
  },
  {
    question: "How do I earn money as a mentor?",
    answer:
      "When you host mentorship sessions, you earn credits that can be converted to cash. We take a small platform fee, and you keep the rest. Payments are processed monthly.",
  },
  {
    question: "What's the difference between credits and subscription?",
    answer:
      "Your subscription gives you access to platform features and includes monthly credits. Additional credits can be purchased separately to book more sessions.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! The Free plan lets you explore the platform and community. You can upgrade to Creator or Pro anytime to unlock more features.",
  },
]

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
            >
              <span className="font-semibold pr-4">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === i && (
              <div className="px-6 pb-6">
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
