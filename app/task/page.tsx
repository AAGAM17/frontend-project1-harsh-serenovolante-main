"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';

const dummyTasks = Array.from({ length: 30 }, (_, index) => ({
  id: `TASK-${index + 1}`,
  title: `Task title ${index + 1}`,
  type: index % 3 === 0 ? "Documentation" : index % 3 === 1 ? "Bug" : "Feature",
  priority: index % 2 === 0 ? "High" : "Medium",
}));

export default function Task() {
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState('Select Type'); // Default type
  const tasksPerPage = 10; // Number of tasks per page

  // Filter tasks based on selected filters and search term
  const filteredTasks = dummyTasks.filter(task => {
    const typeMatch = filterType.length === 0 || filterType.includes(task.type);
    const priorityMatch = filterPriority.length === 0 || filterPriority.includes(task.priority);
    const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && priorityMatch && searchMatch;
  });

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Function to add a new task
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `TASK-${dummyTasks.length + 1}`,
        title: newTaskTitle,
        type: newTaskType,
        priority: "Medium", // Default priority
      };
      dummyTasks.push(newTask);
      setOpenDialog(false);
      setNewTaskTitle('');
      setCurrentPage(totalPages); // Go to the last page to see the new task
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome back!</h1>
      <p className="mb-4 text-gray-600">Here's a list of your tasks for this month!</p>
      
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <Input 
          placeholder="Search task titles" 
          className="w-full md:w-1/3 mb-2 md:mb-0" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
      </div>

      <div className="flex justify-between mb-4">
        <div className='flex gap-3'>
<DropdownMenu>
          <DropdownMenuTrigger><Button variant={"outline"}>Type</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Task Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterType(['Documentation'])}>Documentation</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType(['Bug'])}>Bug</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType(['Feature'])}>Feature</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType([])}>Clear Filters</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger><Button variant={"outline"}>Priority</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Task Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterPriority(['High'])}>High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPriority(['Medium'])}>Medium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPriority([])}>Clear Filters</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

<Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="ml-4">+ Add Task</Button>
          </DialogTrigger>
          <DialogContent className='bg-white rounded-lg shadow-lg'>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Enter the title and select the type of the new task.
              </DialogDescription>
            </DialogHeader>
            <Input 
              placeholder="Task Title" 
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)} 
              className="mb-4"
            />
            <DropdownMenu>
              <DropdownMenuTrigger><Button variant={"outline"}>{newTaskType}</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setNewTaskType('Documentation')}>Documentation</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNewTaskType('Bug')}>Bug</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNewTaskType('Feature')}>Feature</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogFooter>
              <Button onClick={addTask} className="bg-blue-500 text-white">Add Task</Button>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="bg-white rounded-lg shadow-md">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Task</TableHead>
            <TableHead className="w-1/4">Title</TableHead>
            <TableHead className="w-1/4">Type</TableHead>
            <TableHead className="w-1/4">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.type}</TableCell>
              <TableCell>{task.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="mt-4">
        <PaginationContent className='cursor-pointer'>
          <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink onClick={() => setCurrentPage(index + 1)}>{index + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
} 