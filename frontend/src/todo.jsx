import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './todo.css';
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';

export default function TodoList() {
    let [todos, setTodos] = useState([]);
    let [newTodo, setNewTodo] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/todos')
            .then(res => setTodos(res.data));
    }, []);


    let addNewTsk = async () => {
        const options = {
            url: 'http://localhost:8080/todos',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: { _id: uuidv4(), task: newTodo, taskDone: false, isUpperCase: false }
        };
        try {
            let res = await axios(options);
            console.log('Data inserted:', res.data);
            setTodos([...todos, res.data]);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
        setNewTodo("");
    };

    let updateTododValue = (prevTodo) => {
        setNewTodo(prevTodo.target.value);
    };

    let deleteTodo = (todoId) => {
        try {
            axios.delete(`http://localhost:8080/todos/${todoId}`);
            setTodos(todos.filter(todo => todo._id !== todoId));
        } catch (err) {
            console.log("error deleting todo:", err);
        }
    };

    let clearTodo = async () => {
        try {
            await axios.delete(`http://localhost:8080/todos`);
        } catch (err) {
            console.log("error deleting todo:", err);
        }
        setTodos([]);
    }

    let upperCaseOne = async (todoId) => {
       try{
        const updateTodo = {
            isUpperCase: !todos.find((todo) => todo._id === todoId).isUpperCase,
        }
        let responce = await axios.put(`http://localhost:8080/todos/update1/${todoId}`,updateTodo);
        if (responce.status === 200) { console.log("taskdone updated") };
        setTodos((prevTodos) =>prevTodos.map((prevTodo) =>
            (todoId === prevTodo._id ? { ...prevTodo,  task: prevTodo.task.toUpperCase(),isUpperCase: !prevTodo.isUpperCase, } : prevTodo))
          );
       } catch (error) {
        console.error('Error updating item:', error);
    }
    };

    let doneTask = async (todoId) => {
        try {
            const updateData = {
                taskDone: !todos.find((todo) => todo._id === todoId).taskDone,
            }
            let responce = await axios.put(`http://localhost:8080/todos/update2/${todoId}`, updateData);
            if (responce.status === 200) { console.log("taskdone updated") }
            setTodos((prevTodos) => prevTodos.map((prevTodo) =>
                prevTodo._id === todoId ? { ...prevTodo, taskDone: !prevTodo.taskDone } : prevTodo
            ));
        } catch (error) {
            console.error('Error updating item:', error);
        }

    }

    return (
        <div style={{ border: 'none', padding: '100px', borderRadius: '20px', background: '#343434' }}>
            <TextField sx={{
                '& .MuiInputBase-root': {
                    backgroundColor: 'none', // Change background color
                },
                '& .MuiInput-underline:after': {
                    borderColor: 'white', // Change this to your desired color
                },
                '& .MuiInput-underline:before': {
                    borderColor: 'white', // Change this to your desired color
                },
                '& .MuiInputLabel-root': {
                    color: 'white', // Change label color 
                },
                input: {
                    color: 'white', // Change the color here
                },
            }} id="standard-basic" label="New-Task" type="text" variant="standard" value={newTodo} name="task" onChange={updateTododValue} />
            <br /><br />
            <Button variant="outlined" onClick={addNewTsk} sx={{ color: 'white', borderColor: 'ActiveCaption' }} color="primary" >Add Task</Button>
            <br /><br /><br /><br />
            <hr />
            <h3>Task-List</h3>
            <ul>
                {todos.map(todo => (
                    <div className="task-a" key={todo._id}>
                        <Accordion
                            sx={{
                                background: 'none', '& .MuiInputBase-root': {
                                    border: 'white'
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                                sx={{ color: 'white' }}
                            >
                                <li key={todo._id} style={{ textDecoration: todo.taskDone ? 'line-through' : 'none' ,textTransform:todo.isUpperCase ?'uppercase' : 'none' }}>{todo.task}</li>
                            </AccordionSummary>
                            <AccordionActions key={todo._id}>
                                <Button onClick={() => deleteTodo(todo._id)}>Delete</Button>
                                <Button onClick={() => upperCaseOne(todo._id)} >UpperCaseOne</Button>
                                <Button onClick={() => doneTask(todo._id)} >task Done</Button>
                            </AccordionActions>
                        </Accordion>
                    </div>

                ))
                }
            </ul>
            <Button onClick={clearTodo} variant="outlined" sx={{ color: 'white', borderColor: 'ActiveCaption' }}>Clear Todo</Button>
        </div>
    )
}