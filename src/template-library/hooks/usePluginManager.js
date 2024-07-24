import apiFetch from '@wordpress/api-fetch';
import { dispatch as wpDispatch } from '@wordpress/data';
import { useState, useEffect, useRef, useCallback } from '@wordpress/element';

const usePluginManager = ( type, handleImport, setImporting ) => {
	const [ status, setStatus ] = useState( 'Install and Import' );
	const [ pluginData, setPluginData ] = useState( null );
	const importButtonRef = useRef( null );

	const fetchPluginData = useCallback( () => {
		apiFetch( {
			path: `/wp/v2/plugins/gutenkit-blocks-addon/gutenkit-blocks-addon`,
		} )
			.then( ( data ) => {
				setPluginData( data );
				setStatus(
					data.status === 'active'
						? 'Install and Import'
						: 'Activate and Import'
				);
			} )
			.catch( ( error ) => {
				console.warn( 'Activated failed: ', error.message );
			} );
	}, [] );
	const activateGutenkit = useCallback( () => {
		setStatus( 'Activating' );
		apiFetch( {
			path: `/wp/v2/plugins/gutenkit-blocks-addon/gutenkit-blocks-addon`,
			method: 'POST',
			data: { ...pluginData, status: 'active' },
		} )
			.then( ( data ) => {
				setPluginData( data );
				setStatus( 'Activated' );
			} )
			.catch( ( error ) => {
				console.warn( 'Activated failed: ', error.message );
			} );
	}, [ pluginData ] );

	const installAndActivateGutenkit = useCallback( () => {
		setStatus( 'Installing' );
		apiFetch( {
			path: `/wp/v2/plugins?slug=gutenkit-blocks-addon&status=active`,
			method: 'POST',
			parse: false,
		} )
			.then( ( data ) => {
				setPluginData( data );
				setStatus( 'Activated' );
			} )
			.catch( ( error ) => {
				console.warn( 'Install failed: ', error.message );
			} );
	}, [] );

	const handlePluginInstall = useCallback( () => {
		if ( status === 'Install and Import' ) {
			installAndActivateGutenkit();
		} else if ( status === 'Activate and Import' ) {
			activateGutenkit();
		}
	}, [ status, activateGutenkit, installAndActivateGutenkit ] );

	useEffect( () => {
		fetchPluginData();
	}, [ fetchPluginData ] );

	useEffect( () => {
		const importPage = async () => {
			if (
				type?.package === 'free' &&
				status === 'Activated' &&
				importButtonRef.current
			) {
				setImporting( true );
				try {
					await handleImport( type );
					setImporting( false );
					wpDispatch( 'core/editor' ).savePost();
					setTimeout( () => {
						window.location.reload();
					}, 3000 );
				} catch ( error ) {
					console.warn( 'import failed: ', error.message );
					setImporting( false );
				}
			}
		};

		importPage();
	}, [ type, status, handleImport, wpDispatch ] );

	return {
		status,
		handlePluginInstall,
		importButtonRef,
	};
};

export default usePluginManager;
