import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
import 'dotenv/config';
const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected!'));

const Schema = mongoose.Schema;
app.use(express.json());
app.use(cors({origin: 'http://localhost:5173'}));

const TodoSchema = new Schema({
    task: String,
    taskDone: {type:Boolean, default:false},
    isUpperCase: {type:Boolean, default:false},
});

const TodoTask = mongoose.model('TodoTask', TodoSchema);


app.post("/todos", async (req, res) => {
    try {
        const { task, taskDone } = req.body;
        const newTodo = new TodoTask({ task, taskDone });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error("Error saving todo:", err);
        res.status(500).send("Error saving todo");
    }
});

app.get("/todos", async(req, res) => {
    try {
        const todos = await TodoTask.find();
        res.json(todos);
    }catch(err){
        console.error(err);
    }
 
});

// Delete Route
app.delete('/todos/:id', async (req, res) => {
    const todoId = req.params.id;
  
    // Perform the delete operation in your database
    try {
      await TodoTask.findByIdAndDelete(todoId);
      res.status(200).send('Item deleted successfully');
    } catch (err) {
      res.status(500).send('Error deleting item',err);
    }
});

app.put('/todos/update1/:id' ,async (req,res)=>{
    const todoId = req.params.id;
    const updatedTodo = req.body;
    try{
        await TodoTask.findByIdAndUpdate(todoId ,updatedTodo ,{new:true});
        res.status(200);
    } catch(err){
        res.status(500).send('Error updating todo',err);
    }
});

app.put('/todos/update2/:id' ,async (req,res)=>{
    const todoId = req.params.id;
    const updatedData = req.body;

    try{
        await TodoTask.findByIdAndUpdate(todoId ,updatedData ,{new:true});
        res.status(200).send(updatedData);
    } catch(err){
        res.status(500).send('Error updating todo',err);
    }
});

app.delete('/todos', async (req,res)=>{
    try{
        await TodoTask.deleteMany({});
        res.json({});
        res.status(200);
    } catch(err){
        res.status(500);
    }
})


app.listen(port, () => {
    console.log(`server is listen to server http://localhost:${port}`);
})