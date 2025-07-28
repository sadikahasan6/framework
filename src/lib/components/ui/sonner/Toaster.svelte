<script lang="ts" module>
	import "./index.css";
	// visible toasts amount
	const VISIBLE_TOASTS_AMOUNT = 3;

	// Viewport padding
	const VIEWPORT_OFFSET = '24px';

	// Mobile viewport padding
	const MOBILE_VIEWPORT_OFFSET = '16px';

	// Default lifetime of a toasts (in ms)
	const TOAST_LIFETIME = 4000;

	// Default toast width
	const TOAST_WIDTH = 356;

	// Default gap between toasts
	const GAP = 14;

	const DARK = 'dark';
	const LIGHT = 'light';

	type OffsetObject = {
		'--offset-top': string;
		'--offset-right': string;
		'--offset-bottom': string;
		'--offset-left': string;
		'--mobile-offset-top': string;
		'--mobile-offset-right': string;
		'--mobile-offset-bottom': string;
		'--mobile-offset-left': string;
	};

	function getOffsetObject(
		defaultOffset: ToasterProps['offset'],
		mobileOffset: ToasterProps['mobileOffset']
	) {
		const styles = {} as OffsetObject;

		[defaultOffset, mobileOffset].forEach((offset, index) => {
			const isMobile = index === 1;
			const prefix = isMobile ? '--mobile-offset' : '--offset';
			const defaultValue = isMobile
				? MOBILE_VIEWPORT_OFFSET
				: VIEWPORT_OFFSET;

			function assignAll(offset: string | number) {
				['top', 'right', 'bottom', 'left'].forEach((key) => {
					styles[`${prefix}-${key}` as keyof OffsetObject] =
						typeof offset === 'number' ? `${offset}px` : offset;
				});
			}

			if (typeof offset === 'number' || typeof offset === 'string') {
				assignAll(offset);
			} else if (typeof offset === 'object') {
				['top', 'right', 'bottom', 'left'].forEach((key) => {
					const value = offset[key as keyof typeof offset];
					if (value === undefined) {
						styles[`${prefix}-${key}` as keyof OffsetObject] =
							defaultValue;
					} else {
						styles[`${prefix}-${key}` as keyof OffsetObject] =
							typeof value === 'number' ? `${value}px` : value;
					}
				});
			} else {
				assignAll(defaultValue);
			}
		});

		return styles;
	}
</script>

