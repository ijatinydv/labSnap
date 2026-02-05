"use client";

import { useState } from "react";
import { toBlob } from "html-to-image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LabForm, LabFormData } from "@/components/LabForm";
import { FakeTerminal } from "@/components/FakeTerminal";
import { generateLabRecord, LabData } from "@/lib/generateDoc";
import { Loader2, FileDown, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface APIResult {
  type: "dbms" | "coding";
  theory?: string;
  syntax?: string;
  code: string;
  output_text: string;
}

export default function Home() {
  // State management
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<APIResult | null>(null);
  const [formData, setFormData] = useState<LabFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Editable fields (so users can modify AI output)
  const [editableTheory, setEditableTheory] = useState("");
  const [editableSyntax, setEditableSyntax] = useState("");
  const [editableCode, setEditableCode] = useState("");
  const [editableOutput, setEditableOutput] = useState("");

  // Step 1: Handle form submission
  const handleFormSubmit = async (data: LabFormData) => {
    setLoading(true);
    setError(null);
    setFormData(data);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aim: data.aim,
          subject: data.subject,
          name: data.name,
          rollNo: data.rollNo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      const apiResult: APIResult = await response.json();
      setResult(apiResult);

      // Initialize editable fields with API response
      setEditableTheory(apiResult.theory || "");
      setEditableSyntax(apiResult.syntax || "");
      setEditableCode(apiResult.code);
      setEditableOutput(apiResult.output_text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Handle download
  const handleDownload = async () => {
    if (!result || !formData) return;

    setLoading(true);

    try {
      // Capture the terminal preview using html-to-image
      const terminalElement = document.getElementById("terminal-preview");
      let screenshotBlob: Blob | null = null;

      if (terminalElement) {
        try {
          screenshotBlob = await toBlob(terminalElement, {
            backgroundColor: "#ffffff",
            quality: 0.95,
            pixelRatio: 2,
          });
        } catch (captureError) {
          console.error("Screenshot capture failed:", captureError);
          alert("Failed to capture output screenshot. The document will be generated without it.");
        }
      }

      if (!screenshotBlob) {
        console.warn("Screenshot blob is null, continuing without screenshot");
      }

      // Prepare data with EDITED content
      const labData: LabData = {
        expNo: formData.expNo,
        date: formData.date,
        aim: formData.aim,
        subject: formData.subject,
        name: formData.name,
        rollNo: formData.rollNo,
        theory: result.type === "dbms" ? editableTheory : undefined,
        syntax: result.type === "dbms" ? editableSyntax : undefined,
        code: editableCode,
        screenshotBlob,
      };

      await generateLabRecord(labData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate document");
    } finally {
      setLoading(false);
    }
  };

  // Back button handler
  const handleBack = () => {
    setResult(null);
    setError(null);
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 w-full max-w-5xl rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-300">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Step 1: Show Form */}
        {!result && <LabForm onSubmit={handleFormSubmit} />}

        {/* Step 2 & 3: Preview Dashboard */}
        {result && formData && (
          <div className="w-full max-w-6xl space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Form
              </Button>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-950 px-3 py-1 text-sm text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generated
                </span>
                <Button
                  onClick={handleDownload}
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="mr-2 h-4 w-4" />
                  )}
                  Download Word File
                </Button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column: Editable Fields */}
              <div className="space-y-4">
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white">
                      Edit Content
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Modify the AI-generated content before downloading.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Theory (DBMS only) */}
                    {result.type === "dbms" && (
                      <div className="space-y-2">
                        <Label htmlFor="theory" className="text-zinc-300">
                          Theory
                        </Label>
                        <Textarea
                          id="theory"
                          value={editableTheory}
                          onChange={(e) => setEditableTheory(e.target.value)}
                          className="min-h-[80px] border-zinc-700 bg-zinc-800/50 text-white"
                        />
                      </div>
                    )}

                    {/* Syntax (DBMS only) */}
                    {result.type === "dbms" && (
                      <div className="space-y-2">
                        <Label htmlFor="syntax" className="text-zinc-300">
                          Syntax
                        </Label>
                        <Textarea
                          id="syntax"
                          value={editableSyntax}
                          onChange={(e) => setEditableSyntax(e.target.value)}
                          className="min-h-[80px] border-zinc-700 bg-zinc-800/50 font-mono text-sm text-white"
                        />
                      </div>
                    )}

                    {/* Code */}
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-zinc-300">
                        Source Code
                      </Label>
                      <Textarea
                        id="code"
                        value={editableCode}
                        onChange={(e) => setEditableCode(e.target.value)}
                        className="min-h-[150px] border-zinc-700 bg-zinc-800/50 font-mono text-sm text-white"
                      />
                    </div>

                    {/* Output Text */}
                    <div className="space-y-2">
                      <Label htmlFor="output" className="text-zinc-300">
                        Output Text
                      </Label>
                      <Textarea
                        id="output"
                        value={editableOutput}
                        onChange={(e) => setEditableOutput(e.target.value)}
                        className="min-h-[100px] border-zinc-700 bg-zinc-800/50 font-mono text-sm text-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Form Summary */}
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white">
                      Document Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-zinc-500">Student:</span>
                        <p className="text-zinc-200">{formData.name}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Roll No:</span>
                        <p className="text-zinc-200">{formData.rollNo}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Experiment:</span>
                        <p className="text-zinc-200">#{formData.expNo}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Date:</span>
                        <p className="text-zinc-200">{formData.date}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-zinc-500">Subject:</span>
                        <p className="text-zinc-200">{formData.subject}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Live Terminal Preview */}
              <div className="space-y-4">
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white">
                      Output Preview
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      This screenshot will be included in your document.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    {/* Isolated container to prevent CSS color inheritance for html2canvas */}
                    <div style={{ isolation: "isolate", all: "initial", display: "block" }}>
                      <FakeTerminal
                        type={result.type}
                        subject={formData.subject}
                        code={editableCode}
                        output_text={editableOutput}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-xl bg-zinc-900 p-8 shadow-2xl">
              <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
              <p className="text-lg font-medium text-white">
                {result ? "Generating Document..." : "Generating Content..."}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
