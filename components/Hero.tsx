import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden flex flex-col justify-center">
      {/* Background Abstract Elements */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-12 gap-4">
            
            {/* Asymmetrical Layout - Title */}
            <div className="col-span-12 lg:col-span-8">
                <motion.h1 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.85] text-white mix-blend-difference"
                >
                    FUTURE <br />
                    <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">SIGHT</span>
                </motion.h1>
            </div>

            {/* Subtitle / Description - Offset */}
            <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-8 lg:mt-32">
                <motion.div 
                    style={{ y: y1 }}
                    className="border-l border-white/20 pl-6 backdrop-blur-sm"
                >
                    <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                        The unofficial prediction market for Winston Churchill High School. 
                        Translate your intuition into social capital. 
                        Win Starbucks cards. Own the future.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <div className="text-xs uppercase tracking-widest text-neutral-500">
                            Est. 2025
                        </div>
                        <div className="text-xs uppercase tracking-widest text-neutral-500">
                             • &nbsp; WCHS
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>

      {/* Floating Visual Element - 3D Card Effect */}
      <motion.div 
        style={{ y: y2, opacity }}
        className="absolute bottom-20 left-6 md:left-20 z-0 opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
      >
          <img 
            src="https://picsum.photos/400/600?grayscale" 
            alt="School Aesthetic" 
            className="w-48 md:w-64 h-auto rounded-none opacity-40 mix-blend-lighten"
          />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 right-10 flex flex-col items-center gap-2"
      >
          <span className="text-[10px] tracking-[0.3em] uppercase rotate-90 origin-right text-neutral-500">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-neutral-500 to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default Hero;