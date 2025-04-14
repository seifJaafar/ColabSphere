"use client";
import React, { useState, useEffect, use } from "react";
import { GetMembers } from "@/actions/projects/projectActions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { User } from "@heroui/user";
import { Label } from "@/components/ui/label";
import { Pin } from "lucide-react";
import { AssignTask } from "@/actions/projects/TaskActions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";

export function AssignToDialog({
  taskID,
  projectID,
  assignedTo,
}: {
  taskID: string;
  projectID: string;
  assignedTo: string;
}) {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await GetMembers(projectID);

      if (response.success) {
        setMembers(response.members);
      } else {
        console.error("Error fetching users:", response.message);
        setMembers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [taskID, projectID]);
  useEffect(() => {
    if (assignedTo) {
      setSelectedMember(assignedTo);
    }
  }, [assignedTo]);
  const handleSubmit = async () => {
    const response = await AssignTask(taskID, selectedMember);
    if (response.success) {
      toast({
        title: "Success",
        description: "Task assigned successfully",
        variant: "default",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pin />
        </Button>
      </DialogTrigger>
      <DialogContent className=" p-6">
        <DialogHeader>
          <DialogTitle>Assign to a member</DialogTitle>
        </DialogHeader>
        <div>
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-white">Fetching team members...</p>
            </div>
          ) : (
            <div className="">
              <Label htmlFor="module" className="text-white mb-5">
                Members
              </Label>
              <Select
                name="module"
                required
                onValueChange={setSelectedMember}
                value={selectedMember}
              >
                <SelectTrigger className="py-6 mt-3">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Members</SelectLabel>
                    {members.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        <User
                          avatarProps={{
                            src: member.avatar,
                            alt: "Avatar",
                          }}
                          description={member.email}
                          name={member.username}
                          className="justify-start"
                        />
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" className="mr-2" onClick={handleSubmit}>
            Assign task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
