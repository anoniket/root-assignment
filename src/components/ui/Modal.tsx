import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  children: ReactNode;
  /** Called when the backdrop is clicked or ESC is pressed (omit for non-dismissible). */
  onClose?: () => void;
  /** Accessible label / labelledby reference for the dialog. */
  ariaLabel?: string;
};

/**
 * Centered modal with a dimmed backdrop. Fixed-position so it overlays the
 * entire viewport regardless of where it's rendered in the tree.
 *
 * Backdrop: #303030 @ 70% opacity (Figma 1:2081). The dialog scales/fades in
 * via Framer Motion. ESC + backdrop click both invoke `onClose` when provided.
 */
export function Modal({ open, children, onClose, ariaLabel }: Props) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#303030]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
