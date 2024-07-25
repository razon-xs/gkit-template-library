import { useRef, useEffect, createRoot } from '@wordpress/element';
import TemplateLibrary from './components/library/TemplateLibrary';
import TemplateProvider from './provider/TemplateProvider';
import { registerPlugin } from '@wordpress/plugins';
import { subscribe } from '@wordpress/data';
import './style/template-library.scss';

const AddRoot = () => {
	const rootRef = useRef( null );
	const isInitialLoad = useRef( true );
	useEffect( () => {
		if ( ! isInitialLoad.current ) return;

		const unsubscribe = subscribe( () => {
			const wrapper = document.querySelector(
				'.edit-post-header__toolbar, .editor-header__toolbar, .edit-site-header-edit-mode__start'
			);
			if ( ! wrapper ) return;

			let rootElement = document.getElementById(
				'gutenkit-template-library'
			);
			if ( ! rootElement ) {
				rootElement = document.createElement( 'div' );
				rootElement.id = 'gutenkit-template-library';
				wrapper.appendChild( rootElement );
			}

			if ( ! rootRef.current && rootElement ) {
				rootRef.current = createRoot( rootElement );
			}

			if ( rootRef.current ) {
				rootRef.current.render(
					<TemplateProvider>
						<TemplateLibrary />
					</TemplateProvider>
				);
				isInitialLoad.current = false;
			}
		} );

		return () => unsubscribe();
	}, [] );

	return null;
};

registerPlugin( 'gutenkit-template-library', {
	render: AddRoot,
} );
