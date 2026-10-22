import { motion } from "framer-motion";

type Size = { w: number; h: number };

interface Props {
  photos: [string, string, string];
  side: Size;
  centre: Size;
  /** How far the side photos sit below the centre one. */
  offset: number;
}

/** Three photos side by side, centre in front, sides tilted ±7deg and lowered. */
export const EarlyAccessCollage = ({ photos, side, centre, offset }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="ea-collage"
  >
    {photos.map((src, i) => {
      const s = i === 1 ? centre : side;
      return (
        <div
          key={i}
          style={{
            width: s.w,
            height: s.h,
            transform: i === 0 ? `translateY(${offset}px) rotate(-7deg)` : i === 2 ? `translateY(${offset}px) rotate(7deg)` : undefined,
          }}
        >
          <img src={src} alt="" />
        </div>
      );
    })}
  </motion.div>
);

export const EarlyAccessDivider = () => (
  <div className="ea-divider" aria-hidden>
    <span />
    <i />
    <span />
  </div>
);
