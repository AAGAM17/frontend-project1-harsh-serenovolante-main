import React from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ContactList from './ContactList';
import { PersonDetails } from './SearchRoles';

interface SlidingSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlidingSheet: React.FC<SlidingSheetProps> = ({ isOpen, onClose }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent className="bg-white w-full">
        <SheetHeader className='mb-3'>
          <SheetTitle className='text-start'>Contact Information</SheetTitle>
          <SheetDescription className='text-start '>Select a tab to view details.</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="contacts" className="w-full ">
          <TabsList>
            <TabsTrigger value="contacts">CRM</TabsTrigger>
            <TabsTrigger value="details">Search</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts">
            <ContactList />
          </TabsContent>
          <TabsContent value="details">
            <PersonDetails company="JSW Steel" />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SlidingSheet;