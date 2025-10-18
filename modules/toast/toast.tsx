import { Toaster } from "sonner";
import * as Portal from "@radix-ui/react-portal";

export default function Toast() {
  return (
    <Portal.Root>
      <Toaster
        className="pointer-events-auto"
        visibleToasts={5}
        position="top-right"
        gap={16}
        toastOptions={{
          duration: 5000,
          style: {
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
          },
        }}
      />
    </Portal.Root>
  );
}