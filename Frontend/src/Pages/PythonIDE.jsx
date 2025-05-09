import { React, useState, useRef, useEffect } from "react";
import { CirclePlay, Eraser, X } from "lucide-react";
import { io } from "socket.io-client";
import { useTheme } from "../context/ThemeContext";
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
import { oneDark } from "@codemirror/theme-one-dark";

import py from "../assets/py.svg";
import LeftMenu from "../components/LeftMenu";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import Ads from "../components/Ads";

function PythonIDE() {
  const { darkTheme } = useTheme();
  const editorRef = useRef(null);
  const [tickerSuccess, setTickerSuccess] = useState({
    flag: false,
    message: "",
  });
  const [copyDone, setCopyDone] = useState(false);
  const [pasteDone, setPasteDone] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [disable, setDisable] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [shouldRunCode, setShouldRunCode] = useState(false);
  const socket = useRef(null);

  const clearOutput = () => {
    document.getElementById("outputDivDesktop").innerText = "";
    document.getElementById("outputDivMobile").innerText = "";
  };

  // const [shouldRunCode, setShouldRunCode] = useState(false);

  // const socket = useRef(null);

  const appendToOutputDivs = (el) => {
    if (!el) return;
    const clone = el.cloneNode(true);
    const desktop = document.getElementById("outputDivDesktop");
    const mobile = document.getElementById("outputDivMobile");

    if (desktop) desktop.appendChild(el);
    if (mobile) mobile.appendChild(clone);
  };

  useEffect(() => {
    if (!socket.current) {
      // socket.current = io("https://igniup.com", {
      //   path: "/socket.io/",
      //   transports: ["websocket", "polling"],
      //   withCredentials: true,
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
        res.style.wordWrap = "break-word";
        res.style.overflowWrap = "break-word";
        res.style.whiteSpace = "normal";
        res.style.width = "100%";

        // document.getElementById("outputDiv").appendChild(res);
        appendToOutputDivs(res);
      };

      const handleExitSuccess = () => {
        const exitMsg = document.createElement("p");
        exitMsg.innerText = "--- Program Exited Successfully ---";
        exitMsg.style.color = "black";
        exitMsg.style.fontWeight = "bold";
        exitMsg.style.marginTop = "10px";
        exitMsg.style.textAlign = "start";
        exitMsg.style.wordWrap = "break-word";
        exitMsg.style.overflowWrap = "break-word";
        exitMsg.style.whiteSpace = "normal";
        exitMsg.style.width = "100%";

        // document.getElementById("outputDiv").appendChild(exitMsg);
        appendToOutputDivs(exitMsg);
      };

      socket.current.on("pyResponse", handlePyResponse);
      socket.current.on("EXIT_SUCCESS", handleExitSuccess);

      socket.current.on("userInput", (message) => {
        setDisable(false);

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
          lineDiv.style.backgroundColor = "pink";
          appendToGrid(lineDiv);
        });

        // Create a container for the input prompt
        const inputPromptDiv = document.createElement("div");
        inputPromptDiv.id = "inputPromptDiv";
        inputPromptDiv.className = "input-prompt-container"; // Add a class for styling
        inputPromptDiv.style.display = "flex";
        inputPromptDiv.style.flexDirection = "column"; // Stack input and label vertically
        inputPromptDiv.style.alignItems = "flex-start";
        inputPromptDiv.style.backgroundColor = "blue"; // Customize this as needed
        inputPromptDiv.style.padding = "10px"; // Space for readability

        // Create a label for the last line
        const promptLabel = document.createElement("label");
        promptLabel.innerHTML = lines[lines.length - 1].replace(/\n/g, "<br>");
        promptLabel.className = "prompt-label"; // Add class for styling
        promptLabel.style.marginRight = "10px";
        promptLabel.style.color = "black";
        promptLabel.style.wordWrap = "break-word";
        promptLabel.style.overflowWrap = "break-word";
        promptLabel.style.whiteSpace = "normal";
        promptLabel.style.backgroundColor = "yellow";
        promptLabel.style.maxWidth = "100%";

        // Create the input box
        const inputBox = document.createElement("textarea");
        inputBox.id = "dynamicInput";
        inputBox.className = "input-box"; // Add class for styling
        inputBox.rows = 1; // Start small
        inputBox.style.padding = "4px 6px";
        inputBox.style.outline = "none";
        inputBox.style.backgroundColor = "purple";
        inputBox.style.color = "black";
        inputBox.style.width = "100%";
        inputBox.style.maxWidth = "100%";
        inputBox.style.resize = "none";
        inputBox.style.overflow = "hidden";
        inputBox.style.boxSizing = "border-box";
        inputBox.style.whiteSpace = "pre-wrap";
        inputBox.style.wordWrap = "break-word";

        // Optional: auto-grow textarea height as user types
        inputBox.addEventListener("input", () => {
          inputBox.style.height = "auto";
          inputBox.style.height = inputBox.scrollHeight + "px";
        });

        // Append label and input box to inputPromptDiv
        inputPromptDiv.appendChild(promptLabel);
        inputPromptDiv.appendChild(inputBox);

        // Append inputPromptDiv to the appropriate section in the grid layout
        appendToOutputDivs(inputPromptDiv);

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
        socket.current.close();
        socket.current = null;
        socket.current?.off("pyResponse", handlePyResponse);
        socket.current?.off("EXIT_SUCCESS", handleExitSuccess);
      }
    };
  }, []);

  // const handleRun = async () => {
  //   // console.log("first")
  //   if (editorContent != "") {
  //     setShowOutput(true);
  //     setDisable(true);
  //     clearOutput();
  //     // socket.current.close();
  //     socket.current.connect();
  //     // Emit the input data to the server using Socket.IO
  //     socket.current.emit("runPy", editorContent);
  //   }
  // };

  const handleRun = async () => {
    if (editorContent !== "") {
      setShowOutput(true);
      setShouldRunCode(true);
      setDisable(true);
      clearOutput();
    }
  };

  useEffect(() => {
    if (showOutput && shouldRunCode && socket.current) {
      socket.current.connect();
      socket.current.emit("runPy", editorContent);
      setShouldRunCode(false); // Reset the trigger
    }
  }, [showOutput, shouldRunCode]);

  const handleClose = () => {
    setShowOutput(false);
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
    try {
      // Check if the File System Access API is available
      if ("showOpenFilePicker" in window) {
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

        // Update the CodeMirror editor content directly
        if (editorRef.current) {
          editorRef.current.dispatch({
            changes: {
              from: 0,
              to: editorRef.current.state.doc.length,
              insert: fileContent,
            },
          });
        }
      } else {
        // Fallback for browsers that don't support File System Access API
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".sql,.txt";

        input.onchange = (e) => {
          const file = e.target.files[0];
          const reader = new FileReader();

          reader.onload = (event) => {
            const content = event.target.result;
            setEditorContent(content);

            // Update the CodeMirror editor content directly
            if (editorRef.current) {
              editorRef.current.dispatch({
                changes: {
                  from: 0,
                  to: editorRef.current.state.doc.length,
                  insert: content,
                },
              });
            }
          };

          reader.readAsText(file);
        };

        input.click();
      }
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Failed to open file");

      // If the user cancels the file picker, it throws an error
      if (error.name !== "AbortError") {
        toast.error("Failed to open file");
      }
    }
  };
  const handleClear = () => {
    if (editorContent) {
      setEditorContent("");
      if (editorRef.current) {
        editorRef.current.dispatch({
          changes: {
            from: 0,
            to: editorRef.current.state.doc.length,
            insert: "",
          },
        });
        setShowOutput(false);
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
      backgroundColor: darkTheme ? "#1E293B" : "#F1F5F9",
      color: darkTheme ? "#94A3B8" : "#64748B",
      borderRight: darkTheme ? "1px solid #334155" : "1px solid #E5E7EB",
    },
    ".cm-lineNumbers": {
      fontSize: "0.875rem",
      fontFamily: "monospace",
    },
    ".cm-activeLineGutter": {
      backgroundColor: darkTheme ? "#3B82F6" : "#3B82F6",
      color: "white !important",
      padding: "2px 0px",
    },
  });

  const customScrollbar = EditorView.theme({
    ".cm-scroller": {
      scrollbarWidth: "thin",
    },
    "::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "::-webkit-scrollbar-track": {
      background: darkTheme ? "#1E293B" : "#F3F4F6",
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb": {
      background: darkTheme ? "#475569" : "#D1D5DB",
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: darkTheme ? "#64748B" : "#9CA3AF",
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
      <div className="grid grid-rows-[3rem_1fr_4rem] h-screen w-screen overflow-hidden">
        
        <div className="w-full text-center p-2">
          <div className="h-full w-full"></div>
        </div>

        <div className="grid grid-cols-[1fr_7fr_1fr] w-full h-full overflow-hidden">
       
          <div className="p-2 flex items-center justify-center min-h-[120px]">
            <Ads />
          </div>

          <div className="flex flex-col items-center justify-center h-full w-full lg:gap-y-1 md:gap-y-1 px-1">
            <NavBar handleDownload={handleDownload} openFile={openFile} />
            <div
              className={`grid grid-cols-2 lg:grid-cols-[1fr_16fr] md:grid-cols-[1fr_6fr] grid-rows-1 lg:h-[85%] md:h-[85%] h-[90%] w-full overflow-hidden px-2 gap-2 ${
                darkTheme ? "bg-gray-800" : "bg-gray-50"
              } p-2 rounded-lg`}
            >
              <LeftMenu
                handleCopy={handleCopy}
                handlePaste={handlePaste}
                copyDone={copyDone}
                pasteDone={pasteDone}
                TableDetail={null}
                details={null}
              />

              <div className="flex items-center justify-center gap-x-2  w-full">
                
                <div
                  className={`border-2 w-[60%] h-full ${
                    darkTheme ? "border-blue-600" : "border-sky-700"
                  } rounded-lg flex flex-col items-center justify-start p-2 gap-y-1 ${
                    darkTheme ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  
                  <div
                    className={`w-full h-12 flex items-center justify-between gap-x-2 rounded-lg ${
                      darkTheme ? "bg-gray-700" : "bg-gray-200"
                    } px-2 py-7`}
                  >
                    <div className="flex items-center justify-center gap-x-1 px-2">
                      <img src={py} alt="python" className="w-8 h-8" />
                      <p
                        className={`font-black ${
                          darkTheme ? "text-white" : "text-black"
                        }`}
                      >
                        Python
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-x-2">
                      {editorBtns.map((btn, index) => (
                        <Button
                          key={index}
                          classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold ${
                            btn.text === "Execute"
                              ? "bg-[#10B335] hover:bg-green-600"
                              : "bg-[#FB2E38] hover:bg-[#FB2E10]"
                          } px-4 rounded-lg`}
                          action={btn.action}
                          text={btn.text}
                          icon={btn.icon}
                        />
                      ))}
                    </div>
                  </div>

                 
                  <div className="lg:h-[475px] md:h-[475px] h-full w-full flex items-start justify-center overflow-auto rounded-lg">
                    <CodeMirror
                      defaultValue={editorContent}
                      className="w-[750px] h-full text-[1rem] scrollbar-custom overflow-hidden"
                      theme={darkTheme ? oneDark : "light"}
                      extensions={[
                        fullHeightEditor,
                        customScrollbar,
                        highlightActiveLineGutter(),
                        lineNumbers(),
                        keymap.of(defaultKeymap),
                        indentOnInput(),
                      ]}
                      onChange={setEditorContent}
                      onCreateEditor={(editor) => {
                        editorRef.current = editor;
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`lg:flex md:flex border-2 w-[40%] h-full ${
                    darkTheme ? "border-blue-600" : "border-sky-700"
                  } rounded-lg p-2 hidden flex-col gap-y-1 ${
                    darkTheme ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`h-12 w-full flex items-center justify-between gap-x-2 rounded-lg ${
                      darkTheme ? "bg-gray-700" : "bg-gray-200"
                    } px-2`}
                    onClick={clearOutput}
                  >
                    <p
                      className={`font-black px-1 ${
                        darkTheme ? "text-white" : "text-black"
                      }`}
                    >
                      Output
                    </p>
                    <Button
                      classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold px-4 bg-[#FB2E38] hover:bg-[#FB2E10] rounded-lg text-xs`}
                      text={editorBtns[0].text}
                      icon={editorBtns[0].icon}
                    />
                  </div>
                  <div
                    id="outputDivDesktop"
                    className={`h-[450px] w-full overflow-y-auto ${
                      darkTheme
                        ? "text-gray-200 bg-gray-800"
                        : "text-black bg-white"
                    }`}
                  ></div>
                </div>
              </div>
              {showOutput && (
                <div
                  className={`lg:hidden md:hidden border-2 ${
                    darkTheme ? "border-blue-600" : "border-sky-700"
                  } w-full rounded-t-lg p-2 flex flex-col gap-y-1 absolute h-1/2 left-1/2 ${
                    darkTheme ? "bg-gray-800" : "bg-gray-100"
                  } -translate-x-1/2 bottom-0`}
                >
                  <div
                    className={`h-12 w-full flex items-center justify-between gap-x-2 rounded-lg ${
                      darkTheme ? "bg-gray-700" : "bg-gray-200"
                    } px-2 py-1`}
                  >
                    <p
                      className={`font-black px-1 ${
                        darkTheme ? "text-white" : "text-black"
                      }`}
                    >
                      Output
                    </p>
                    <div className="flex items-center gap-x-2">
                      <Button
                        classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold bg-[#F7665D] px-4 hover:bg-[#f7766d] rounded-lg text-xs`}
                        text={editorBtns[0].text}
                        icon={editorBtns[0].icon}
                        action={clearOutput}
                      />
                      <button
                        onClick={handleClose}
                        className={`p-2 rounded-full ${
                          darkTheme ? "hover:bg-gray-600" : "hover:bg-gray-300"
                        }`}
                      >
                        <X
                          size={20}
                          className={darkTheme ? "text-white" : "text-black"}
                        />
                      </button>
                    </div>
                  </div>
                  <div
                    id="outputDivMobile"
                    className={`h-[450px] w-full overflow-auto ${
                      darkTheme
                        ? "text-gray-200 bg-gray-800"
                        : "text-black bg-white"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="p-2 flex items-center justify-center min-h-[120px]">
            <Ads />
          </div>
        </div>

        <div className="w-full text-center p-2">
          <div className="h-full w-full"></div>
        </div>
      </div>

      {/* <div ></div> */}

    </>
  );
}

export default PythonIDE;
