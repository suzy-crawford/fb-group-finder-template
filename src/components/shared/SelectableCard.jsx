import React from "react";
import { cn } from "@/lib/utils";

// Pick-one / pick-many option, kit 2.0: navy outline and filled dot when chosen.
export default function SelectableCard({ title, description, selected, onSelect, disabled }) {
  return (
    <button type="button" role="checkbox" aria-checked={!!selected} onClick={onSelect} disabled={disabled} className={cn("lp-option", disabled && "opacity-50 cursor-not-allowed")}>
      <span className="lp-radio" />
      <span className="lp-option-body">
        <span className="lp-option-name">{title}</span>
        {description && <span className="lp-option-text">{description}</span>}
      </span>
    </button>
  );
}
