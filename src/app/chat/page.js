"use client";

import { useState } from "react";
import ChatBubble from "components/ui/ChatBubble";
import ChatInput from "components/ui/ChatInput";
import QuickChip from "components/ui/QuickChip";
import ValuesLayout from "components/layouts/ValuesLayout";
import { useRouter } from "next/navigation";

export default function ValuesChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      title: "Honesty value workshop",
      content:
        "Lorem ipsum dolor sit amet consectetur. Bibendum nibh amet viverra velit proin leo venenatis augue ut. Auctor ac nit eget nibh diam dictum viverra sed ac in. Mattis orci non ultricies in pellentesque porttitor risus laoreet sed. Vivamus nec facilisis leo. Gravida dui suspendisse senectus pharetra viverra. Eu nibh eget aliquet ornare sapien amet faucibus nec. Massa est ut sit arcu. Dignissim nibh egestas nibh eget eget malesuada. Donec pellentesque tristique odio sed mattis euismod cras. Sit ullamcorper fusce et sit sed urna.",
    },
  ]);

  const quickTips = [
    { label: "Quick tips", onClick: () => {} },
    { label: "Jump to summary", onClick: () => {} },
  ];

  const handleSendMessage = async (message) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Response to: ${message}`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9FB]">
      {/* Chat messages area */}
      <ValuesLayout className="flex-1 space-y-6 overflow-y-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 mb-6"
        >
          ← Back
        </button>

        <div className="space-y-6">
          {messages.map((message, index) => (
            <ChatBubble key={index} role={message.role} title={message.title}>
              {message.content}
            </ChatBubble>
          ))}
        </div>
      </ValuesLayout>

      {/* Input area */}
      <div className="bg-transparent">
        <ValuesLayout className="space-y-4">
          {/* Quick actions */}
          <div className="flex gap-2 justify-end">
            {quickTips.map((tip, index) => (
              <QuickChip key={index} label={tip.label} onClick={tip.onClick} />
            ))}
          </div>

          {/* Chat input */}
          <ChatInput onSend={handleSendMessage} />
        </ValuesLayout>
      </div>
    </div>
  );
}