<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { SonnerState, toastState } from './toast-state.svelte';
	import Toast from './Toast.svelte';
	import type { ToasterProps } from './types.js';
	import type { Position } from './types.js';
	import type {
		DragEventHandler,
		FocusEventHandler,
		MouseEventHandler,
		PointerEventHandler
	} from 'svelte/elements';
	import SuccessIcon from './icons/SuccessIcon.svelte';
	import ErrorIcon from './icons/ErrorIcon.svelte';
	import WarningIcon from './icons/WarningIcon.svelte';
	import InfoIcon from './icons/InfoIcon.svelte';
	import CloseIcon from './icons/CloseIcon.svelte';
	import { sonnerContext } from './internal/ctx.js';
	import { on } from 'svelte/events';

	function getInitialTheme(t: string) {
		if (t !== 'system') return t;
		if (typeof window !== 'undefined') {
			if (
				window.matchMedia &&
				window.matchMedia('(prefers-color-scheme: dark)').matches
			) {
				return DARK;
			}

			return LIGHT;
		}

		return LIGHT;
	}

	let {
		invert = false,
		position = 'bottom-right',
		hotkey = ['altKey', 'KeyT'],
		expand = false,
		closeButton = false,
		offset = VIEWPORT_OFFSET,
		mobileOffset = MOBILE_VIEWPORT_OFFSET,
		theme = 'light',
		richColors = false,
		duration = TOAST_LIFETIME,
		visibleToasts = VISIBLE_TOASTS_AMOUNT,
		toastOptions = {},
		dir = 'auto',
		gap = GAP,
		loadingIcon: loadingIconProp,
		successIcon: successIconProp,
		errorIcon: errorIconProp,
		warningIcon: warningIconProp,
		closeIcon: closeIconProp,
		infoIcon: infoIconProp,
		containerAriaLabel = 'Notifications',
		class: className,
		closeButtonAriaLabel = 'Close toast',
		onblur,
		onfocus,
		onmouseenter,
		onmousemove,
		onmouseleave,
		ondragend,
		onpointerdown,
		onpointerup,
		...restProps
	}: ToasterProps = $props();

	function getDocumentDirection(): ToasterProps['dir'] {
		if (dir !== 'auto') return dir;
		if (typeof window === 'undefined') return 'ltr';
		if (typeof document === 'undefined') return 'ltr'; // For Fresh purpose

		const dirAttribute = document.documentElement.getAttribute(
			'dir'
		) as ToasterProps['dir'];

		if (dirAttribute === 'auto' || !dirAttribute) {
			untrack(
				() =>
					(dir =
						(window.getComputedStyle(document.documentElement)
							.direction as ToasterProps['dir']) ?? 'ltr')
			);
			return dir;
		}

		untrack(() => (dir = dirAttribute));
		return dirAttribute;
	}

	const possiblePositions = $derived(
		Array.from(
			new Set(
				[
					position,
					...toastState.toasts
						.filter((toast) => toast.position)
						.map((toast) => toast.position)
				].filter(Boolean)
			)
		) as Position[]
	);

	let expanded = $state(false);
	let interacting = $state(false);
	let actualTheme = $state(getInitialTheme(theme));
	let listRef = $state<HTMLOListElement>();
	let lastFocusedElementRef = $state<HTMLElement | null>(null);
	let isFocusWithin = $state(false);

	const hotkeyLabel = $derived(
		hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')
	);

	$effect(() => {
		if (toastState.toasts.length <= 1) {
			expanded = false;
		}
	});

	// Check for dismissed toasts and remove them. We need to do this to have dismiss animation.
	$effect(() => {
		const toastsToDismiss = toastState.toasts.filter(
			(toast) => toast.dismiss && !toast.delete
		);

		if (toastsToDismiss.length > 0) {
			const updatedToasts = toastState.toasts.map((toast) => {
				const matchingToast = toastsToDismiss.find(
					(dismissToast) => dismissToast.id === toast.id
				);

				if (matchingToast) {
					return { ...toast, delete: true };
				}

				return toast;
			});
			toastState.toasts = updatedToasts;
		}
	});

	$effect(() => {
		return () => {
			if (listRef && lastFocusedElementRef) {
				lastFocusedElementRef.focus({ preventScroll: true });
				lastFocusedElementRef = null;
				isFocusWithin = false;
			}
		};
	});

	onMount(() => {
		toastState.reset();

		const handleKeydown = (event: KeyboardEvent) => {
			const isHotkeyPressed = hotkey.every(
				(key) =>
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(event as any)[key] || event.code === key
			);
			if (isHotkeyPressed) {
				expanded = true;
				listRef?.focus();
			}

			if (
				event.code === 'Escape' &&
				(document.activeElement === listRef ||
					listRef?.contains(document.activeElement))
			) {
				expanded = false;
			}
		};

		return on(document, 'keydown', handleKeydown);
	});

	$effect(() => {
		if (theme !== 'system') {
			actualTheme = theme;
		}

		if (typeof window !== 'undefined') {
			if (theme === 'system') {
				if (
					window.matchMedia &&
					window.matchMedia('(prefers-color-scheme: dark)').matches
				) {
					actualTheme = DARK;
				} else {
					actualTheme = LIGHT;
				}
			}

			const mediaQueryList = window.matchMedia(
				'(prefers-color-scheme: dark)'
			);

			const changeHandler = ({ matches }: MediaQueryListEvent) => {
				actualTheme = matches ? DARK : LIGHT;
			};

			if ('addEventListener' in mediaQueryList) {
				mediaQueryList.addEventListener('change', changeHandler);
			} else {
				// @ts-expect-error deprecated API
				mediaQueryList.addListener(changeHandler);
			}
		}
	});

	const handleBlur: FocusEventHandler<HTMLOListElement> = (event) => {
		onblur?.(event);
		if (
			isFocusWithin &&
			!event.currentTarget.contains(event.relatedTarget as HTMLElement)
		) {
			isFocusWithin = false;
			if (lastFocusedElementRef) {
				lastFocusedElementRef.focus({ preventScroll: true });
				lastFocusedElementRef = null;
			}
		}
	};

	const handleFocus: FocusEventHandler<HTMLOListElement> = (event) => {
		onfocus?.(event);
		const isNotDismissable =
			event.target instanceof HTMLElement &&
			event.target.dataset.dismissable === 'false';

		if (isNotDismissable) return;

		if (!isFocusWithin) {
			isFocusWithin = true;
			lastFocusedElementRef = event.relatedTarget as HTMLElement;
		}
	};

	const handlePointerDown: PointerEventHandler<HTMLOListElement> = (
		event
	) => {
		onpointerdown?.(event);
		const isNotDismissable =
			event.target instanceof HTMLElement &&
			event.target.dataset.dismissable === 'false';

		if (isNotDismissable) return;
		interacting = true;
	};

	const handleMouseEnter: MouseEventHandler<HTMLOListElement> = (event) => {
		onmouseenter?.(event);
		expanded = true;
	};

	const handleMouseLeave: MouseEventHandler<HTMLOListElement> = (event) => {
		onmouseleave?.(event);
		if (!interacting) {
			expanded = false;
		}
	};

	const handleMouseMove: MouseEventHandler<HTMLOListElement> = (event) => {
		onmousemove?.(event);
		expanded = true;
	};

	const handleDragEnd: DragEventHandler<HTMLOListElement> = (event) => {
		ondragend?.(event);
		expanded = false;
	};

	const handlePointerUp: PointerEventHandler<HTMLOListElement> = (event) => {
		onpointerup?.(event);
		interacting = false;
	};

	sonnerContext.set(new SonnerState());
