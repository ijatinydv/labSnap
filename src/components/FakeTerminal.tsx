"use client";

interface FakeTerminalProps {
  type: "dbms" | "coding";
  subject: string;
  code?: string;
  output_text: string;
}

export function FakeTerminal({
  type,
  subject,
  output_text,
}: FakeTerminalProps) {
  // Get execution command based on subject
  const getExecutionCommand = (subj: string): string => {
    const commands: Record<string, string> = {
      "c++": "g++ main.cpp -o main && ./main",
      java: "javac Main.java && java Main",
      python: "python main.py",
      dsa: "g++ solution.cpp -o solution && ./solution",
      "web dev": "node index.js",
    };
    return commands[subj.toLowerCase()] || "run program";
  };

  if (type === "coding") {
    // Style A: Fake VS Code Terminal
    return (
      <div
        id="terminal-preview"
        className="min-w-[600px] overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
      >
        {/* VS Code Tab Bar */}
        <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-xs">
          <span className="text-gray-500">PROBLEMS</span>
          <span className="text-gray-500">OUTPUT</span>
          <span className="text-gray-500">DEBUG CONSOLE</span>
          <span className="border-b-2 border-blue-500 px-2 py-1 font-semibold text-gray-800">
            TERMINAL
          </span>
        </div>

        {/* Terminal Body */}
        <div className="bg-white p-4">
          {/* Prompt Line */}
          <div className="font-mono text-sm text-black">
            <span className="font-bold text-blue-600">
              PS D:\MAIT\Labs\{subject}&gt;
            </span>{" "}
            <span className="text-gray-700">{getExecutionCommand(subject)}</span>
          </div>

          {/* Output Content */}
          <pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-black">
            {output_text}
          </pre>

          {/* New Prompt */}
          <div className="mt-3 font-mono text-sm text-black">
            <span className="font-bold text-blue-600">
              PS D:\MAIT\Labs\{subject}&gt;
            </span>{" "}
            <span className="animate-pulse">▌</span>
          </div>
        </div>
      </div>
    );
  }

  // Style B: Fake MariaDB Terminal
  return (
    <div
      id="terminal-preview"
      className="min-w-[600px] overflow-hidden rounded border-2 border-black bg-white shadow-sm"
    >
      {/* MariaDB Header */}
      <div className="border-b-2 border-black bg-gray-100 px-4 py-2">
        <p className="font-mono text-sm font-bold text-black">
          MySQL Command Line Client - MariaDB Monitor
        </p>
        <p className="font-mono text-xs text-gray-600">
          Server version: 10.11.2-MariaDB
        </p>
      </div>

      {/* MariaDB Body */}
      <div className="bg-white p-4">
        {/* Connection Info */}
        <div className="mb-3 font-mono text-sm text-gray-600">
          <p>Type &apos;help;&apos; or &apos;\h&apos; for help.</p>
          <p>Current database: mait</p>
        </div>

        {/* Query Prompt */}
        <div className="font-mono text-sm text-black">
          <span className="font-bold text-purple-700">MariaDB [mait]&gt;</span>{" "}
          <span className="text-gray-800">SELECT * FROM result;</span>
        </div>

        {/* Output Content (ASCII Table) */}
        <pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-black">
          {output_text}
        </pre>

        {/* New Prompt */}
        <div className="mt-3 font-mono text-sm text-black">
          <span className="font-bold text-purple-700">MariaDB [mait]&gt;</span>{" "}
          <span className="animate-pulse">▌</span>
        </div>
      </div>
    </div>
  );
}
