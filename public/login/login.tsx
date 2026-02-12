import { createRoot } from "react-dom/client";

import "@public/global.css";

function App() {
	return (
		<main>
			<p>My Login Page</p>
		</main>
	);
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
