"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface EmojiSelectorProps {
  onEmojiSelect: (emoji: string) => void
  onCustomSymbolSubmit: (symbol: string) => void
  disabled: boolean
  selectedEmoji: string
  emojiList: string[]
}

export function EmojiSelector({ 
  onEmojiSelect, 
  onCustomSymbolSubmit,
  disabled, 
  selectedEmoji, 
  emojiList 
}: EmojiSelectorProps) {
  const [customSymbol, setCustomSymbol] = useState("")

  const handleSubmit = () => {
    onCustomSymbolSubmit(customSymbol)
    setCustomSymbol("")
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {emojiList.map((emoji) => (
          <Button
            key={emoji}
            variant="outline"
            className={`w-8 h-8 p-0 disabled:opacity-50 ${emoji === selectedEmoji ? "bg-accent border-purple-500" : ""}`}
            onClick={() => onEmojiSelect(emoji)}
            disabled={disabled}
          >
            {emoji}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="输入自定义符号"
          value={customSymbol}
          onChange={(e) => setCustomSymbol(e.target.value)}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={disabled || customSymbol.length === 0}
        >
          添加
        </Button>
      </div>
    </div>
  )
}
