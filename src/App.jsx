import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRef, useState } from "react";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const genAI = new GoogleGenerativeAI("AIzaSyByNdIJ2UPr6DKa3UYSbjPf5UJKXbaRy_A");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const App = () => {
	const [chat, useChat] = useState([
		{
			entity: "ai",
			message: "How can I help you today?",
		},
	]);
	const prompt = useRef();
	const getPrompt = async () => {
		console.log(...chat);
		useChat((ele) => [
			...ele,
			{
				entity: "user",
				message: prompt.current.value,
			},
		]);
		const result = await model.generateContent(prompt.current.value);
		const response = result.response;
		useChat((ele) => [
			...ele,
			{
				entity: "ai",
				message: marked.parse(response.text()),
			},
		]);
		console.log(response);
	};
	return (
		<div className="w-screen h-screen p-54 flex items-center justify-center bg-gradient-to-bl from-amber-600 to-amber-800 text-amber-50">
			<div className="container flex flex-col w-3/4 h-3/4 bg-stone-900 rounded-xl shadow-xl ring-1 ring-stone-700">
				<div className="textarea flex flex-col grow px-10 overflow-auto py-5 gap-3 h-full w-full">
					{chat.map((ele) => {
						if (ele.entity == "user") {
							return (
								<div className="person-message self-end rounded-xl rounded-tr-none bg-amber-900 max-w-[850px]  h-fit">
									<h1 className="w-full py-2 font-medium bg-amber-950 rounded-tl-xl px-4">
										You
									</h1>
									<p className="px-4 py-2">{ele.message}</p>
								</div>
							);
						}
						if (ele.entity == "ai") {
							return (
								<div className="ai-message self-start rounded-xl rounded-tl-none  bg-amber-700 max-w-[850px]  h-fit">
									<h1 className="w-full py-2 font-medium bg-amber-900 rounded-tr-xl px-4">
										Gemini Pro
									</h1>
									<p
										className="px-4 py-2"
										dangerouslySetInnerHTML={{
											__html: ele.message,
										}}
									></p>
								</div>
							);
						}
					})}
				</div>
				<div className="prompt p-5 w-full rounded-b-xl bg-stone-800 flex items-center justify-center gap-5 sticky bottom-0">
					<input
						type="text"
						ref={prompt}
						className="bg-stone-700 grow rounded-xl text-xl px-5 py-2 outline-none text-amber-100"
					/>
					<div
						className="bg-amber-600 px-4 py-3 rounded-xl"
						onClick={getPrompt}
					>
						<i
							className={
								chat[chat.length - 1].entity == "user"
									? "fa-solid fa-circle-notch animate-spin"
									: "fa-arrow-up fa-solid font-bold px-1"
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default App;
