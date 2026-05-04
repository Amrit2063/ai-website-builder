import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function WebsiteCard({ website }) {
  const navigate = useNavigate();
  return (
    <div>
      <motion.div
        key={website._id}
        whileHover={{ y: -6 }}
        onClick={() => navigate(`/editor/${website._id}`)}
        className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
      >
        <div className="h-40 bg-black">
          <iframe
            srcDoc={website.latestCode}
            className="w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
            title={website.name}
          />
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold line-clamp-2">
            {website.title}
          </h3>

          <p className="text-xs text-zinc-400">
            Last Updated{" "}
            {new Date(website.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default WebsiteCard;
