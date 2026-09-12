import express from "express";
import Thread from "../models/thread.js";
const router=express.Router();
//test
router.post("/test", async (req,res)=>{
    try{
        const thread=new  Thread({
            thread_id:"abc123",
            title:"testing route2"
        })
        const response= await thread.save()
        res.send(response)
    }catch{
        res.status(500).json({error:"faield to send to db"})
    }
})
//get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ upload_at: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json("error");
    }
});
router.get("/thread/:id", async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread);}
        catch(err){
        console.log(err);
        res.status(500).json("error");
    }
        }

router,.delete("/thread/:id", async (req, res) => {
    const deleteThread=Thread.findByIdAndDelete(req.params.id);
     if(!deleteThread){
        return res.status(404).json({error:"Thread not found"})
     }
     res.json({message:"Thread deleted successfully"})
    }catch(err){
        res.status(500).json({error:"Failed to delete thread"})
    }
export default router;