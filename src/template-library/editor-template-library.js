import { useRef, useEffect, useState } from '@wordpress/element';
import { createRoot } from 'react-dom/client';
import TemplateLibrary from './components/library/TemplateLibrary';
import TemplateProvider from './provider/TemplateProvider';
import { registerPlugin } from '@wordpress/plugins';
import { subscribe } from '@wordpress/data';
import './style/template-library.scss';

const AddRoot = () => {
	const [ firstLoad, setFirstLoad ] = useState( true );

	useEffect( () => {
		const editorWindow = window.frames[ 'editor-canvas' ] || window;
		const { document } = editorWindow;

		if ( ! firstLoad ) return;
		const renderButton = ( selector ) => {
			const patternButton = document.createElement( 'div' );
			patternButton.classList.add( 'is-post-editor' );
			patternButton.id = 'gutenkit-template-library';
			selector.appendChild( patternButton );

			const root = createRoot( patternButton );
			root.render(
				<TemplateProvider>
					<TemplateLibrary />
				</TemplateProvider>
			);
		};

		const unsubscribe = subscribe( () => {
			const getEl = ( selector ) => document.querySelector( selector );
			const editToolbar =
				getEl( '.edit-post-header__toolbar' ) ||
				getEl( '.editor-header__toolbar' ) ||
				getEl( '.edit-site-header-edit-mode__start' );
			if ( ! editToolbar ) {
				return;
			}

			if (
				! editToolbar.querySelector( '#gutenkit-template-library' ) &&
				firstLoad
			) {
				setFirstLoad( false );
				renderButton( editToolbar );
			}
		} );
	}, [ firstLoad ] );

	return null;
};

registerPlugin( 'gutenkit-template-library', {
	render: AddRoot,
} );
