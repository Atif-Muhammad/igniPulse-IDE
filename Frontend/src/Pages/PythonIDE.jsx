import { React, useState, useRef, useEffect, useCallback } from "react";
import {
  CirclePlay,
  Eraser,
  X,
  Maximize2,
  Minimize2,
  StopCircleIcon,
  HelpCircle,
} from "lucide-react";
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
import { EditorSelection } from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import py from "../assets/py.svg";
import LeftMenu from "../components/LeftMenu";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import Ads from "../components/Ads";
import SpinnerIcon from "../components/SpinnerIcon";
import { useLocation } from "react-router-dom";
import escapeHtml from "../Functions/escapeHtml";
import config from "../../Config/config";
import { useMutation } from "@tanstack/react-query";
import { ErrorModalComponent } from "../models/index";
// import AgentRes from "../components/AgentRes";
// import LinearLoader from "../components/Loaders/LinearLoader";

const insertSpacesAtCursor = keymap.of([
  {
    key: "Tab",
    preventDefault: true,
    run(view) {
      // console.log("first");
      const indent = "    ";

      const { state } = view;

      const transaction = state.changeByRange((range) => {
        if (range.empty) {
          // Insert indent at the cursor position
          return {
            changes: { from: range.from, insert: indent },
            range: EditorSelection.cursor(range.from + indent.length),
          };
        } else {
          // Replace selected text with indent
          return {
            changes: { from: range.from, to: range.to, insert: indent },
            range: EditorSelection.cursor(range.from + indent.length),
          };
        }
      });

      view.dispatch(transaction);
      return true;
    },
  },
]);

