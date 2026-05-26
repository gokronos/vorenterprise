(function () {
	if (document.querySelector('link[data-vor-theme]')) {
		return;
	}
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = '/brand-theme.css';
	link.setAttribute('data-vor-theme', '1');
	document.head.appendChild(link);
})();
