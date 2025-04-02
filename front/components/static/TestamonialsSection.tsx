import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import data from "@/data/NavList";
const TestamonialsSection = () => {
  const { testimonials } = data;
  return (
    <div className="my-20 max-h-[100vh]">
      <div className="flex flex-col items-center">
        <TextGenerateEffect
          words="What Users Say About Us"
          className="text-center text-[40px] md:text-5xl lg:text-6xl"
        />
        <div className="w-[40rem] h-10 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          {/* Radial Gradient to prevent sharp edges */}
        </div>
      </div>
      <AnimatedTestimonials testimonials={testimonials} autoplay={false} />
    </div>
  );
};

export default TestamonialsSection;
