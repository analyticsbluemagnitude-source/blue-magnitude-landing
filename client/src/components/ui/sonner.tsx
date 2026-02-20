import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      duration={4000}
      closeButton
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(142.1 76.2% 36.3%)",
          "--success-text": "hsl(0 0% 100%)",
          "--error-bg": "hsl(0 84.2% 60.2%)",
          "--error-text": "hsl(0 0% 100%)",
          "--info-bg": "hsl(221.2 83.2% 53.3%)",
          "--info-text": "hsl(0 0% 100%)",
          "--warning-bg": "hsl(38 92% 50%)",
          "--warning-text": "hsl(0 0% 100%)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
