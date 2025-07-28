import { SonnerState } from '$lib/components/ui/sonner/toast-state.svelte';
import { Context } from 'runed';

export const richColorsContext = new Context<{ setRichColors: (value: boolean) => void }>(
	'richColorsContext'
);

export const sonnerContext = new Context<SonnerState>('<Toaster/>');
