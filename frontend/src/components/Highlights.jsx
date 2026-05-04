import React from "react";
import { motion } from "motion/react";
import { highlightItems } from "../../utils/constant";

function Highlights() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {highlightItems.map((highlight, index) => (
          <motion.div
            key={index}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
          >
            {/* Feature title */}
            <h2 className="text-xl font-semibold mb-3">{highlight}</h2>

            {/* Feature description */}
            <p className="text-sm text-zinc-400 leading-relaxed">
              GenWeb.ai leverages cutting-edge AI technology to analyze your
              preferences and industry trends, generating unique and visually
              appealing website designs tailored to your needs.
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Highlights;
