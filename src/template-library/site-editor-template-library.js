import domReady from '@wordpress/dom-ready';
import TemplateLibrary from './components/library/TemplateLibrary';
import TemplateProvider from './provider/TemplateProvider';
import { createRoot } from '@wordpress/element';
import "./style/template-library.scss";

domReady(() => {
	function waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					observer.disconnect();
					resolve(document.querySelector(selector));
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	waitForElm('.edit-site-header-edit-mode__start').then((elm) => {
		const root = document.createElement('div');
		root.id = 'gutenkit-template-library';
		elm.appendChild(root);

		createRoot(document.getElementById('gutenkit-template-library')).render(
			<TemplateProvider>
				<TemplateLibrary />
			</TemplateProvider>
		);
	})
})