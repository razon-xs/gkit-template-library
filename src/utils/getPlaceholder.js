import Placeholder from "../images/placeholder.png";

const getPlaceholder = () => {
	const placeholderURL = new URL(Placeholder, window.location.origin);
	return placeholderURL.href;
}
export default getPlaceholder;