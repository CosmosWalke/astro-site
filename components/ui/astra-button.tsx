"use client";

import React from "react";

interface AstraButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const AstraButton: React.FC<AstraButtonProps> = ({ 
  label = "BACK TO SHIP", 
  onClick,
  href,
  className 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };

  const buttonContent = (
    <button
      onClick={handleClick}
      className={`
        relative px-6 py-2 rounded-md border border-[#00d4ff]
        text-sm font-semibold tracking-[2px] uppercase
        text-white
        bg-transparent transition-all duration-300 ease-in-out
        hover:bg-[#00d4ff]
        hover:text-white
        hover:shadow-[0_0_30px_5px_rgba(0,212,255,0.6)]
        active:shadow-none
        hover:scale-105
        active:scale-95
        ${className}
      `}
    >
      {label}
    </button>
  );

  if (href) {
    return (
      <a href={href} onClick={(e) => {
        e.preventDefault();
        handleClick(e);
      }}>
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
};

export default AstraButton;