function PythonIDE() {
  const location = useLocation();
  const editorType = location.state || "gen";

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
  const [isError, setIsError] = useState(false);
  // const [isPending, setIsPending] = useState(false);
  const [agentRes, setAgentRes] = useState(null);
  const socket = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userEntry, setUserEntry] = useState(false);
  const isCanceledRef = useRef(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [outputZoomLevel, setOutputZoomLevel] = useState(1);
  const [codeModified, setCodeModified] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    mutate: handleAgentCall,
    data,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => await config.callAgent(editorContent),
  });

  useEffect(() => {
    if (isSuccess) {
      // console.log(editorContent)
      setAgentRes(null);
      const final = data?.data?.output?.includes("```json")
        ? JSON.parse(
            data?.data?.output?.replace(/```json\n?/, "").replace(/```$/, "")
          )
        : typeof data?.data?.output === "string"
        ? JSON.parse(data?.data?.output)
        : data?.data?.output;
      setAgentRes(final);
    }
  }, [data?.data, isSuccess]);

  // / Add these zoom functions:
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Max zoom 200%
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.8)); // Min zoom 80%
  };

  const handleOutputZoomIn = () => {
    setOutputZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Max zoom 200%
  };

  const handleOutputZoomOut = () => {
    setOutputZoomLevel((prev) => Math.max(prev - 0.1, 0.8)); // Min zoom 80%
  };

  const clearOutput = () => {
    const desktopOutput = document.getElementById("outputDivDesktop");
    const mobileOutput = document.getElementById("outputDivMobile");

    if (desktopOutput) desktopOutput.innerText = "";
    if (mobileOutput) mobileOutput.innerText = "";
  };

  const replaceOutputDivs = (el) => {
    // if (isCanceledRef.current) return;
    if (!el) return;
    const clone = el.cloneNode(true);
    const desktop = document.getElementById("outputDivDesktop");
    const mobile = document.getElementById("outputDivMobile");
    // Apply zoom level to the new element
    el.style.fontSize = `${outputZoomLevel * 100}%`;
    clone.style.fontSize = `${outputZoomLevel * 100}%`;

    if (desktop) {
      desktop.innerHTML = "";
      desktop.appendChild(el);
    }

    if (mobile) {
      mobile.innerHTML = "";
      mobile.appendChild(clone);
    }
    // Add styling to ensure proper display
    el.style.display = "block";
    el.style.width = "100%";
    el.style.fontFamily = "monospace";
    el.style.wordBreak = "break-word";
  };

  const appendToOutputDivs = (el) => {
    // if (isCanceledRef.current) return;
    if (!el) return;
    const clone = el.cloneNode(true);
    const desktop = document.getElementById("outputDivDesktop");
    const mobile = document.getElementById("outputDivMobile");

    // Apply zoom level to the new element
    el.style.fontSize = `${outputZoomLevel * 100}%`;
    clone.style.fontSize = `${outputZoomLevel * 100}%`;
    clone.style.fontFamily = "monospace";
    // clone.style.fontSize = "17px";

    if (desktop) desktop.appendChild(el);
    if (mobile) mobile.appendChild(clone);
    // Add styling to ensure proper display
    el.style.display = "block";
    el.style.width = "100%";
    el.style.fontSize = "15px";
    el.style.fontFamily = "monospace";
    el.style.wordBreak = "break-word";
  };

  useEffect(() => {
    const updateZoomForOutput = () => {
      const ids = ["outputDivDesktop", "outputDivMobile"];
      ids.forEach((id) => {
        const output = document.getElementById(id);
        if (output) {
          Array.from(output.children).forEach((child) => {
            child.style.fontSize = `${outputZoomLevel * 100}%`;
          });
        }
      });
    };

    updateZoomForOutput();
  }, [outputZoomLevel]);

  useEffect(() => {
    const handlePyResponse = (message) => {
      if (isCanceledRef.current) return;
      setUserEntry(false);
      var escapedMsgs = "";

      if (message.startsWith('"') && message.endsWith('"')) {
        escapedMsgs = escapeHtml(message.replace(/^"(.*)"$/, "$1"));
      } else {
        escapedMsgs = message;
      }
      // console.log(escapedMsgs)
      setDisable(false);
      // setLoading(false);

      let formattedMessage = escapedMsgs.replace(/\r\n|\r|\n/g, "\n");

      if (formattedMessage.startsWith("\n")) {
        formattedMessage = "<br>" + formattedMessage.trimStart();
      }
      if (formattedMessage.endsWith("\n")) {
        formattedMessage = formattedMessage.trimEnd() + "<br>";
      }
      formattedMessage = formattedMessage.replace(/\n/g, "<br>");

      const res = document.createElement("div");
      res.innerHTML = formattedMessage;
      res.style.fontSize = "15px";
      // res.style.paddingBottom = "6px";
      // res.style.padding = "2px";
      // res.style.whiteSpace = "pre";
      // res.style.wordBreak = "normal";
      // res.style.overflowWrap = "break-word";// disable word breaking
      res.style.width = "100%"; // make div as wide as content
      // res.style.maxWidth = "100%";

      // document.getElementById("outputDiv").appendChild(res);
      appendToOutputDivs(res);
    };

    const handleExitSuccess = () => {
      if (isCanceledRef.current) return;
      setUserEntry(false);
      setLoading(false);
      const exitMsg = document.createElement("p");
      exitMsg.innerText = "--- Program Executed Successfully ---";
      exitMsg.style.fontWeight = "bold";
      exitMsg.style.marginTop = "10px";
      exitMsg.style.textAlign = "start";
      exitMsg.style.wordWrap = "break-word";
      exitMsg.style.overflowWrap = "break-word";
      exitMsg.style.whiteSpace = "normal";
      exitMsg.style.width = "100%";

      // document.getElementById("outputDiv").appendChild(exitMsg);
      appendToOutputDivs(exitMsg);
      setIsCancelling(false);
    };

    const handleExitError = () => {
      if (isCanceledRef.current) return;
      setUserEntry(false);
      setLoading(false);
      setIsError(true);
      setCodeModified(false);
      const exitMsg = document.createElement("p");
      exitMsg.innerText = "--- Program Exited with Errors ---";
      exitMsg.style.fontWeight = "bold";
      exitMsg.style.marginTop = "10px";
      exitMsg.style.textAlign = "start";
      exitMsg.style.wordWrap = "break-word";
      exitMsg.style.overflowWrap = "break-word";
      exitMsg.style.whiteSpace = "normal";
      exitMsg.style.width = "100%";

      // document.getElementById("outputDiv").appendChild(exitMsg);
      appendToOutputDivs(exitMsg);
      setIsCancelling(false);
    };

    const handleUser = (message) => {
      if (isCanceledRef.current) return;
      setUserEntry(true);
      setDisable(false);

      let formattedMessage = message.replace(/\r\n|\r|\n/g, "\n");
      const lines = formattedMessage
        .match(/[^\n]*(\n|$)/g)
        .filter((line) => line !== "");

      lines.slice(0, -1).forEach((line) => {
        const lineDiv = document.createElement("div");
        lineDiv.innerHTML = line.replace(/\n/g, "<br>");
        lineDiv.style.marginBottom = "2px";
        lineDiv.style.fontSize = `${outputZoomLevel * 100}%`; // Apply zoom
        lineDiv.style.fontFamily = "monospace";
        appendToOutputDivs(lineDiv);
      });

      const existingContentSpan = document.createElement("span");
      existingContentSpan.className = "existing-content";
      existingContentSpan.textContent = lines[lines.length - 1];
      existingContentSpan.setAttribute("contenteditable", "false");
      existingContentSpan.style.backgroundColor = "transparent";
      existingContentSpan.style.whiteSpace = "pre";
      existingContentSpan.style.wordBreak = "normal";
      existingContentSpan.style.overflowWrap = "break-word";
      existingContentSpan.style.boxSizing = "border-box";
      existingContentSpan.style.display = "inline";
      existingContentSpan.style.fontSize = `${outputZoomLevel * 100}%`; // Apply zoom
      existingContentSpan.style.fontFamily = "monospace";

      const promptLabel = document.createElement("span");
      promptLabel.className = "prompt-label";
      promptLabel.style.whiteSpace = "pre";
      promptLabel.style.wordBreak = "normal";
      promptLabel.style.overflowWrap = "break-word";
      promptLabel.style.boxSizing = "border-box";
      promptLabel.setAttribute("contenteditable", "true");
      promptLabel.style.display = "inline";
      promptLabel.style.backgroundColor = "transparent";
      promptLabel.innerHTML = " ";
      promptLabel.style.fontSize = `${outputZoomLevel * 100}%`; // Apply zoom
      promptLabel.style.fontFamily = "monospace";

      promptLabel.style.outline = "none";
      promptLabel.style.border = "none";

      const inputPromptDiv = document.createElement("div");
      inputPromptDiv.id = "inputPromptDiv";
      // inputPromptDiv.style.padding = "2px";
      inputPromptDiv.style.width = "100%";
      inputPromptDiv.style.fontSize = `${outputZoomLevel * 100}%`; // Apply zoom
      inputPromptDiv.style.fontFamily = "monospace";
      inputPromptDiv.appendChild(existingContentSpan);
      inputPromptDiv.appendChild(promptLabel);

      appendToOutputDivs(inputPromptDiv);

      promptLabel.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(promptLabel);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const userInput = promptLabel.textContent.trim();

          if (userInput) {
            socket.current.emit("userEntry", userInput);
            promptLabel.setAttribute("contenteditable", "false");

            // Remove the event listener after submission
            promptLabel.removeEventListener("keydown", handleKeyDown);

            // For mobile, ensure the virtual keyboard doesn't interfere
            if (window.innerWidth <= 768) {
              promptLabel.blur();
            }
          }
        }
      };

      promptLabel.addEventListener("keydown", handleKeyDown);

      // Additional handling for mobile devices
      if (window.innerWidth <= 768) {
        // Ensure the modal is open
        setShowOutput(true);

        // Add a submit button for mobile users
        const mobileSubmitButton = document.createElement("button");
        mobileSubmitButton.textContent = "Submit";
        mobileSubmitButton.style.marginTop = "10px";
        mobileSubmitButton.style.padding = "5px 10px";
        mobileSubmitButton.style.backgroundColor = "#10B335";
        mobileSubmitButton.style.color = "white";
        mobileSubmitButton.style.border = "none";
        mobileSubmitButton.style.borderRadius = "5px";
        mobileSubmitButton.style.fontFamily = "monospace";

        mobileSubmitButton.addEventListener("click", () => {
          const userInput = promptLabel.textContent.trim();
          if (userInput) {
            socket.current.emit("userEntry", userInput);
            promptLabel.setAttribute("contenteditable", "false");
            inputPromptDiv.removeChild(mobileSubmitButton);
          }
        });

        inputPromptDiv.appendChild(mobileSubmitButton);
      }
    };

    const handleGraphOutput = (imageData) => {
      if (isCanceledRef.current) return;
      setUserEntry(false);
      setShowGraph(true);
      setGraphData(imageData);
    };
    const handleCancelled = (message) => {
      // clearOutput();
      // console.log(message);
      isCanceledRef.current = true;
      setLoading(false);
      setDisable(false);
      setIsCancelling(false);
      appendToOutputDivs(document.createTextNode(message));
    };

    if (!socket.current) {
      // socket.current = io("https://igniup.com", {
      //   path: "/socket.io/",
      //   transports: ["websocket", "polling"],
      //   withCredentials: true,
      // });
      socket.current = io("http://localhost:9000", { withCredentials: true });
      socket.current.on("pyResponse", handlePyResponse);
      socket.current.on("graphOutput", handleGraphOutput);
      socket.current.on("EXIT_SUCCESS", handleExitSuccess);
      socket.current.on("EXIT_ERROR", handleExitError);
      socket.current.on("userInput", handleUser);
      socket.current.on("cancelled", handleCancelled);
    }

    return () => {
      if (socket.current) {
        socket.current?.off("pyResponse", handlePyResponse);
        socket.current?.off("graphOutput", handleGraphOutput);
        socket.current?.off("EXIT_SUCCESS", handleExitSuccess);
        socket.current?.off("EXIT_ERROR", handleExitError);
        socket.current?.off("userInput", handleUser);
        socket.current?.off("cancelled", handleCancelled);
        socket.current?.disconnect();
        socket.current?.close();
        socket.current = null;
      }
    };
  }, []);

  const handleCancel = (timeOut) => {
    if (!isCanceledRef.current && socket.current) {
      setIsCancelling(true);
      isCanceledRef.current = true;
      socket.current.emit("cancel", timeOut);
      if (timeOut) {
        isCanceledRef.current = true;
        setLoading(false);
        setDisable(false);
        setIsCancelling(false);
        appendToOutputDivs(
          document.createTextNode("<<< Execution timed out >>>")
        );
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      // console.log(
      //   "Timeout check — userEntry:",
      //   userEntry,
      //   "| loading:",
      //   loading
      // );
      if (!userEntry && loading && !isCancelling) {
        handleCancel(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [userEntry, loading]);

  const handleRun = async () => {
    if (editorContent !== "") {
      clearOutput();
      setDisable(true);
      setLoading(true);
      setShowOutput(true);
      setShouldRunCode(true);
      if (socket.current) {
        // setIsError(false);
        isCanceledRef.current = false;
        socket.current.connect();
        socket.current.emit("runPy", editorContent, editorType);
      }
    }
  };

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
    "&": {
      height: "100%",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
    },
    ".cm-scroller": {
      flex: 1,
      overflow: "auto",
      minHeight: "0",
    },
    ".cm-content": {
      flex: 1,
      minHeight: "0",
    },
    ".cm-gutters": {
      height: "100%",
    },
  });

  const customScrollbar = EditorView.theme({
    "&.cm-editor": {
      height: "100%",
      maxHeight: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
      flex: "1 1 auto",
      minHeight: "0",
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

  // zoom theme extension
  const zoomTheme = EditorView.theme({
    "&": {
      fontSize: `${zoomLevel * 100}%`,
    },
    ".cm-content": {
      fontSize: `${zoomLevel * 100}%`,
    },
    ".cm-gutterElement": {
      fontSize: `${zoomLevel * 100}%`,
    },
  });

  // Create a custom theme extension that respects the zoom level
  const zoomButtons = EditorView.theme({
    ".cm-editor": {
      position: "relative",
    },
    ".cm-zoom-buttons": {
      position: "absolute",
      bottom: "3px",
      right: "3px",
      display: "flex",
      gap: "5px",
      // zIndex: "",
    },
    ".cm-zoom-button": {
      width: "28px",
      height: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      backgroundColor: darkTheme ? "#475569" : "#D1D5DB",
      color: darkTheme ? "white" : "black",
      cursor: "pointer",
      border: "none",
      fontSize: "12px",
      "&:hover": {
        backgroundColor: darkTheme ? "#64748B" : "#9CA3AF",
      },
    },
  });

  return (
    <>
      <div
        className={`${
          showGraph ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-[5%_90%_5%] py-15">
          <div className="p-2 hidden md:flex items-center justify-center min-h-[120px]">
            {/* <Ads /> */}
          </div>
          <div className="flex flex-col items-center justify-center h-full  min-h-[120px] w-full lg:gap-y-1 md:gap-y-1 px-1">
            <NavBar handleDownload={handleDownload} openFile={openFile} />

            <div
              className={`flex flex-col md:grid md:grid-cols-[auto_1fr] md:h-[85%] h-[90%] w-full overflow-hidden px-2 gap-2 ${
                darkTheme ? "bg-gray-800" : "bg-gray-50"
              } p-2 rounded-lg`}
            >
              <div className="w-full md:w-auto">
                {/* Left Menu */}
                <LeftMenu
                  handleCopy={handleCopy}
                  handlePaste={handlePaste}
                  copyDone={copyDone}
                  pasteDone={pasteDone}
                  TableDetail={null}
                  details={null}
                />
              </div>

              {/* Editor and Output */}
              <div className="w-full h-full flex flex-row gap-2 overflow-hidden">
                <div
                  className={`flex flex-col h-full flex-[7] min-w-0 overflow-hidden border-2 ${
                    darkTheme
                      ? "border-blue-600 bg-gray-800"
                      : "border-sky-700 bg-white"
                  } rounded-lg p-2 gap-y-1`}
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
                        {editorType === "ds" ? "Python Data Science" : "Python"}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-x-2">
                      {editorBtns.map((btn, index) => {
                        if (loading && btn.text === "Execute") {
                          return isCancelling ? (
                            <Button
                              key={index}
                              classNames="cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-bold bg-yellow-600 hover:bg-yellow-700 px-4 rounded-lg"
                              text="Cancelling..."
                              icon={<SpinnerIcon />}
                              disabled={true}
                            />
                          ) : (
                            <Button
                              key={index}
                              classNames="cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-bold bg-[#FB2E38] hover:bg-[#FB2E10] px-4 rounded-lg"
                              action={() => handleCancel(false)}
                              text="Cancel"
                              icon={<StopCircleIcon />}
                            />
                          );
                        }

                        return (
                          <Button
                            key={index}
                            classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-bold ${
                              btn.text === "Execute"
                                ? "bg-[#10B335] hover:bg-green-600"
                                : "bg-[#FB2E38] hover:bg-[#FB2E10]"
                            } px-4 rounded-lg`}
                            action={btn.action}
                            text={btn.text}
                            icon={btn.icon}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className="flex flex-col w-full h-full overflow-hidden relative"
                    style={{ height: "70vh" }}
                  >
                    <CodeMirror
                      defaultValue={editorContent}
                      className="CodeMirror w-full h-full text-[1rem] scrollbar-custom"
                      style={{
                        height: "100%",
                        maxHeight: "100%",
                        overflow: "auto",
                      }}
                      theme={darkTheme ? oneDark : "light"}
                      extensions={[
                        fullHeightEditor,
                        customScrollbar,
                        highlightActiveLineGutter(),
                        lineNumbers(),
                        insertSpacesAtCursor,
                        zoomTheme,
                        zoomButtons,
                      ]}
                      onChange={(value) => {
                        setEditorContent(value);
                        setCodeModified(true);
                        if (isError) {
                          setIsError(false);
                          setAgentRes(null);
                        }
                      }}
                      onCreateEditor={(editor) => {
                        editorRef.current = editor;
                        const zoomContainer = document.createElement("div");
                        zoomContainer.className = "cm-zoom-buttons";

                        // Zoom Out Button with Magnifying Glass and Minus icon
                        const zoomOutButton = document.createElement("button");
                        zoomOutButton.className = "cm-zoom-button";
                        zoomOutButton.title = "Zoom Out";
                        zoomOutButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>`;
                        zoomOutButton.onclick = (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleZoomOut();
                        };

                        // Zoom In Button with Magnifying Glass and Plus icon
                        const zoomInButton = document.createElement("button");
                        zoomInButton.className = "cm-zoom-button";
                        zoomInButton.title = "Zoom In ";
                        zoomInButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>`;
                        zoomInButton.onclick = (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleZoomIn();
                        };

                        zoomContainer.appendChild(zoomOutButton);
                        zoomContainer.appendChild(zoomInButton);

                        editor.dom.appendChild(zoomContainer);
                      }}
                    />

                    {/* Error Modal */}
                    <ErrorModalComponent
                      isError={isError && !codeModified}
                      isPending={isPending}
                      agentRes={agentRes}
                      handleAgentCall={handleAgentCall}
                      setAgentRes={setAgentRes}
                    />
                  </div>
                </div>

                <div
                  className={`hidden md:flex flex-col h-full flex-[4] min-w-0 border-2 ${
                    darkTheme
                      ? "border-blue-600 bg-gray-800"
                      : "border-sky-700 bg-white"
                  } rounded-lg p-2 gap-y-1 relative`}
                >
                  <div
                    className={`h-14 w-full flex items-center justify-between gap-x-2 rounded-lg ${
                      darkTheme ? "bg-gray-700" : "bg-gray-200"
                    } px-2`}
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
                        classNames="cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold px-4 bg-[#FB2E38] hover:bg-[#FB2E10] rounded-lg text-xs"
                        text={editorBtns[0].text}
                        icon={editorBtns[0].icon}
                        action={clearOutput}
                      />
                    </div>
                  </div>
                  <div
                    id="outputDivDesktop"
                    className={`w-full overflow-auto rounded-lg ${
                      darkTheme
                        ? "text-gray-200 bg-gray-800"
                        : "text-black bg-white"
                    }`}
                    style={{
                      height: "70vh",
                      display: "flex",
                      flexDirection: "column",
                      whiteSpace: "pre",
                      wordBreak: "break-word",
                      overflow: "auto",
                      fontSize: `${outputZoomLevel * 100}%`,
                    }}
                  ></div>
                  {/* Zoom buttons for desktop output */}
                  <div className="absolute bottom-3 right-2 flex  gap-1 z-10">
                    <button
                      onClick={handleOutputZoomOut}
                      className={`w-7 h-7 flex items-center justify-center rounded ${
                        darkTheme
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      title="Zoom Out"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={darkTheme ? "white" : "black"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </button>
                    <button
                      onClick={handleOutputZoomIn}
                      className={`w-7 h-7 flex items-center justify-center rounded ${
                        darkTheme
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      title="Zoom In"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={darkTheme ? "white" : "black"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Output (Mobile only) */}
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
                        classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold bg-[#FB2E38] hover:bg-[#FB2E10] px-4 rounded-lg text-xs`}
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
                    className={`flex-1 w-full overflow-auto ${
                      darkTheme
                        ? "text-gray-200 bg-gray-800"
                        : "text-black bg-white"
                    }`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      whiteSpace: "pre",
                      wordBreak: "break-word",
                      fontSize: `${outputZoomLevel * 100}%`,
                    }}
                  ></div>
                  {/* Zoom buttons for mobile output */}
                  <div className="flex justify-end gap-2 p-2">
                    <button
                      onClick={handleOutputZoomOut}
                      className={`w-7 h-7 flex items-center justify-center rounded ${
                        darkTheme
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      title="Zoom Out"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={darkTheme ? "white" : "black"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </button>
                    <button
                      onClick={handleOutputZoomIn}
                      className={`w-7 h-7 flex items-center justify-center rounded ${
                        darkTheme
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      title="Zoom In"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={darkTheme ? "white" : "black"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-2 hidden md:flex items-center justify-center min-h-[120px]">
            {/* <Ads /> */}
          </div>
        </div>
      </div>
      {showGraph && (
        <div
          className={`fixed ${
            isGraphFullscreen
              ? "inset-0"
              : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          } 
        ${darkTheme ? "bg-gray-800" : "bg-white"} 
        ${isGraphFullscreen ? "w-full h-full" : "w-1/2 h-2/3"} 
        shadow-2xl shadow-black rounded-lg z-50 border flex flex-col bg-black/40  backdrop-blur-sm `}
        >
          <div
            className={`flex justify-between items-center p-2 ${
              darkTheme ? "bg-gray-700" : "bg-gray-200"
            } rounded-t-lg `}
          >
            <h3
              className={`font-bold ${darkTheme ? "text-white" : "text-black"}`}
            >
              Graph Output
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsGraphFullscreen(!isGraphFullscreen)}
                className="p-1 rounded hover:bg-gray-600"
              >
                {isGraphFullscreen ? (
                  <Minimize2
                    size={20}
                    className={darkTheme ? "text-white" : "text-black"}
                  />
                ) : (
                  <Maximize2
                    size={20}
                    className={darkTheme ? "text-white" : "text-black"}
                  />
                )}
              </button>
              <button
                onClick={() => {
                  setShowGraph(false);
                  setIsGraphFullscreen(false);
                }}
                className="p-1 rounded bg-red-600 hover:bg-red-500"
              >
                <X
                  size={20}
                  className={darkTheme ? "text-white" : "text-white"}
                />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              src={graphData}
              alt="Graph output"
              className={`${
                isGraphFullscreen ? "max-h-[90vh]" : "max-h-full"
              } max-w-full object-contain`}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default PythonIDE;
