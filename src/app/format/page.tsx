"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { generateLabRecord, LabData } from "@/lib/generateDoc";
import {
  Loader2,
  FileDown,
  Upload,
  ImageIcon,
  X,
  Calendar,
  FileText,
  Code,
  Target,
  User,
} from "lucide-react";
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

// Subject configuration
const subjects = ["DBMS/SQL", "Java", "C++", "Web Dev", "Python"];

// Helper to determine if subject is DBMS
function isDBMSSubject(subject: string): boolean {
  const dbmsKeywords = ["dbms", "sql"];
  return dbmsKeywords.some((keyword) =>
    subject.toLowerCase().includes(keyword)
  );
}

interface FormData {
  expNo: string;
  date: string;
  aim: string;
  subject: string;
  name: string;
  rollNo: string;
  code: string;
}

export default function FormatPage() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    expNo: "",
    date: "",
    aim: "",
    subject: "",
    name: "",
    rollNo: "",
    code: "",
  });

  // Screenshot state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form field changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle subject selection
  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  // Handle file upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Store the file
    setScreenshotFile(file);
    setError(null);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setScreenshotPreview(previewUrl);

    // Convert to Blob (it's already a Blob, but we store it separately)
    setScreenshotBlob(file);
  };

  // Remove uploaded screenshot
  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setScreenshotBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.aim || !formData.subject || !formData.code) {
        throw new Error("Please fill in Aim, Subject, and Code");
      }

      if (!screenshotBlob) {
        throw new Error("Please upload a screenshot");
      }

      let theory: string | undefined;
      let syntax: string | undefined;

      // Scenario B: DBMS subjects need AI-generated theory
      if (isDBMSSubject(formData.subject)) {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aim: formData.aim,
            subject: formData.subject,
            mode: "theory_only",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate theory");
        }

        const aiResult = await response.json();
        theory = aiResult.theory;
        syntax = aiResult.syntax;
      }

      // Prepare lab data for document generation
      const labData: LabData = {
        expNo: formData.expNo,
        date: formData.date,
        aim: formData.aim,
        subject: formData.subject,
        name: formData.name,
        rollNo: formData.rollNo,
        theory,
        syntax,
        code: formData.code,
        screenshotBlob,
      };

      // Generate and download the document
      await generateLabRecord(labData);

      // Success feedback
      alert("✅ Document generated and downloaded successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-12">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/50 px-3 py-1 text-sm text-emerald-400">
            <Upload className="h-3.5 w-3.5" />
            Smart Formatter
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Format Your Lab Record
          </h1>
          <p className="mx-auto max-w-md text-lg text-zinc-400">
            Upload your code and screenshot. We&apos;ll format it into a
            print-ready Word document.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 w-full max-w-3xl rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-300">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6">
          {/* Unified Form Card */}
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">
                    Document Generation Details
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Enter details and upload content to generate your record
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
              {/* Section 1: Student Details */}
              <div className="col-span-full">
                <h3 className="mb-4 flex items-center text-sm font-medium text-zinc-400">
                  <User className="mr-2 h-4 w-4" /> {/* Use User icon here */}
                  Student Details
                </h3>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Your Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Roll Number */}
              <div className="space-y-2">
                <Label htmlFor="rollNo" className="text-zinc-300">
                  Roll Number
                </Label>
                <Input
                  id="rollNo"
                  name="rollNo"
                  placeholder="e.g., 2021-CS-101"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Experiment Number */}
              <div className="space-y-2">
                <Label htmlFor="expNo" className="text-zinc-300">
                  Experiment Number
                </Label>
                <Input
                  id="expNo"
                  name="expNo"
                  placeholder="e.g., 1, 2, 3..."
                  value={formData.expNo}
                  onChange={handleInputChange}
                  className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-zinc-300">
                  <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border-zinc-700 bg-zinc-800/50 text-white"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="subject" className="text-zinc-300">
                  Subject
                </Label>
                <Select onValueChange={handleSubjectChange}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-white">
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
                {isDBMSSubject(formData.subject) && (
                  <p className="text-xs text-emerald-400">
                    ✨ AI will generate Theory & Syntax for DBMS subjects
                  </p>
                )}
              </div>

              {/* Section Divider */}
              <div className="col-span-full mt-2 border-t border-zinc-800 pt-4">
                <h3 className="mb-4 flex items-center text-sm font-medium text-zinc-400">
                  <Code className="mr-2 h-4 w-4" />
                  Experiment Content
                </h3>
              </div>

              {/* Aim */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="aim" className="text-zinc-300">
                  <Target className="mr-1.5 inline h-3.5 w-3.5" />
                  Aim of the Experiment
                </Label>
                <Textarea
                  id="aim"
                  name="aim"
                  placeholder="Enter the aim of your experiment..."
                  rows={2}
                  value={formData.aim}
                  onChange={handleInputChange}
                  className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Code */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="code" className="text-zinc-300">
                  <Code className="mr-1.5 inline h-3.5 w-3.5" />
                  Source Code
                </Label>
                <Textarea
                  id="code"
                  name="code"
                  placeholder="Paste your code here..."
                  rows={8}
                  value={formData.code}
                  onChange={handleInputChange}
                  className="min-h-[200px] border-zinc-700 bg-zinc-800/50 font-mono text-sm text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-zinc-300">
                  <ImageIcon className="mr-1.5 inline h-3.5 w-3.5" />
                  Output Screenshot
                </Label>

                {!screenshotPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/30 p-8 transition-colors hover:border-emerald-600 hover:bg-zinc-800/50"
                  >
                    <Upload className="mb-3 h-10 w-10 text-zinc-500" />
                    <p className="mb-1 text-sm font-medium text-zinc-300">
                      Click to upload screenshot
                    </p>
                    <p className="text-xs text-zinc-500">
                      PNG, JPG, or WEBP (max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800/30">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="max-h-[300px] w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white transition-colors hover:bg-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="border-t border-zinc-700 bg-zinc-800/50 px-3 py-2">
                      <p className="truncate text-sm text-zinc-400">
                        {screenshotFile?.name}
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isDBMSSubject(formData.subject)
                  ? "Generating Theory & Document..."
                  : "Generating Document..."}
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-5 w-5" />
                Generate & Download DOCX
              </>
            )}
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
