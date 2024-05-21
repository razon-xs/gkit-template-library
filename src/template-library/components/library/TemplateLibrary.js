import { Button } from '@wordpress/components';
import { createPortal, useEffect, useCallback } from '@wordpress/element';
import classnames from 'classnames';
import LibraryHeader from './LibraryHeader';
import LibraryBody from './LibraryBody';
import useContextLibrary from '../../hooks/useContextLibrary';
import GLogo from '../icons/GLogo';

function TemplateLibrary({ className }) {
	const { dispatch, loadLibrary } = useContextLibrary();
	const toggleLibrary = useCallback(() => {
		dispatch({
			type: 'SET_LOAD_LIBRARY',
			loadLibrary: !loadLibrary,
		});
	}, [dispatch, loadLibrary]);

	useEffect(() => {
		const mainEditor = document.querySelector('.interface-interface-skeleton__editor:not(.gutenkit-template-library)');
		const logo = document.querySelector('.edit-site-layout .edit-site-layout__hub');

		if (loadLibrary) {
			mainEditor?.classList.add('hide-editor');
			logo?.classList.add('hide-editor');
		} else {
			mainEditor?.classList.remove('hide-editor');
			logo?.classList.remove('hide-editor');
		}
	}, [loadLibrary]);

	return (
		<>
			<Button
				icon={<GLogo />}
				iconSize={16}
				onClick={toggleLibrary}
				className="gutenkit-template-library-btn"
				variant="primary"
			>
				Template Library
			</Button>
			{loadLibrary && createPortal(
				<div className={classnames('interface-interface-skeleton__editor', 'gutenkit-template-library', className)}>
					<LibraryHeader />
					<LibraryBody />
				</div>,
				document.querySelector('.interface-interface-skeleton')
			)}
		</>
	);
}

export default TemplateLibrary;
