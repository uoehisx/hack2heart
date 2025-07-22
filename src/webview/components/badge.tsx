import React from "react";

interface BadgeProps {
    text: string;
    backgroundColor?: string;  
}
const BADGE_COLORS = [
    "#767676",
    "#6A6E7E",
    "#7B6577"
]

export const Badge = ({text, backgroundColor = "gray" }: BadgeProps) => {
    return <span style={{
        backgroundColor: backgroundColor || BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)],
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        color: "#ffffff",
        boxShadow: "2px 2px 4px #000000, -2px -2px 4px #1f1f1f"

    }}>
        {text}
    </span>

}