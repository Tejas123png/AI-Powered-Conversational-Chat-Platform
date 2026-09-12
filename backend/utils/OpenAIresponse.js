import "dotenv/config";

const getAIresponse= async (message)=>{
app.post("/test", async (req, res) => {
  try {
    const prompt = req.body.message || "Hello!";
    const options={
        method:"POST",
        headers:[{
            "x-goog-api-key" : "$GEMINI_API_KEY",
            "Content-Type":"application/json"
    }],
    body:JSON.stringify({
        "model": "gemini-3.6-flash",
        "input": "Hello, how are you?"
    })
    }
   
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
try{
  const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: message
});
return response.text;


}catch(err){
    console.log(err)
}
}
export default getAIresponse;