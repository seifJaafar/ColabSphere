import React from "react";

const MagicButton = ({
  title,
  icon,
  white = false,
}: {
  title: string;
  icon?: React.ReactNode;
  white?: boolean;
}) => {
  return (
    <button className="relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[1px] focus:outline-none md:w-40">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg gap-2 ${
          white ? "bg-white text-black-100" : "bg-slate-950 text-white"
        }  px-3 py-1 text-sm font-medium backdrop-blur-3xl`}
      >
        {title}
        {icon}
      </span>
    </button>
  );
};

export default MagicButton;
