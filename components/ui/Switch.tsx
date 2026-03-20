import * as SwitchPrimitive from '@rn-primitives/switch';
import { Platform } from 'react-native';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'h-6 w-11 shrink-0 rounded-full border-2 border-transparent',
        props.checked ? 'bg-primary' : 'bg-input',
        props.disabled && 'opacity-50',
        Platform.select({
          web: 'cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed',
        }),
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'h-5 w-5 rounded-full bg-background shadow-md shadow-foreground/5',
          props.checked ? 'translate-x-5' : 'translate-x-0',
          Platform.select({ web: 'pointer-events-none transition-transform' }),
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
