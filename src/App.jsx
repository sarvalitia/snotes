import logo from './logo.svg';
import './App.css';
import {Amplify, API,graphqlOperation} from 'aws-amplify';
import { Authenticator, TextField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { useEffect, useState } from 'react';
import { listTodos } from './graphql/queries';
import { deleteTodo } from './graphql/mutations';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { updateTodo } from './graphql/mutations';
import { createTodo } from './graphql/mutations';
import {v4 as uuid} from 'uuid';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
Amplify.configure(awsExports);



export default function App() {
  useEffect(()=>
  {fetchNotes()
  },[])
  
  const [notes,setNodes]=useState([]);
  const [edit,setEdit]=useState('');
  const [up,setUp]=useState('');
  const [uphap,setuphap]=useState(0);
  const [showAdd,setShowAdd]=useState(true);

  const noteUpdate =async(id,val)=>{

    try{
      console.log(val);
      const n=notes[id];
      n.note=val;
      delete n.createdAt;
      delete n.updatedAt;
        const res=await API.graphql(graphqlOperation(updateTodo,{input:n}));
        const y=[...notes];
        y[id]=res.data.updateTodo;
        
        setNodes(y);
        setEdit('');
        setuphap(0);

    }
    catch(err){
      console.log(err);
    }

  }

  const deleteNote= async(idx)=>{
    try{
        const trashNode={
          "id":notes[idx].id
        };
        const x=await API.graphql(graphqlOperation(deleteTodo,{input:trashNode}));
   
       const oldNotes=[...notes];
       oldNotes.splice(idx,1);
       console.log(oldNotes);
        setNodes(oldNotes);
       

    }
    catch(err){
      console.log("error");
      console.log(err);
    }
  }
  
  const fetchNotes= async ()=>{
  try{
     const notesData= await API.graphql(graphqlOperation(listTodos));
     const notesList=notesData.data.listTodos.items;
     console.log('notes list',notesList);
     setNodes(notesList);
  }
  catch(err){
    console.log(err);
  }
}



  return (
      <Authenticator>
            {({ signOut, user }) => (
              <main>
                <div className="App">
                  <header className="App-header">
                  <h3>Sarvanotez</h3>
                  </header>
               
                  <div className='up'>
                  
      {showAdd?
      <IconButton onClick={()=>{setShowAdd(false)}}>
      <p>Add</p>
      <AddIcon />
      </IconButton>
      :<AddNewNote onUpFun={()=>{
        fetchNotes();
        setShowAdd(true);
      }}/>}
       <IconButton onClick={signOut}>
      <p>Exit</p>
     <ExitToAppIcon/>
     </IconButton>

      </div>
      <div className='tes'>
      <div className='NotesList'>
      <Container>
      <Row>
            {notes.map((note,idx)=>{
              
                return (
                 <Col>
                  <Box key={idx}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
       
        '& > :not(style)': {
          m: 1,
          width:300,
          
          
        },
      }}
    >
    
      <Paper elevation={5} key={idx}>
        <div className='cardd'>
        <div>
          <div className='notetitle'>
            {note.notename}
          </div>
          <div className='note'>
              {note.note}
          </div>
        </div>

      <div className='editdel'>
        {edit === idx? 
        <div>
          <TextField defaultValue={note.note} 
       
           onChange={(val)=>{setUp(val.target.value);setuphap(1)}}/>

        <IconButton onClick={()=>{uphap===1?noteUpdate(idx,up):noteUpdate(idx,note.note)}}>
        <FileUploadIcon/>
        </IconButton>
        </div>:
        
        <IconButton onClick={()=>{setEdit(idx)}}>
        <ModeEditIcon/>
        </IconButton>

     


        
        }

        <IconButton aria-label='Delete' onClick={()=>{deleteNote(idx)}}>
        <DeleteIcon/>
        </IconButton>

        </div>

        </div>
      </Paper>
     
    </Box>
  </Col>
    
                )
            })}
            </Row>
            </Container>
     
           
      </div>
      </div>
      
     
    </div>
    </main>
  )}
</Authenticator>
)}

const AddNewNote=({onUpFun})=>{

  const [newNoteData,setNewNoteData]=useState({});

  const upload=async (data)=>{
      const res={
        id:uuid(),
        notename:data.notename,
        note:data.note
      }

      await API.graphql(graphqlOperation(createTodo,{input:res}))
      onUpFun();

  }
  return(
    <div className='newNote'>
    <Paper elevation={3}>
    <div className='card'>
    <TextField
      label="Title"
      onChange={(e)=>{setNewNoteData({...newNoteData,notename:e.target.value})}}
    />
    <TextField
      label="Note"
      onChange={(e)=>{setNewNoteData({...newNoteData,note:e.target.value})}}

    />
     <IconButton onClick={()=>{
        upload(newNoteData);
     }}>
        <FileUploadIcon/>
        </IconButton>
    
    </div>
    </Paper>
    

    </div>
  )

}



