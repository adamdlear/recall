import { createRoot } from "react-dom/client";

import "@public/global.css";
import { Button } from "@components/ui/button";

function App() {
	return (
		<main>
			<p>My Login Page</p>
			<a>
				<Button>Login with Provider</Button>
			</a>
		</main>
	);
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
