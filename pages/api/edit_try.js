import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const response = await openai.createEdit({
//     model: "text-davinci-edit-001",
//     input: "What day of the wek is it?",
//     instruction: "Fix the spelling mistakes",
// });

export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message:
                    "OpenAI API key not configured, please follow instructions in README.md",
            },
        });
        return;
    }

    const phrase = req.body.phrase || "";
    if (phrase.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a shorter phrase",
            },
        });
        return;
    }
    const instruct = req.body.instruct || "";
    if (instruct.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a shorter instruction",
            },
        });
        return;
    }

    try {
        const completion = await openai.createEdit({
            model: "text-davinci-edit-001",
            input: generatePrompt(phrase),
            instruction: `${instruct}`,
        });
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
}

function generatePrompt(phrase) {
    const capitalizedPhrase =
        phrase[0].toUpperCase() + phrase.slice(1).toLowerCase();
    return `${capitalizedPhrase}`;
}
