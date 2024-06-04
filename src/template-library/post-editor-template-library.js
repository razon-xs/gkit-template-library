import { createRoot, useRef, useEffect } from '@wordpress/element';
import TemplateLibrary from './components/library/TemplateLibrary';
import TemplateProvider from './provider/TemplateProvider';
import { registerPlugin } from '@wordpress/plugins';
import {
	__experimentalFullscreenModeClose as FullscreenModeClose,
	__experimentalMainDashboardButton as MainDashboardButton,
} from '@wordpress/edit-post';
import "./style/template-library.scss";

const AddRoot = () => {
	const libraryRef = useRef(null);
	useEffect(() => {
		const library = libraryRef?.current;
		if (library) {
			const rootParent = library.closest(".edit-post-header");
			if (rootParent) {
				const root = rootParent.querySelector(".edit-post-header__toolbar");
				root.appendChild(library);
				createRoot(library).render(
					<TemplateProvider>
						<TemplateLibrary />
					</TemplateProvider>
				);
			}
		}
	}, [libraryRef.current])
	return (
		<MainDashboardButton>
			<div id="gutenkit-template-library" ref={libraryRef} className='is-post-editor'></div>
			<FullscreenModeClose />
		</MainDashboardButton>
	);
}

registerPlugin('gutenkit-template-library', {
	render: AddRoot,
});
