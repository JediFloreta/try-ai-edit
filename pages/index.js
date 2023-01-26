import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [instructInput, setInstructInput] = useState("");
    const [phraseInput, setPhraseInput] = useState("");
    const [result, setResult] = useState();

    async function onSubmit(event) {
        event.preventDefault();
        console.log(instructInput);
        console.log(phraseInput);
        try {
            const response = await fetch("/api/edit_try", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    instruct: instructInput,
                    phrase: phraseInput,
                }),
                // const response = await fetch("/api/generate", {
                //   method: "POST",
                //   headers: {
                //     "Content-Type": "application/json",
                //   },
                //   body: JSON.stringify({ animal: animalInput }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                );
            }

            setResult(data.result);
            setInstructInput("");
            setPhraseInput("");
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
            <Head>
                <title>OpenAI Quickstart</title>
                <link rel="icon" href="/dog.png" />
            </Head>

            <main className={styles.main}>
                <img src="/dog.png" className={styles.icon} />
                <h3>Edit thy thought!</h3>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="phrase"
                        placeholder="Enter an instruction"
                        value={instructInput}
                        onChange={(e) => setInstructInput(e.target.value)}
                    />
                    <textarea
                        type="text"
                        name="phrase"
                        placeholder="Enter a phrase to edit"
                        value={phraseInput}
                        onChange={(e) => setPhraseInput(e.target.value)}
                    />
                    <input type="submit" value="Edit now" />
                </form>
                <div className={styles.result}>{result}</div>
            </main>
        </div>
    );
}
