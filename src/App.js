import React, { Component, useState } from 'react';
import Card from 'react-bootstrap/Card';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faPlusCircle,
  faEdit,
  faBan,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import { toast, ToastContainer } from 'react-nextjs-toast';

export default function App() {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [priority, setPriority] = useState('');
  const [taskIndex, setTaskIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  function handleClose() {
    setOpen(false);
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('');
    endUpdate();
  }

  function startUpdate() {
    setIsUpdating(true);
  }

  function endUpdate() {
    setIsUpdating(false);
  }

  function invalidEdit() {
    toast.notify('The description is empty!', {
      duration: 3,
      type: 'error',
    });
  }

  function invalidAdd() {
    toast.notify('Please fix the title or the description!', {
      duration: 3,
      type: 'error',
    });
  }

  function addTask() {
    let task = { title, description, deadline, priority, isComplete };
    taskList.push(task);
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('');
    setIsComplete(false);
    setOpen(false);
    toast.notify('Task was successfully Added!', {
      duration: 3,
      type: 'success',
    });
  }

  function checkCompleted(index) {
    let taskHold = [...taskList];
    taskHold[index].isComplete = !taskHold[index].isComplete;
    setTaskList(taskHold);
  }

  function deleteTask(index) {
    taskList.splice(index, 1);
    setTaskList([...taskList]);
    toast.notify('Task was successfully deleted!', {
      duration: 3,
      type: 'success',
    });
  }

  function updateTask(index) {
    let taskHold = [...taskList];
    let currTask = taskHold[index];
    startUpdate();
    setTitle(currTask.title);
    setDescription(currTask.description);
    setDeadline(currTask.deadline);
    setPriority(currTask.priority);
    setTaskIndex(index);
    setOpen(true);
  }

  function editTask() {
    let task = { title, description, deadline, priority, isComplete };
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('');
    setIsComplete(false);

    if (description === '') {
      invalidEdit();
    } else {
      taskList.splice(taskIndex, 1, task);
      setOpen(false);
      endUpdate();
      toast.notify('Task was successfully updated!', {
        duration: 3,
        type: 'success',
      });
    }
  }

  return (
    <>
      <ToastContainer />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
          {isUpdating ? (
            <div>
              <FontAwesomeIcon icon={faEdit} /> Edit Task
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faPlusCircle} /> Add Task
            </div>
          )}
        </DialogTitle>

        <DialogContent>
          {isUpdating ? (
            <></>
          ) : (
            <>
              <br />
              <br />
              <TextField
                id="taskTitle"
                label="Title"
                onChange={(e) => setTitle(e.target.value)}
                error={
                  title === '' ||
                  taskList.map((task) => task.title === title).includes(true)
                }
                helperText={
                  title === ''
                    ? 'Title is Required!'
                    : '' ||
                      taskList
                        .map((task) => task.title === title)
                        .includes(true)
                    ? 'Title has to be Unique!'
                    : ''
                }
                fullWidth
                required
              />
            </>
          )}

          <br />
          <br />
          <br />

          <TextField
            id="taskDescription"
            label="Desciption"
            onChange={(e) => setDescription(e.target.value)}
            error={description === ''}
            helperText={description === '' ? 'Description is Required!' : ''}
            fullWidth
            required
          />

          <br />
          <br />
          <br />

          <TextField
            type="date"
            id="taskDeadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            label="Deadline"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Deadline"
              inputFormat="MM/DD/YYYY"
              value={deadline}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <br />
          <br />

          <FormControl>
            <FormLabel>Priority</FormLabel>

            <RadioGroup
              onChange={(e) => setPriority(e.target.value)}
              value={priority}
              row
            >
              <FormControlLabel value="Low" control={<Radio />} label="Low" />
              <FormControlLabel value="Med" control={<Radio />} label="Med" />
              <FormControlLabel value="High" control={<Radio />} label="High" />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ bgcolor: 'white' }}>
          {isUpdating ? (
            <div>
              <Button
                onClick={description === '' ? invalidEdit : editTask}
                variant="contained"
              >
                <FontAwesomeIcon icon={faEdit} /> Edit
              </Button>
            </div>
          ) : (
            <div>
              <Button
                onClick={
                  title === '' ||
                  taskList.map((task) => task.title === title).includes(true) ||
                  description === ''
                    ? invalidAdd
                    : addTask
                }
                variant="contained"
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Add
              </Button>
            </div>
          )}

          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{ bgcolor: 'red' }}
          >
            <FontAwesomeIcon icon={faBan} /> CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ margin: '10px' }}>
        <CardHeader
          sx={{ bgcolor: 'primary.dark', color: 'white' }}
          title={
            <>
              <small>
                <FontAwesomeIcon icon={faBars} />
                FRAMEWORKS
              </small>
            </>
          }
          style={{ textAlign: 'Center' }}
          action={
            <>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{ width: 100, marginRight: '5px' }}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
                Add
              </Button>
            </>
          }
        ></CardHeader>

        <CardContent sx={{ bgcolor: 'white' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ width: 0.1, color: 'gray', fontWeight: 'bold' }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: 0.1, color: 'gray', fontWeight: 'bold' }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: 0.1, color: 'gray', fontWeight: 'bold' }}
                  >
                    Deadline
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: 0.1, color: 'gray', fontWeight: 'bold' }}
                  >
                    Priority
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: 0.1, color: 'gray', fontWeight: 'bold' }}
                  >
                    Is Complete
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: 0.1, color: 'gray', fontWeight: 'bold' }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {taskList.map((task, taskIndex) => (
                  <TableRow key={task.title}>
                    <TableCell align="center">{task.title}</TableCell>
                    <TableCell align="center">{task.description}</TableCell>
                    <TableCell align="center">
                      {moment(task.deadline).format('MM/DD/YY')}
                    </TableCell>
                    <TableCell align="center">{task.priority}</TableCell>
                    <TableCell align="center">
                      {task.isComplete ? (
                        <div>
                          <Checkbox
                            defaultChecked
                            onClick={() => checkCompleted(taskIndex)}
                          />
                        </div>
                      ) : (
                        <div>
                          <Checkbox onClick={() => checkCompleted(taskIndex)} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {task.isComplete ? (
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => deleteTask(taskIndex)}
                        >
                          {' '}
                          <FontAwesomeIcon icon={faTimesCircle} />
                          &nbsp; DELETE &nbsp;
                        </Button>
                      ) : (
                        <div>
                          <Button
                            variant="contained"
                            onClick={() => updateTask(taskIndex)}
                          >
                            {' '}
                            <FontAwesomeIcon icon={faEdit} />
                            &nbsp; UPDATE &nbsp;
                          </Button>
                          <Button
                            color="error"
                            variant="contained"
                            onClick={() => deleteTask(taskIndex)}
                          >
                            {' '}
                            <FontAwesomeIcon icon={faTimesCircle} />
                            &nbsp; DELETE &nbsp;
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
