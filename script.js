let model = null;  // Global variable to store the model

document.getElementById("classifyBtn").disabled = true; // Disable at start

async function loadModel() {
    try {
        console.log("Loading MobileNet model...");
        model = await mobilenet.load();
        console.log("Model loaded successfully!");
        document.getElementById("status").innerText = "Model Ready!";
        document.getElementById("classifyBtn").disabled = false; // Enable button
    } catch (error) {
        console.error("Error loading model:", error);
        document.getElementById("status").innerText = "Model failed to load!";
    }
}


// Ensure model is loaded before classifying
document.getElementById("classifyBtn").addEventListener("click", async () => {
    console.log("Classify button clicked!");

    if (!model) {
        console.error("Model is not loaded yet.");
        document.getElementById("status").innerText = "Error: Model not loaded!";
        return;
    }

    console.log("Fetching image for classification...");
    const img = document.getElementById("uploadedImage");
    document.getElementById("status").innerText = "Classifying...";

    try {
        console.log("Running model classification...");
        const predictions = await model.classify(img);
        console.log("Model Predictions:", predictions);

        let resultText = "It's not a Knife";
        const knifeKeywords = ["knife", "cleaver", "chopper", "cutlery", "dagger", "blade"];

        for (let pred of predictions) {
            let label = pred.className.toLowerCase().trim();
            let probability = pred.probability;

            console.log(`Checking label: "${label}" | Probability: ${probability}`);

            if (probability > 0.2) {  // Adjusted threshold
                for (let keyword of knifeKeywords) {
                    if (label.includes(keyword)) {
                        console.log(`Matched keyword: "${keyword}" in "${label}"`);
                        resultText = "It's a Knife";
                        break;
                    }
                }
            }
        }

        console.log(`Final Decision: ${resultText}`);
        document.getElementById("result").innerText = resultText;
    } catch (error) {
        console.error("Error during classification:", error);
        document.getElementById("status").innerText = "Error during classification!";
    }

    document.getElementById("status").innerText = "Classification Complete.";
});





// Call the function to load the model
loadModel();
