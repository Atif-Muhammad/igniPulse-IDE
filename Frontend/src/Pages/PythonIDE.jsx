import { React, useState, useRef, useEffect } from "react";
import {
  CirclePlay,
  ClipboardCheck,
  Copy,
  Download,
  Eraser,
  File,
  FileCode2,
  Moon,
  Play,
  Rocket,
  Save,
} from "lucide-react";
import { io } from "socket.io-client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import {
  EditorView,
  highlightActiveLineGutter,
  lineNumbers,
  keymap,
} from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";

import py from "../assets/py.svg";
import LeftMenu from "../components/LeftMenu";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

function PythonIDE() {
  const editorRef = useRef(null);
  const [tickerSuccess, setTickerSuccess] = useState({
    flag: false,
    message: "",
  });
  const [copyDone, setCopyDone] = useState(false);
  const [pasteDone, setPasteDone] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [disable, setDisable] = useState(false);

  const clearOutput = () => {
    document.getElementById("outputDiv").innerText = "";
  };

  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      // socket.current = io("https://igniup.com", {
      //   path: "/socket.io/",
      //   transports: ["websocket", "polling"],
      //   withCredentials: true
      // });
      socket.current = io("http://localhost:9000");

      const handlePyResponse = (message) => {
        setDisable(false);

        let formattedMessage = message.replace(/\r\n|\r|\n/g, "\n");

        if (formattedMessage.startsWith("\n")) {
          formattedMessage = "<br>" + formattedMessage.trimStart();
        }
        if (formattedMessage.endsWith("\n")) {
          formattedMessage = formattedMessage.trimEnd() + "<br>";
        }
        formattedMessage = formattedMessage.replace(/\n/g, "<br>");

        const res = document.createElement("div");
        res.innerHTML = formattedMessage;
        res.style.paddingBottom = "6px";

        document.getElementById("outputDiv").appendChild(res);
      };

      const handleExitSuccess = () => {
        const exitMsg = document.createElement("p");
        exitMsg.innerText = "--- Program Exited Successfully ---";
        exitMsg.style.color = "black";
        exitMsg.style.fontWeight = "bold";
        exitMsg.style.marginTop = "10px";
        exitMsg.style.textAlign = "start";

        document.getElementById("outputDiv").appendChild(exitMsg);
      };

      socket.current.on("pyResponse", handlePyResponse);
      socket.current.on("EXIT_SUCCESS", handleExitSuccess);

      socket.current.on("userInput", (message) => {
        setDisable(false);
        const outputDiv = document.getElementById("outputDiv");

        // Normalize newlines to ensure consistency
        let formattedMessage = message.replace(/\r\n|\r|\n/g, "\n");

        // Extract lines while preserving newlines
        const lines = formattedMessage
          .match(/[^\n]*(\n|$)/g)
          .filter((line) => line !== "");

        // Process all lines except the last one
        lines.slice(0, -1).forEach((line) => {
          const lineDiv = document.createElement("div");
          lineDiv.innerHTML = line.replace(/\n/g, "<br>");
          lineDiv.style.color = "black";
          lineDiv.style.marginBottom = "5px";
          outputDiv.appendChild(lineDiv);
        });

        // Create a container for the input prompt
        const inputPromptDiv = document.createElement("div");
        inputPromptDiv.id = "inputPromptDiv";
        inputPromptDiv.style.marginTop = "0px";
        inputPromptDiv.style.display = "flex";
        inputPromptDiv.style.alignItems = "start";
        inputPromptDiv.style.justifyContent = "start";

        // Create a label for the last line
        const promptLabel = document.createElement("label");
        promptLabel.innerHTML = lines[lines.length - 1].replace(/\n/g, "<br>");
        promptLabel.style.marginRight = "10px";
        promptLabel.style.paddingTop = "3px";
        promptLabel.style.color = "black";

        const inputBox = document.createElement("textarea");
        inputBox.id = "dynamicInput";
        inputBox.style.padding = "4px";
        inputBox.style.outline = "none";
        inputBox.style.backgroundColor = "inherit";
        inputBox.style.color = "black";
        inputBox.style.resize = "none";
        inputBox.style.overflow = "hidden";
        inputBox.rows = 1;
        inputBox.style.boxSizing = "border-box";
        inputBox.style.display = "inline-block";
        inputBox.style.minWidth = "50px";
        inputBox.style.maxWidth = "450px";

        // Auto height and width
        inputBox.addEventListener("input", () => {
          inputBox.style.height = "auto";
          inputBox.style.height = inputBox.scrollHeight + "px";

          // Set width based on characters but limited by parent width
          const length = inputBox.value.length || 1;
          inputBox.style.width = `${length + 1}ch`;
        });

        // Append label and input box
        inputPromptDiv.appendChild(promptLabel);
        inputPromptDiv.appendChild(inputBox);

        // Append inputPromptDiv to the outputDiv
        outputDiv.appendChild(inputPromptDiv);

        // Focus on the input box
        inputBox.focus();

        // Handle Enter key event
        inputBox.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const userInput = inputBox.value.trim();
            if (userInput) {
              socket.current.emit("userEntry", userInput);
              inputBox.disabled = true;
            }
          }
        });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
        socket.current?.off("pyResponse", handlePyResponse);
        socket.current?.off("EXIT_SUCCESS", handleExitSuccess);
      }
    };
  }, []);

  const handleRun = async () => {
    // console.log("first")
    if (editorContent != "") {
      setDisable(true);
      clearOutput();
      socket.current.close();
      socket.current.connect();
      // Emit the input data to the server using Socket.IO
      socket.current.emit("runPy", editorContent);
    }
  };

  const handleDownload = async () => {
    if (window.showSaveFilePicker) {
      const fileHandler = await window.showSaveFilePicker({
        suggestedName: "code.py",
        types: [
          {
            accept: { "text/plain": [".py"] },
          },
        ],
      });

      const writeAbleStream = await fileHandler.createWritable();
      await writeAbleStream.write(editorContent);
      await writeAbleStream.close();
    } else {
      const element = document.createElement("a");
      const file = new Blob([editorContent || ""], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      element.download = `code.py`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };
  const handleCopy = async () => {
    if (editorRef.current) {
      try {
        const editorContent = editorRef.current.state.doc.toString(); // Get the editor content
        if (editorContent.trim()) {
          await navigator.clipboard.writeText(editorContent); // Copy the content to clipboard
          setCopyDone(true);
          console.log("Copied to clipboard");
          setTimeout(() => {
            setCopyDone(false);
          }, 1000);
        }
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText(); 
      if (text && editorRef.current) {
        const contentLength = editorRef.current.state.doc.length;
        
      
        editorRef.current.dispatch({
          changes: {
            from: contentLength, 
            to: contentLength, 
            insert: text, 
          },
        });
  
        editorRef.current.focus();
        
        editorRef.current.dispatch({
          selection: { anchor: contentLength, head: contentLength },
        });
  
        setEditorContent(editorRef.current.state.doc.toString()); 
        setPasteDone(true);
        setTimeout(() => {
          setPasteDone(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };
  
  

  const openFile = async () => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          accept: {
            "text/plain": [".txt", ".py"],
          },
        },
      ],
      multiple: false,
    });

    const file = await fileHandle.getFile();
    const fileContent = await file.text();
    setEditorContent(fileContent);
  };
  const handleClear = () => {
    if (editorContent) {
      setEditorContent("");
      if (editorRef.current) {
        editorRef.current.dispatch({
          changes: { from: 0, to: editorRef.current.state.doc.length, insert: "" },
        });
        editorRef.current.focus();
      }
    }
  };
  
  const fullHeightEditor = EditorView.theme({
    ".cm-scroller": {
      maxHeight: "440px !important",
      overflow: "auto !important",
    },
    ".cm-content": {
      minHeight: "440px !important",
      whiteSpace: "pre",
    },
    ".cm-gutter": {
      minHeight: "440px !important",
    },
    ".cm-gutters": {
      backgroundColor: "#F1F5F9", // Light background
      color: "#64748B", // Slate text
      borderRight: "1px solid #E5E7EB",
    },
    ".cm-lineNumbers": {
      fontSize: "0.875rem",
      fontFamily: "monospace",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#3B82F6", // Tailwind blue-500
      color: "white !important",
      padding: "2px 0px",
    },
  });

  const customScrollbar = EditorView.theme({
    ".cm-scroller": {
      scrollbarWidth: "thin", // For Firefox
    },
    "::-webkit-scrollbar": {
      width: "8px", // Scrollbar width
      height: "8px", // Horizontal scrollbar height
    },
    "::-webkit-scrollbar-track": {
      background: "#F3F4F6", // Track color
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#F3F4F6", // Thumb color
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#F3F4F6", // Thumb hover effect
    },
  });

  const editorBtns = [
    {
      text: "Clear",
      icon: <Eraser className="text-white" size={14} />,
      action: handleClear,
    },
    {
      text: "Execute",
      icon: <CirclePlay className="text-white" size={14} />,
      action: handleRun,
    },
  ];

  return (
    <>
      <div className="flex flex-col h-screen w-screen overflow-hidden relative ">
        <div className="w-full h-22 text-center p-2">
          <div className=" h-full w-full"></div>
        </div>
        <div className="flex flex-row items-center justify-center h-full w-full overflow-hidden">
          <div className="h-full w-30 text-center p-2">
            <div className=" h-full w-full"></div>
          </div>
          <div className="w-full h-full gap-y-2 flex flex-col justify-between">
            <NavBar handleDownload={handleDownload} openFile={openFile} />
            <div className="bg-gray-100 h-full w-full flex items-center justify-center gap-x-2 p-2 rounded-xl">
              <LeftMenu
                handleCopy={handleCopy}
                handlePaste={handlePaste}
                copyDone={copyDone}
                pasteDone={pasteDone}
              />
              <div className="border-2 border-sky-700 w-[55%] h-full rounded-lg flex flex-col items-center justify-center p-2 gap-y-1">
                <div className="w-full h-12 flex items-center justify-between gap-x-2 rounded-lg bg-gray-200 px-2">
                  <div className="flex items-center justify-center gap-x-1 px-2">
                    <img src={py} alt="python" className="w-8 h-8" />
                    <p className="font-black">Python</p>
                  </div>
                  <div className="flex items-center justify-center gap-x-2">
                    {editorBtns.map((btn, index) => (
                      <Button
                        classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold ${
                          btn.text === "Execute"
                            ? "bg-[#10B335]"
                            : "bg-[#F7665D]"
                        } px-4 ${
                          btn.text === "Execute"
                            ? "hover:bg-green-600"
                            : "hover:bg-[#f7766d]"
                        } rounded-lg`}
                        action={btn.action}
                        text={btn.text}
                        icon={btn.icon}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-[475px] w-full flex items-start justify-center overflow-auto rounded-lg">
                  <CodeMirror
                    defaultValue={editorContent}
                    className="w-[650px] text-[1rem] scrollbar-custom overflow-hidden"
                    theme="light"
                    extensions={[
                      fullHeightEditor,
                      highlightActiveLineGutter(),
                      lineNumbers(),
                      keymap.of(defaultKeymap),
                      indentOnInput(),
                    ]}
                    onChange={(newContent) => {
                      setEditorContent(newContent); 
                    }}
                    onCreateEditor={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                </div>
              </div>
              <div className="border-2 border-sky-700 w-[45%] h-full rounded-lg p-2 flex flex-col gap-y-1">
                <div
                  className="h-12 w-full flex items-center justify-between gap-x-2 rounded-lg bg-gray-200 px-2"
                  onClick={clearOutput}
                >
                  <p className="font-black px-1">Output</p>
                  <Button
                    classNames={`cursor-pointer flex items-center justiy-center gap-x-2 py-2.5 text-white font-semibold bg-[#F7665D] px-4 hover:bg-[#f7766d] rounded-lg text-xs`}
                    text={editorBtns[0].text}
                    icon={editorBtns[0].icon}
                  />
                </div>
                <div
                  id="outputDiv"
                  className="h-[450px] w-full overflow-auto"
                ></div>
              </div>
            </div>
          </div>
          <div className="h-full w-30 text-center p-2">
            <div className=" h-full w-full"></div>
          </div>
        </div>
        <div className="w-full h-10 text-center p-2">
          <div className=" h-full w-full"></div>
        </div>
      </div>
    </>
  );
}

export default PythonIDE;
