import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AccordionContextType {
  activeItem: string | null;
  toggleItem: (value: string) => void;
}

const AccordionContext =
  createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      "Accordion components must be used inside Accordion"
    );
  }

  return context;
}

interface AccordionProps {
  children: ReactNode;
  defaultValue?: string | null;
}

function Accordion({
  children,
  defaultValue = null,
}: AccordionProps) {
  const [activeItem, setActiveItem] =
    useState<string | null>(defaultValue);

  const toggleItem = (value: string) => {
    setActiveItem((current) =>
      current === value ? null : value
    );
  };

  return (
    <AccordionContext.Provider
      value={{
        activeItem,
        toggleItem,
      }}
    >
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

function AccordionItem({
  value,
  children,
}: AccordionItemProps) {
  return (
    <div
      className="accordion-item"
      data-value={value}
    >
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  value: string;
  children: ReactNode;
}

function AccordionTrigger({
  value,
  children,
}: AccordionTriggerProps) {
  const { activeItem, toggleItem } =
    useAccordionContext();

  const isOpen = activeItem === value;

  return (
    <button
      className="accordion-trigger"
      onClick={() => toggleItem(value)}
    >
      <span>{children}</span>

      <span>{isOpen ? "−" : "+"}</span>
    </button>
  );
}

interface AccordionContentProps {
  value: string;
  children: ReactNode;
}

function AccordionContent({
  value,
  children,
}: AccordionContentProps) {
  const { activeItem } =
    useAccordionContext();

  if (activeItem !== value) {
    return null;
  }

  return (
    <div className="accordion-content">
      {children}
    </div>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export default Accordion;
