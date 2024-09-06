"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ClockIcon } from "@radix-ui/react-icons";
import React, { useMemo, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FaEnvelopeOpenText } from "react-icons/fa";

const ProjectDashboard = () => {
  const project = {
    title: "Website Redesign",
    description:
      "Redesign the company website with a modern and responsive layout.",
    totalBudget: 10000,
    amountPaid: 1000,
    escrowAccountBalance: 9000,
  };
  const milestones = [
    {
      id: 1,
      title: "Initial Planning",
      description: "Gather requirements and create a project plan.",
      paymentPercentage: 10,
      status: "Approved",
      approvalTimestamp: "2023-09-01",
      reviewTimestamp: "2023-09-02",
      pendingTimestamp: "2023-09-01",
      paymentStatus: "Completed",
      paymentDate: "2023-09-02",
    },
    {
      id: 2,
      title: "Design Mockups",
      description: "Create design mockups for the new website layout.",
      paymentPercentage: 20,
      status: "Approved",
      approvalTimestamp: "2023-09-15",
      reviewTimestamp: "2023-09-03",
      pendingTimestamp: "2023-09-02",
      paymentStatus: "Pending",
      paymentDate: null,
    },
    {
      id: 3,
      title: "Front-end Development",
      description: "Implement the new design using HTML, CSS, and JavaScript.",
      paymentPercentage: 30,
      status: "Pending Approval",
      approvalTimestamp: null,
      reviewTimestamp: null,
      pendingTimestamp: "2023-09-03",
      paymentStatus: "Pending",
      paymentDate: null,
    },
    {
      id: 4,
      title: "Back-end Integration",
      description: "Integrate the front-end with the back-end systems.",
      paymentPercentage: 20,
      status: "Not Applied",
      approvalTimestamp: null,
      reviewTimestamp: null,
      pendingTimestamp: "2023-09-04",
      paymentStatus: "Pending",
      paymentDate: null,
    },
    {
      id: 5,
      title: "Testing and Deployment",
      description:
        "Thoroughly test the website and deploy it to the production server.",
      paymentPercentage: 20,
      status: "Pending Approval",
      approvalTimestamp: null,
      reviewTimestamp: null,
      pendingTimestamp: "2023-09-04",
      paymentStatus: "Pending",
      paymentDate: null,
    },
  ];

  const handleMilestoneCompletion = (milestoneId) => {};
  const handleMilestoneNotes = (milestoneId, notes) => {};
  const handleMilestoneFeedback = (milestoneId, feedback) => {};
  const totalPaymentPercentage = milestones.reduce(
    (acc, milestone) => acc + milestone.paymentPercentage,
    0
  );
  const completedPaymentPercentage = milestones
    .filter((milestone) => milestone.paymentStatus === "Completed")
    .reduce((acc, milestone) => acc + milestone.paymentPercentage, 0);
  //   const projectProgress =
  //     (completedPaymentPercentage / totalPaymentPercentage) * 100;
  const projectProgress =
    (completedPaymentPercentage / totalPaymentPercentage) * 100;

  return (
    <div className="">
      <main className="flex flex-col p-6 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
          <div className="flex items-center space-x-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-lg font-bold text-black">
                ₹{project.totalBudget}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="text-lg font-bold text-blue-400">
                ₹{project.amountPaid}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Escrow Balance</p>
              <p className="text-lg font-bold text-green-500">
                ₹{project.escrowAccountBalance}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-4 w-full">
              <div
                className="bg-purple-600 h-full rounded-full"
                style={{ width: `${projectProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0%</span>
              <span className="text-green-500">
                {projectProgress.toFixed(0)}% Completed
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Project Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.map((milestone, index) => (
                  <TableRow key={milestone.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{milestone.title}</TableCell>
                    <TableCell>{milestone.description}</TableCell>
                    <TableCell>{milestone.paymentPercentage}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-full h-2 rounded-full ${
                            milestone.status === "Approved"
                              ? "bg-green-500"
                              : milestone.status === "Pending Approval"
                              ? "hidden"
                              : milestone.status === "Not Applied"
                              ? "hidden"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`h-full rounded-full ${
                              milestone.status === "Approved"
                                ? "bg-green-500"
                                : milestone.status === "Under Review"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                            style={{
                              width:
                                milestone.status === "Approved"
                                  ? "100%"
                                  : ""
                            }}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            milestone.status === "Approved"
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {milestone.status === "Pending Approval" ? (
                            <div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div>
                                    <Button className="bg-primary hover:bg-primaryho focus:bg-primary rounded-sm mb-1">
                                      Review Application
                                    </Button>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-black flex flex-row gap-1">
                                      <FaEnvelopeOpenText className="text-primary" />
                                      Review Application
                                    </DialogTitle>
                                    <DialogDescription>
                                      Craft a personalized application message explaing the completion of milestone
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex items-center space-x-2">
                                    
                                  </div>
                                  <DialogFooter className="sm:justify-start gap-2">
                                    <DialogClose asChild>
                                      <Button
                                        type="button"
                                        className="bg-red-100  text-red-500 shadow-none  hover:bg-red-100"
                                      >
                                        Reject
                                      </Button>
                                    </DialogClose>
                                    <Button
                                      type="button"
                                      className="bg-green-500 focus:bg-green-500 hover:bg-green-600"
                                      
                                    >
                                      Accept
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ) : (
                            milestone.status
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {milestone.status === "Approved" && (
                          <span>Approved: {milestone.approvalTimestamp}</span>
                        )}
                        
                        {milestone.status === "Pending Approval" && (
                          <span>
                            Pending Approval: {milestone.pendingTimestamp}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-2">
                        {milestone.paymentStatus === "Completed" ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <CiCircleCheck className="w-4 h-4" />
                            <span>{milestone.paymentStatus}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-500">
                            <ClockIcon className="w-4 h-4" />
                            <span>{milestone.paymentStatus}</span>
                          </div>
                        )}
                        {milestone.paymentDate && (
                          <span className="text-xs text-muted-foreground">
                            {milestone.paymentDate}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className=" border-l-2 border-l-green-500 px-2">Project Feedbacks</CardTitle>
          </CardHeader>
          <CardContent>
            
              <div  className="mb-6">
                <div className="space-y-4">
                  
                    <div  className="bg-[#FAFAFA] p-4 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{"feedback.author"}</div>
                        <div className="text-sm text-muted-foreground">
                          {"feedback.createdAt"}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{"feedback.content"}</p>
                    </div>
               
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Leave feedback..."
                      className="flex-1"
                    
                    />
                    <Button
                      variant="default"
                      className="bg-purple-600 text-white"
                      
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
         
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProjectDashboard;
