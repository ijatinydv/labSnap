"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, FlaskConical, Calendar, BookOpen, Hash, Users, Code } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Zod validation schema
const formSchema = z.object({
  // Section 1: Student Details
  name: z.string().min(1, "Name is required"),
  rollNo: z.string().min(1, "Roll number is required"),
  semester: z.string().min(1, "Semester is required"),
  batch: z.string().min(1, "Batch is required"),
  subjectCode: z.string().min(1, "Subject code is required"),

  // Section 2: Experiment Details
  expNo: z.string().min(1, "Experiment number is required"),
  date: z.string().min(1, "Date is required"),
  aim: z.string().min(10, "Aim must be at least 10 characters"),
  subject: z.string().min(1, "Subject is required"),
});

export type LabFormData = z.infer<typeof formSchema>;

interface LabFormProps {
  onSubmit: (data: LabFormData) => void;
}

const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const subjects = ["DBMS/SQL", "Java", "C++", "Web Dev"];

export function LabForm({ onSubmit }: LabFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LabFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rollNo: "",
      semester: "",
      batch: "",
      subjectCode: "",
      expNo: "",
      date: "",
      aim: "",
      subject: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-6">
      {/* Section 1: Student Details */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Student Details</CardTitle>
              <CardDescription className="text-zinc-400">
                For cover page generation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register("name")}
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Roll Number */}
          <div className="space-y-2">
            <Label htmlFor="rollNo" className="text-zinc-300">
              <Hash className="mr-1.5 inline h-3.5 w-3.5" />
              Roll Number
            </Label>
            <Input
              id="rollNo"
              placeholder="e.g., 2021-CS-101"
              {...register("rollNo")}
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
            {errors.rollNo && (
              <p className="text-sm text-red-400">{errors.rollNo.message}</p>
            )}
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <Label htmlFor="semester" className="text-zinc-300">
              <BookOpen className="mr-1.5 inline h-3.5 w-3.5" />
              Semester
            </Label>
            <Select onValueChange={(value) => setValue("semester", value)}>
              <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-white focus:border-violet-500 focus:ring-violet-500/20">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-900">
                {semesters.map((sem) => (
                  <SelectItem
                    key={sem}
                    value={sem}
                    className="text-zinc-300 focus:bg-violet-600 focus:text-white"
                  >
                    {sem} Semester
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.semester && (
              <p className="text-sm text-red-400">{errors.semester.message}</p>
            )}
          </div>

          {/* Batch */}
          <div className="space-y-2">
            <Label htmlFor="batch" className="text-zinc-300">
              <Users className="mr-1.5 inline h-3.5 w-3.5" />
              Batch
            </Label>
            <Input
              id="batch"
              placeholder="e.g., C-6"
              {...register("batch")}
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
            {errors.batch && (
              <p className="text-sm text-red-400">{errors.batch.message}</p>
            )}
          </div>

          {/* Subject Code */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="subjectCode" className="text-zinc-300">
              <Code className="mr-1.5 inline h-3.5 w-3.5" />
              Subject Code
            </Label>
            <Input
              id="subjectCode"
              placeholder="e.g., CIC-256"
              {...register("subjectCode")}
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
            {errors.subjectCode && (
              <p className="text-sm text-red-400">{errors.subjectCode.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Experiment Details */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/20">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Experiment Details</CardTitle>
              <CardDescription className="text-zinc-400">
                Information about the current experiment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          {/* Experiment Number */}
          <div className="space-y-2">
            <Label htmlFor="expNo" className="text-zinc-300">
              Experiment Number
            </Label>
            <Input
              id="expNo"
              placeholder="e.g., 1, 2, 3..."
              {...register("expNo")}
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
            {errors.expNo && (
              <p className="text-sm text-red-400">{errors.expNo.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-zinc-300">
              <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
            {errors.date && (
              <p className="text-sm text-red-400">{errors.date.message}</p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="subject" className="text-zinc-300">
              Subject
            </Label>
            <Select onValueChange={(value) => setValue("subject", value)}>
              <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-white focus:border-violet-500 focus:ring-violet-500/20">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-900">
                {subjects.map((subj) => (
                  <SelectItem
                    key={subj}
                    value={subj}
                    className="text-zinc-300 focus:bg-violet-600 focus:text-white"
                  >
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-sm text-red-400">{errors.subject.message}</p>
            )}
          </div>

          {/* Aim */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="aim" className="text-zinc-300">
              Aim of the Experiment
            </Label>
            <Textarea
              id="aim"
              placeholder="Enter the aim of your experiment in detail..."
              rows={4}
              {...register("aim")}
              className="min-h-[120px] border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
            {errors.aim && (
              <p className="text-sm text-red-400">{errors.aim.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 disabled:opacity-50"
      >
        {isSubmitting ? "Generating..." : "Generate Lab Record"}
      </Button>
    </form>
  );
}
