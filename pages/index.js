import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [instructInput, setInstructInput] = useState("");
    const [phraseInput, setPhraseInput] = useState("");
    const [phraseButton, setPhraseButton] = useState(false);
    const [editResult, setEditResult] = useState();
    const [instructResult, setInstructResult] = useState();

    async function onSubmitInstruction(event) {
        event.preventDefault();
        try {
            // console.log(`Inside onSubmitInstruction: ${phraseButton}`);
            setPhraseButton(true);
            // console.log(`Inside onSubmitInstruction2: ${phraseButton}`);
            setInstructResult(`${instructInput}`);
            setInstructInput("");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }
    async function onSubmitPhrase(event) {
        event.preventDefault();
        try {
            // if (!phraseButton) {
            //     throw (
            //         new Error(`Please provide a valid instruction first`),
            //     );
            // }
            const response = await fetch("/api/edit_try", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phrase: phraseInput,
                    instruct: instructResult,
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

            setEditResult(data.editResult);
            setPhraseInput("");
            setPhraseButton(false);
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
                <h3>How should I edit?</h3>
                <form onSubmit={onSubmitInstruction}>
                    <input
                        type="text"
                        name="instruct"
                        placeholder="Enter your instruction for editing"
                        value={instructInput}
                        onChange={(e) => setInstructInput(e.target.value)}
                    />
                    <input type="submit" value="Confirm Instruction" />
                </form>
                <div className={styles.result}>{instructResult}</div>
                <h3>Edit thy thought!</h3>
                <form onSubmit={onSubmitPhrase}>
                    <input
                        type="text"
                        name="phrase"
                        placeholder="Enter a phrase to edit"
                        value={phraseInput}
                        onChange={(e) => setPhraseInput(e.target.value)}
                    />
                    <input
                        type="submit"
                        value="Edit now"
                        disabled={phraseButton}
                    />
                </form>
                <div className={styles.result}>{editResult}</div>
            </main>
        </div>
    );
}
