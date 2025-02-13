"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { decode, encode } from "./encoding"
import { EmojiSelector } from "@/components/emoji-selector"
import { EMOJI_LIST } from "./emoji"

export function Base64EncoderDecoderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read mode from URL parameters, other state stored locally
  const mode = searchParams.get("mode") || "decode"
  const [inputText, setInputText] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("😀")
  const [customSymbol, setCustomSymbol] = useState("")
  const [emojiList, setEmojiList] = useState(EMOJI_LIST)
  const [outputText, setOutputText] = useState("")
  const [errorText, setErrorText] = useState("")

  // Update URL when mode changes
  const updateMode = (newMode: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("mode", newMode)
    router.replace(`?${params.toString()}`)
  }

  // Convert input whenever it changes
  useEffect(() => {
    try {
      const isEncoding = mode === "encode"
      const output = isEncoding ? encode(selectedEmoji, inputText, customSymbol) : decode(inputText)
      setOutputText(output)
      setErrorText("")
    } catch (e) {
      setOutputText("")
      setErrorText(`错误 ${mode === "encode" ? "编码" : "解码"}: 无效输入`)
    }
  }, [mode, selectedEmoji, customSymbol, inputText])

  const handleModeToggle = (checked: boolean) => {
    updateMode(checked ? "encode" : "decode")
    setInputText("") // Clear input text when mode changes
  }

  // Handle initial URL state
  useEffect(() => {
    if (!searchParams.has("mode")) {
      updateMode("encode")
    }
  }, [searchParams, updateMode])

  const isEncoding = mode === "encode"

  return (
    <CardContent className="space-y-4">

      <div className="flex items-center justify-center space-x-2">
        <Label htmlFor="mode-toggle">解密</Label>
        <Switch id="mode-toggle" checked={isEncoding} onCheckedChange={handleModeToggle} />
        <Label htmlFor="mode-toggle">加密</Label>
      </div>

      <Textarea
        placeholder={isEncoding ? "输入要加密的文本" : "输入要解密的emoji"}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="font-bold text-sm">选择一个emoji</div>
      <EmojiSelector
        onEmojiSelect={setSelectedEmoji}
        onCustomSymbolSubmit={(symbol) => {
          setCustomSymbol(symbol)
          setEmojiList([...emojiList, symbol])
        }}
        selectedEmoji={selectedEmoji}
        emojiList={emojiList}
        disabled={!isEncoding}
      />

      <Textarea
        placeholder={`${isEncoding ? "加密" : "解密"}输出`}
        value={outputText}
        readOnly
        className="min-h-[100px]"
      />

      {errorText && <div className="text-red-500 text-center">{errorText}</div>}
    </CardContent>
  )
}
