import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-950/60 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl rounded-lg bg-white p-6 shadow-glass dark:bg-ink-900"
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-ink-900 dark:text-white">{title}</h2>
              <button type="button" onClick={onClose} className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-50 dark:text-white dark:hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
