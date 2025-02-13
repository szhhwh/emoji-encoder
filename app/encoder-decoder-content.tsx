"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { decode, encode } from "./encoding"
import { EmojiSelector } from "@/components/emoji-selector"
import { ALPHABET_LIST, EMOJI_LIST } from "./emoji"

export function Base64EncoderDecoderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read mode from URL parameters, other state stored locally
  const mode = searchParams.get("mode") || "encode"
  const [inputText, setInputText] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("😀")
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
      const output = isEncoding ? encode(selectedEmoji, inputText) : decode(inputText)
      setOutputText(output)
      setErrorText("")
    } catch (e) {
      setOutputText("")
      setErrorText(`错误 ${mode === "encode" ? "编码" : "解码"}: 无效输入`)
    }
  }, [mode, selectedEmoji, inputText])

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
      <p>这款工具可以将隐藏信息编码到表情符号或字母中。你可以复制和粘贴包含隐藏信息的文本来解码信息。</p>

      <div className="flex items-center justify-center space-x-2">
        <Label htmlFor="mode-toggle">解码</Label>
        <Switch id="mode-toggle" checked={isEncoding} onCheckedChange={handleModeToggle} />
        <Label htmlFor="mode-toggle">编码</Label>
      </div>

      <Textarea
        placeholder={isEncoding ? "输入要编码的文本" : "粘贴要解码的表情符号"}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="font-bold text-sm">选择一个表情符号</div>
      <EmojiSelector
        onEmojiSelect={setSelectedEmoji}
        selectedEmoji={selectedEmoji}
        emojiList={EMOJI_LIST}
        disabled={!isEncoding}
      />

      <div className="font-bold text-sm">或选择一个标准字母</div>
      <EmojiSelector
        onEmojiSelect={setSelectedEmoji}
        selectedEmoji={selectedEmoji}
        emojiList={ALPHABET_LIST}
        disabled={!isEncoding}
      />

      <Textarea
        placeholder={`${isEncoding ? "编码" : "解码"}输出`}
        value={outputText}
        readOnly
        className="min-h-[100px]"
      />

      {errorText && <div className="text-red-500 text-center">{errorText}</div>}
    </CardContent>
  )
}
