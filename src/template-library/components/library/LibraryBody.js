import useContextLibrary from "../../hooks/useContextLibrary";
import Pages from "../page/Pages";
import Patterns from "../pattern/Patterns";
import Templates from "../template/Templates";
import SinglePage from "../template/SinglePage";

const LibraryBody = () => {
	const { showSinglePage, templateType } = useContextLibrary();

	return (
		<div className="interface-interface-skeleton__body gutenkit-library-body">
			<div className="interface-interface-skeleton__content gutenkit-library-body-content">
				<div className="gutenkit-library-body-content__inner">
					{
						showSinglePage ? <SinglePage /> : templateType === 'pages' ? <Pages /> : templateType === 'patterns' ? <Patterns /> : templateType === 'templates' ? <Templates /> : ''
					}
				</div>
			</div>
		</div>
	);
};

export default LibraryBody;