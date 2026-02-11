import { useState } from "react";

export function useCreateListDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string | undefined>("shopping");
  const [isCreating, setIsCreating] = useState(false);

  const reset = () => {
    setTitle("");
    setIcon("shopping");
    setIsCreating(false);
  };

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    reset();
  };

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    title,
    setTitle,
    icon,
    setIcon,
    isCreating,
    setIsCreating,
    reset,
  };
}
