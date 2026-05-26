'use client';

import { useEffect } from 'react';

export default function LegacyVParamCleaner() {
	useEffect(() => {
		const url = new URL(window.location.href);
		if (!url.searchParams.has('v')) {
			return;
		}

		url.searchParams.delete('v');
		const nextUrl = `${url.pathname}${url.search}${url.hash}`;
		window.history.replaceState(window.history.state, '', nextUrl || '/');
	}, []);

	return null;
}
