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
    // Style A: Fake VS Code Terminal - using HEX colors for html2canvas compatibility
    return (
      <div
        id="terminal-preview"
        style={{
          minWidth: "600px",
          overflow: "hidden",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {/* VS Code Tab Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            padding: "6px 12px",
            fontSize: "12px",
          }}
        >
          <span style={{ color: "#6b7280" }}>PROBLEMS</span>
          <span style={{ color: "#6b7280", marginLeft: "8px" }}>OUTPUT</span>
          <span style={{ color: "#6b7280", marginLeft: "8px" }}>DEBUG CONSOLE</span>
          <span
            style={{
              borderBottom: "2px solid #3b82f6",
              padding: "4px 8px",
              fontWeight: "600",
              color: "#1f2937",
              marginLeft: "8px",
            }}
          >
            TERMINAL
          </span>
        </div>

        {/* Terminal Body */}
        <div style={{ backgroundColor: "#ffffff", padding: "16px" }}>
          {/* Prompt Line */}
          <div style={{ fontFamily: "Consolas, monospace", fontSize: "14px", color: "#000000" }}>
            <span style={{ fontWeight: "bold", color: "#2563eb" }}>
              PS D:\MAIT\Labs\{subject}&gt;
            </span>{" "}
            <span style={{ color: "#374151" }}>{getExecutionCommand(subject)}</span>
          </div>

          {/* Output Content */}
          <pre
            style={{
              marginTop: "12px",
              whiteSpace: "pre-wrap",
              fontFamily: "Consolas, monospace",
              fontSize: "14px",
              color: "#000000",
            }}
          >
            {output_text}
          </pre>

          {/* New Prompt */}
          <div
            style={{
              marginTop: "12px",
              fontFamily: "Consolas, monospace",
              fontSize: "14px",
              color: "#000000",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#2563eb" }}>
              PS D:\MAIT\Labs\{subject}&gt;
            </span>{" "}
            <span>▌</span>
          </div>
        </div>
      </div>
    );
  }

  // Style B: Fake MariaDB Terminal - using HEX colors for html2canvas compatibility
  return (
    <div
      id="terminal-preview"
      style={{
        minWidth: "600px",
        overflow: "hidden",
        borderRadius: "4px",
        border: "2px solid #000000",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {/* MariaDB Header */}
      <div
        style={{
          borderBottom: "2px solid #000000",
          backgroundColor: "#f3f4f6",
          padding: "8px 16px",
        }}
      >
        <p
          style={{
            fontFamily: "Consolas, monospace",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#000000",
            margin: 0,
          }}
        >
          MySQL Command Line Client - MariaDB Monitor
        </p>
        <p
          style={{
            fontFamily: "Consolas, monospace",
            fontSize: "12px",
            color: "#4b5563",
            margin: "4px 0 0 0",
          }}
        >
          Server version: 10.11.2-MariaDB
        </p>
      </div>

      {/* MariaDB Body */}
      <div style={{ backgroundColor: "#ffffff", padding: "16px" }}>
        {/* Connection Info */}
        <div
          style={{
            marginBottom: "12px",
            fontFamily: "Consolas, monospace",
            fontSize: "14px",
            color: "#4b5563",
          }}
        >
          <p style={{ margin: 0 }}>Type &apos;help;&apos; or &apos;\h&apos; for help.</p>
          <p style={{ margin: "4px 0 0 0" }}>Current database: mait</p>
        </div>

        {/* Query Prompt */}
        <div style={{ fontFamily: "Consolas, monospace", fontSize: "14px", color: "#000000" }}>
          <span style={{ fontWeight: "bold", color: "#7c3aed" }}>MariaDB [mait]&gt;</span>{" "}
          <span style={{ color: "#1f2937" }}>SELECT * FROM result;</span>
        </div>

        {/* Output Content (ASCII Table) */}
        <pre
          style={{
            marginTop: "12px",
            whiteSpace: "pre-wrap",
            fontFamily: "Consolas, monospace",
            fontSize: "14px",
            color: "#000000",
          }}
        >
          {output_text}
        </pre>

        {/* New Prompt */}
        <div
          style={{
            marginTop: "12px",
            fontFamily: "Consolas, monospace",
            fontSize: "14px",
            color: "#000000",
          }}
        >
          <span style={{ fontWeight: "bold", color: "#7c3aed" }}>MariaDB [mait]&gt;</span>{" "}
          <span>▌</span>
        </div>
      </div>
    </div>
  );
}
