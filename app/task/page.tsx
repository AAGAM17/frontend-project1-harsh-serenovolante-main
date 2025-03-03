/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';

const dummyTasks = [
  {
    id: "LEAD-1",
    title: "Krystal Integrated Services - Wastewater Contract",
    type: "Water Management",
    priority: "High",
    chatLink: "https://www.constructionworld.in/urban-infrastructure/wastewater-and-sewage-treatment/krystal-integrated-wins-2.3m-wastewater-contract/69175"
  },
  {
    id: "LEAD-2",
    title: "Titagarh Rail Systems - Adani Cement Order",
    type: "Railway Infrastructure",
    priority: "High",
    chatLink: "https://www.constructionworld.in/transport-infrastructure/metro-rail-and-railways-infrastructure/titagarh-rail-systems-wins-adani-cement-order-for-16-wagon-rakes/69075"
  },
  {
    id: "LEAD-3",
    title: "EPC Company - Water Management Contract",
    type: "Water Management",
    priority: "High",
    chatLink: "https://www.dsij.in/dsijarticledetail/this-small-cap-epc-company-receives-contract-worth-rs-1298-crore-for-water-management-and-civil-works-id003"
  },
  {
    id: "LEAD-4",
    title: "Ashish Kacholia Company - Dredging Contract",
    type: "Dredging",
    priority: "Medium",
    chatLink: "https://tradebrains.in/features/ashish-kacholia-stock-in-focus-after-receiving-order-worth-48-cr-from-dredging-corporation-of-india/"
  }
];

export default function Task() {
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState('Select Type'); // Default type
  const tasksPerPage = 10; // Number of tasks per page
  const [tasks, setTasks] = useState(dummyTasks);
  const [checkedTasks, setCheckedTasks] = useState(
    dummyTasks.reduce((acc, task) => ({ ...acc, [task.id]: false }), {}) // Initialize state with false for each task
  );

  const handleCheckboxChange = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Filter tasks based on selected filters and search term
  const filteredTasks = tasks.filter(task => {
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
        chatLink: "#" // Default empty link
      };
      dummyTasks.push(newTask);
      setOpenDialog(false);
      setNewTaskTitle('');
      setCurrentPage(totalPages); // Go to the last page to see the new task
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">JSW Steel Leads List</h1>
      <p className="mb-4 text-gray-600">Here are the latest leads procured for you!</p>
      
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <Input 
          placeholder="Search Project" 
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

{/* <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
        </Dialog> */}
        <div className='flex gap-5 align-middle'>
          <span>Exclude Projects-Today Leads</span>
          <input type="checkbox" className="w-5 h-5 cursor-pointer"/>
        </div>

      </div>

      <Table className="bg-white rounded-lg shadow-md">
        <TableHeader>
          <TableRow>
          <TableHead className="w-1/12">Status</TableHead>

            <TableHead className="w-1/6">Company Name</TableHead>
            <TableHead className="w-1/6">Headline</TableHead>
            <TableHead className="w-1/6">Stealth Index</TableHead>
            <TableHead className="w-1/6">Priority</TableHead>
            <TableHead className="w-1/6">Chat Link</TableHead>


          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTasks.map((task) => (
            
            
            <TableRow key={task.id} 
            
          >
              <TableCell>
              <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(task.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
              </TableCell>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.type}</TableCell>
              <TableCell>{task.priority === "High" ? "High ↑" : task.priority === "Medium" ? "Medium→" : "Low ↓"}</TableCell>
              <TableCell>
                <a 
                  href={task.chatLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Open Article
                </a>
              </TableCell>

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