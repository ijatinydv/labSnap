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
  name: z.string().optional(),
  rollNo: z.string().optional(),

  // Section 2: Experiment Details
  expNo: z.string().optional(),
  date: z.string().optional(),
  aim: z.string().min(1, "Aim is required"),
  subject: z.string().min(1, "Subject is required"),
  code: z.string().optional(), // Hidden field
});

export type LabFormData = z.infer<typeof formSchema>;

interface LabFormProps {
  onSubmit: (data: LabFormData) => void;
}

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
      expNo: "",
      date: "",
      aim: "",
      subject: "",
      code: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-6">
      {/* Hidden Code Field */}
      <input type="hidden" {...register("code")} />

      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Lab Record Details</CardTitle>
              <CardDescription className="text-zinc-400">
                Enter student and experiment information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          {/* Section 1: Student Details */}
          <div className="col-span-full">
            <h3 className="mb-4 flex items-center text-sm font-medium text-zinc-400">
              <User className="mr-2 h-4 w-4" />
              Student Details
            </h3>
          </div>

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

          {/* Section Divider */}
          <div className="col-span-full mt-2 border-t border-zinc-800 pt-4">
            <h3 className="mb-4 flex items-center text-sm font-medium text-zinc-400">
              <FlaskConical className="mr-2 h-4 w-4" />
              Experiment Details
            </h3>
          </div>

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
