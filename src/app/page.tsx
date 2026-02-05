"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LabForm, LabFormData } from "@/components/LabForm";

export default function Home() {
  const handleSubmit = (data: LabFormData) => {
    // Dummy submit handler - logs data to console
    console.log("Form submitted with data:", data);
    console.log("---");
    console.log("Student Details:");
    console.log(`  Name: ${data.name}`);
    console.log(`  Roll No: ${data.rollNo}`);
    console.log(`  Semester: ${data.semester}`);
    console.log(`  Batch: ${data.batch}`);
    console.log(`  Subject Code: ${data.subjectCode}`);
    console.log("---");
    console.log("Experiment Details:");
    console.log(`  Experiment No: ${data.expNo}`);
    console.log(`  Date: ${data.date}`);
    console.log(`  Subject: ${data.subject}`);
    console.log(`  Aim: ${data.aim}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-12">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Generate Lab Records
          </h1>
          <p className="mx-auto max-w-md text-lg text-zinc-400">
            Create print-ready Word documents that match your college&apos;s format in seconds.
          </p>
        </div>

        {/* Form */}
        <LabForm onSubmit={handleSubmit} />
      </main>

      <Footer />
    </div>
  );
}
