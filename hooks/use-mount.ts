import { useEffect, useState } from "react";

/*
 * useMount
 *
 * Returns `true` after the component has been mounted on the client.
 *
 * Use Cases:
 * - Prevent hydration mismatches in SSR applications.
 * - Render client-only components after mount.
 * - Delay browser-specific logic until the DOM is available
 *   (e.g. localStorage, window, document, matchMedia).
 * - Conditionally render content that should only appear after
 *   the initial client render.
 *
 * Returns:
 * - false: Before the component has mounted.
 * - true: After the component has mounted.
 */
export function useMount(): boolean {
    const [mount, setMount] = useState(false)
    useEffect(() => setMount(true), [])
    return mount
}