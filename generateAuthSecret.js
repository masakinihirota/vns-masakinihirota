import crypto from "node:crypto";

function generateAuthSecret() {
	console.log("Step 5: Generating AUTH_SECRET...");
	const fx = crypto.randomBytes(32).toString("hex");
	console.log("🚀 ~ generateAuthSecret ~ fx:", fx);
}

generateAuthSecret();
