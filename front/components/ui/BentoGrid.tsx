import { cn } from "@/lib/utils";
import { Globe } from "@/components/ui/Globe";
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  img,
  imgClassName,
  id,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  id?: number;
}) => {
  return (
    <div
      className={cn(
        `row-span-1 relative rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input shadow-none overflow-hidden ${
          id === 2 ? "py-4 pl-4 flex-col-reverse pr-2 " : "p-4 flex-col"
        }   bg-black border-white/[0.2]  border  justify-between flex  space-y-4`,
        className
      )}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div
        className={`${
          (id === 1 && "flex justify-center h-full") ||
          (id === 2 && "flex justify-center h-full")
        }`}
      >
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          {img && (
            <img
              src={img}
              alt={img}
              className={cn(imgClassName, "object-cover object-center ")}
            />
          )}
        </div>
      </div>
      {id === 2 && (
        <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
          <Globe className="absolute inset-0 md:w-full md:h-full" />
        </div>
      )}
      <div
        className={`group-hover/bento:translate-x-2 transition duration-200 z-10 ${
          id === 2 ? "flex-col-reverse" : ""
        }`}
      >
        <div className="font-sans font-bold text-neutral-200 mb-2 mt-2s">
          {title}
        </div>
        <div className="font-sans font-normal  text-xs text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};
