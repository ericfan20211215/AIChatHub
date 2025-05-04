import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORGANIZATION_ID,
});
export default openai;
//# sourceMappingURL=openai-config.js.map