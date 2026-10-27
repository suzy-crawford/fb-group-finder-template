import React, { useState } from "react";
import { Copy, Check } from "@/components/brand/icons";

export default function CopyButton({ text, label = "Copy", className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* clipboard unavailable */
    }
  };

  return (
    <button type="button" onClick={handleCopy} className={`btn-outline-grad ${className || ""}`}>
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : label}
    </button>
  );
}