</script>

<!-- eslint-disable-next-line svelte/valid-compile -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	aria-label="{containerAriaLabel} {hotkeyLabel}"
	tabindex={-1}
	aria-live="polite"
	aria-relevant="additions text"
	aria-atomic="false"
>
	{#if toastState.toasts.length > 0}
		{#each possiblePositions as position, index (position)}
			{@const [y, x] = position.split('-')}
			{@const offsetObject = getOffsetObject(offset, mobileOffset)}
			<!-- eslint-disable-next-line svelte/valid-compile -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ol
				tabindex={-1}
				dir={getDocumentDirection()}
				bind:this={listRef}
				class={className}
				data-sonner-toaster
				data-sonner-theme={actualTheme}
				data-y-position={y}
				data-x-position={x}
				style:--front-toast-height={`${toastState.heights[0]?.height}px`}
				style:--width={`${TOAST_WIDTH}px`}
				style:--gap={`${gap}px`}
				style:--offset-top={offsetObject['--offset-top']}
				style:--offset-right={offsetObject['--offset-right']}
				style:--offset-bottom={offsetObject['--offset-bottom']}
				style:--offset-left={offsetObject['--offset-left']}
				style:--mobile-offset-top={offsetObject['--mobile-offset-top']}
				style:--mobile-offset-right={offsetObject[
					'--mobile-offset-right'
				]}
				style:--mobile-offset-bottom={offsetObject[
					'--mobile-offset-bottom'
				]}
				style:--mobile-offset-left={offsetObject[
					'--mobile-offset-left'
				]}
				style={restProps.style}
				onblur={handleBlur}
				onfocus={handleFocus}
				onmouseenter={handleMouseEnter}
				onmousemove={handleMouseMove}
				onmouseleave={handleMouseLeave}
				ondragend={handleDragEnd}
				onpointerdown={handlePointerDown}
				onpointerup={handlePointerUp}
				{...restProps}
			>
				{#each toastState.toasts.filter((toast) => (!toast.position && index === 0) || toast.position === position) as toast, index (toast.id)}
					<Toast
						{index}
						{toast}
						defaultRichColors={richColors}
						duration={toastOptions?.duration ?? duration}
						class={toastOptions?.class ?? ''}
						descriptionClass={toastOptions?.descriptionClass || ''}
						{invert}
						{visibleToasts}
						{closeButton}
						{interacting}
						{position}
						style={toastOptions?.style ?? ''}
						classes={toastOptions.classes || {}}
						unstyled={toastOptions.unstyled ?? false}
						cancelButtonStyle={toastOptions?.cancelButtonStyle ??
							''}
						actionButtonStyle={toastOptions?.actionButtonStyle ??
							''}
						closeButtonAriaLabel={toastOptions?.closeButtonAriaLabel ??
							closeButtonAriaLabel}
						expandByDefault={expand}
						{expanded}
						loadingIcon={loadingIconProp}
					>
						{#snippet successIcon()}
							{#if successIconProp}
								{@render successIconProp?.()}
							{:else if successIconProp !== null}
								<SuccessIcon />
							{/if}
						{/snippet}

						{#snippet errorIcon()}
							{#if errorIconProp}
								{@render errorIconProp?.()}
							{:else if errorIconProp !== null}
								<ErrorIcon />
							{/if}
						{/snippet}

						{#snippet warningIcon()}
							{#if warningIconProp}
								{@render warningIconProp?.()}
							{:else if warningIconProp !== null}
								<WarningIcon />
							{/if}
						{/snippet}

						{#snippet infoIcon()}
							{#if infoIconProp}
								{@render infoIconProp?.()}
							{:else if infoIconProp !== null}
								<InfoIcon />
							{/if}
						{/snippet}

						{#snippet closeIcon()}
							{#if closeIconProp}
								{@render closeIconProp?.()}
							{:else if closeIconProp !== null}
								<CloseIcon />
							{/if}
						{/snippet}
					</Toast>
				{/each}
			</ol>
		{/each}
	{/if}
</section>


