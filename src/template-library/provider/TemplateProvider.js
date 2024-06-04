import Context from "../context";
import { useReducer } from "@wordpress/element";
import { initialState, reducer } from "../reducers";

const TemplateProvider = ({ children }) => {
	const isProActive = false
	const version = '3.1.4'

	const payload = {
		version: version,
		auth: 'gutenkit',
		premium: isProActive
	};

	const [state, dispatch] = useReducer(reducer, initialState);

	const newData = {
		...state,
		payload
	};

	return (
		<Context.Provider value={{ ...newData, dispatch }}>
			{children}
		</Context.Provider>
	)
}

export default TemplateProvider;
