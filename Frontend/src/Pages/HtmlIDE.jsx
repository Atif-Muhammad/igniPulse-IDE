import { React, useState, useRef, useEffect } from "react";
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
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import {
  EditorView,
  highlightActiveLineGutter,
  lineNumbers,
  keymap,
} from "@codemirror/view";
import { EditorSelection } from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import HTML from "../assets/HTML.webp";
import CSS from "../assets/Css.webp";
import JS from "../assets/JS.webp";
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

const insertSpacesAtCursor = keymap.of([
  {
    key: "Tab",
    preventDefault: true,
    run(view) {
      const indent = "    ";
      const { state } = view;

      const transaction = state.changeByRange((range) => {
        if (range.empty) {
          return {
            changes: { from: range.from, insert: indent },
            range: EditorSelection.cursor(range.from + indent.length),
          };
        } else {
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

function HtmlIDE() {

  const { darkTheme } = useTheme();
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("html");
  const [tickerSuccess, setTickerSuccess] = useState({
    flag: false,
    message: "",
  });
  const [copyDone, setCopyDone] = useState(false);
  const [pasteDone, setPasteDone] = useState(false);
  const [htmlContent, setHtmlContent] = useState(
    `<!-- Write your HTML code here -->`
  );
  const [cssContent, setCssContent] = useState(
    `/* Write your CSS code here */`
  );
  const [jsContent, setJsContent] = useState(
    `// Write your JavaScript code here`
  );
  const [disable, setDisable] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [shouldRunCode, setShouldRunCode] = useState(false);
  const [isError, setIsError] = useState(false);
  const [agentRes, setAgentRes] = useState(null);
  const socket = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userEntry, setUserEntry] = useState(false);
  const isCanceledRef = useRef(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [codeModified, setCodeModified] = useState(false);
  const [isOutputFullscreen, setIsOutputFullscreen] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [codeValue, setCodeValue] = useState("");

  const {
    mutate: handleAgentCall,
    data,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => await config.callAgent(getCombinedContent()),
  });

  const toggleOutputModal = () => {
    setIsOutputModalOpen(!isOutputModalOpen);
  };

  const getCombinedContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
        <script>${jsContent}</script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    if (isSuccess) {
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

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.8));
  };

  const clearOutput = () => {
    const desktopOutput = document.getElementById("outputDivDesktop");
    const mobileOutput = document.getElementById("outputDivMobile");

    if (desktopOutput) desktopOutput.innerText = "";
    if (mobileOutput) mobileOutput.innerText = "";
  };

  const appendToOutputDivs = (htmlString) => {
    const targets = [
      "outputDivDesktop",
      "outputDivMobile",
      "outputModalContent",
    ];

    targets.forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;

      // Clear existing content
      container.innerHTML = "";

      // Create new iframe
      const iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      container.appendChild(iframe);

      // Write content to iframe
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(htmlString);
      doc.close();
    });
  };

  useEffect(() => {
    // If output should be shown and we're on mobile
    if (showOutput && window.innerWidth < 768) {
      const mobileOutput = document.getElementById("outputDivMobile");
      if (mobileOutput && mobileOutput.innerHTML === "") {
        const content = getCombinedContent();
        appendToOutputDivs(content);
      }
    }
  }, [showOutput]);

  const handleRun = async () => {
    const content = getCombinedContent();
    clearOutput();
    setDisable(true);
    setLoading(true);

    // Always show output on mobile when executing
    if (window.innerWidth < 768) {
      // Mobile breakpoint
      setShowOutput(true);
    }

    setShouldRunCode(true);
    appendToOutputDivs(content);
  };

  const handleClose = () => {
    setShowOutput(false);
  };

  const handleDownload = async () => {
    const content = getCombinedContent();
    if (window.showSaveFilePicker) {
      const fileHandler = await window.showSaveFilePicker({
        suggestedName: "code.html",
        types: [
          {
            accept: { "text/plain": [".html"] },
          },
        ],
      });

      const writeAbleStream = await fileHandler.createWritable();
      await writeAbleStream.write(content);
      await writeAbleStream.close();
    } else {
      const element = document.createElement("a");
      const file = new Blob([content || ""], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      element.download = `code.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleCopy = async () => {
    try {
      let content = "";
      if (activeTab === "html") content = htmlContent;
      else if (activeTab === "css") content = cssContent;
      else if (activeTab === "js") content = jsContent;

      if (content.trim()) {
        await navigator.clipboard.writeText(content);
        setCopyDone(true);
        setTimeout(() => {
          setCopyDone(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
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

        if (activeTab === "html")
          setHtmlContent(editorRef.current.state.doc.toString());
        else if (activeTab === "css")
          setCssContent(editorRef.current.state.doc.toString());
        else if (activeTab === "js")
          setJsContent(editorRef.current.state.doc.toString());

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
      if ("showOpenFilePicker" in window) {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              accept: {
                "text/plain": [".txt", ".html", ".css", ".js"],
              },
            },
          ],
          multiple: false,
        });

        const file = await fileHandle.getFile();
        const fileContent = await file.text();

        if (file.name.endsWith(".html") || file.name.endsWith(".htm")) {
          setHtmlContent(fileContent || `<!-- Write your HTML code here -->`);
          setActiveTab("html");
        } else if (file.name.endsWith(".css")) {
          setCssContent(fileContent || `/* Write your CSS code here */`);
          setActiveTab("css");
        } else if (file.name.endsWith(".js")) {
          setJsContent(fileContent || `// Write your JavaScript code here`);
          setActiveTab("js");
        }

        if (editorRef.current) {
          editorRef.current.dispatch({
            changes: {
              from: 0,
              to: editorRef.current.state.doc.length,
              insert: fileContent || getCurrentContent(),
            },
          });
        }
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".html,.htm,.css,.js,.txt";

        input.onchange = (e) => {
          const file = e.target.files[0];
          const reader = new FileReader();

          reader.onload = (event) => {
            const content = event.target.result;

            if (file.name.endsWith(".html") || file.name.endsWith(".htm")) {
              setHtmlContent(content || `<!-- Write your HTML code here -->`);
              setActiveTab("html");
            } else if (file.name.endsWith(".css")) {
              setCssContent(content || `/* Write your CSS code here */`);
              setActiveTab("css");
            } else if (file.name.endsWith(".js")) {
              setJsContent(content || `// Write your JavaScript code here`);
              setActiveTab("js");
            }

            if (editorRef.current) {
              editorRef.current.dispatch({
                changes: {
                  from: 0,
                  to: editorRef.current.state.doc.length,
                  insert: content || getCurrentContent(),
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
      if (error.name !== "AbortError") {
        toast.error("Failed to open file");
      }
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.dispatch({
        changes: {
          from: 0,
          to: editorRef.current.state.doc.length,
          insert: "",
        },
      });

      if (activeTab === "html") setHtmlContent("");
      else if (activeTab === "css") setCssContent("");
      else if (activeTab === "js") setJsContent("");

      setShowOutput(false);
      editorRef.current.focus();
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

  const getCurrentContent = () => {
    switch (activeTab) {
      case "html":
        return htmlContent || `<!-- Write your HTML code here -->`;
      case "css":
        return cssContent || `/* Write your CSS code here */`;
      case "js":
        return jsContent || `// Write your JavaScript code here`;
      default:
        return htmlContent || `<!-- Write your HTML code here -->`;
    }
  };

  const setCurrentContent = (value) => {
    switch (activeTab) {
      case "html":
        setHtmlContent(value);
        break;
      case "css":
        setCssContent(value);
        break;
      case "js":
        setJsContent(value);
        break;
      default:
        setHtmlContent(value);
    }
  };

  const getLanguageExtension = () => {
    switch (activeTab) {
      case "html":
        return html();
      case "css":
        return css();
      case "js":
        return javascript();
      default:
        return html();
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case "html":
        return HTML;
      case "css":
        return CSS;
      case "js":
        return JS;
      default:setDisable
        return HTML;
    }
  };

  useEffect(()=>{
    setCodeValue(getCurrentContent())
  }, [activeTab])

  const getTabName = () => {
    switch (activeTab) {
      case "html":
        return "HTML";
      case "css":
        return "CSS";
      case "js":
        return "JavaScript";
      default:
        return "HTML";
    }
  };

  const OutputModal = () => {
    // Get the current combined content
    const content = getCombinedContent();

    // Use useEffect to update the modal content when it opens
    useEffect(() => {
      const modalOutput = document.getElementById("outputModalContent");
      if (modalOutput && content) {
        modalOutput.innerHTML = "";
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        modalOutput.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
      }
    }, [content, isOutputModalOpen]);

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-gray-200 dark:bg-gray-700">
            <h2 className="font-bold text-black dark:text-white">
              Output Preview
            </h2>
            <button
              onClick={toggleOutputModal}
              className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <X className="text-black dark:text-white" size={20} />
            </button>
          </div>
          <div
            id="outputModalContent"
            className="h-full pt-14 overflow-auto"
          ></div>
        </div>
      </div>
    );
  };

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
          <div className="flex flex-col items-center justify-center h-full min-h-[120px] w-full lg:gap-y-1 md:gap-y-1 px-1">
            <NavBar handleDownload={handleDownload} openFile={openFile} />

            <div
              className={`flex flex-col md:grid md:grid-cols-[auto_1fr] md:h-[85%] h-[90%] w-full overflow-hidden px-2 gap-2 ${
                darkTheme ? "bg-gray-800" : "bg-gray-50"
              } p-2 rounded-lg`}
            >
              <div className="w-full md:w-auto">
                <LeftMenu
                  handleCopy={handleCopy}
                  handlePaste={handlePaste}
                  copyDone={copyDone}
                  pasteDone={pasteDone}
                  TableDetail={null}
                  details={null}
                />
              </div>

              <div className="w-full h-full flex flex-row gap-2 overflow-hidden">
                <div
                  className={`flex flex-col h-full flex-[7] min-w-0 overflow-hidden border-2 ${
                    darkTheme
                      ? "border-blue-600 bg-gray-800"
                      : "border-sky-700 bg-white"
                  } rounded-lg p-2 gap-y-1`}
                >
                  <div
                    className={`w-full h-12 flex flex-row items-center justify-between gap-1  rounded-lg ${
                      darkTheme ? "bg-gray-700" : "bg-gray-200"
                    } lg:px-2 py-7`}
                  >
                    {/* LEFT: Icon + Tab Name */}
                    <div className="flex w-full md:w-1/3  items-center justify-start gap-x-2 px-1">
                      <img
                        src={getTabIcon()}
                        alt={activeTab}
                        className="w-8 h-8"
                      />
                      <p
                        className={`font-black hidden lg:block ${
                          darkTheme ? "text-white" : "text-black"
                        }`}
                      >
                        {getTabName()}
                      </p>
                    </div>

                    {/* CENTER: Tab Switcher */}
                    <div className="flex justify-center">
                      <div className="flex border rounded-lg overflow-hidden shadow-md">
                        {["html", "css", "js"].map((tab, index) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`lg:px-4 md:px-2 px-4 py-2 text-sm font-semibold capitalize transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              activeTab === tab
                                ? darkTheme
                                  ? "bg-blue-600 text-white shadow-inner"
                                  : "bg-sky-700 text-white shadow-inner"
                                : darkTheme
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } ${index === 1 ? "border-x" : ""}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT: Action Buttons */}
                    <div className="flex w-full md:w-1/3 items-center justify-end gap-x-2">
                      {editorBtns.map((btn, index) => (
                        <Button
                          key={index}
                          classNames={`cursor-pointer flex items-center justify-center md:gap-x-2 py-2.5 text-white font-bold ${
                            btn.text === "Execute"
                              ? "bg-[#10B335] hover:bg-green-600"
                              : "bg-[#FB2E38] hover:bg-[#FB2E10]"
                          } lg:px-4 md:px-2 px-4 rounded-lg`}
                          action={btn.action}
                          icon={btn.icon}
                          text={
                            <>
                              <span className="hidden md:inline">
                                {btn.text}
                              </span>
                            </>
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    className="flex flex-col w-full h-full overflow-hidden relative"
                    style={{ height: "70vh" }}
                  >
                    <CodeMirror
                      key={activeTab}
                      value={codeValue}
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
                        getLanguageExtension(),
                      ]}
                      onChange={(value) => {
                        setCurrentContent(value);
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

                    <ErrorModalComponent
                      isError={isError}
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
                  } rounded-lg p-2 gap-y-1 relative ${
                    isOutputFullscreen ? "fixed inset-0 z-50 !m-0 !p-0" : ""
                  }`}
                >
                  <div
                    className={`h-14 w-full flex items-center justify-between gap-x-2 rounded-lg ${
                      darkTheme ? "bg-gray-700" : "bg-gray-200"
                    } px-2 ${isOutputFullscreen ? "!rounded-none" : ""}`}
                  >
                    <p
                      className={`font-black px-1 ${
                        darkTheme ? "text-white" : "text-black"
                      }`}
                    >
                      Output
                    </p>
                    <div className="flex items-center gap-x-2">
                      <button
                        onClick={toggleOutputModal}
                        className={`p-2 rounded-full ${
                          darkTheme ? "hover:bg-gray-600" : "hover:bg-gray-300"
                        }`}
                        title="Maximize"
                      >
                        <Maximize2
                          size={20}
                          className={darkTheme ? "text-white" : "text-black"}
                        />
                      </button>
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
                    className={`w-full overflow-auto ${
                      darkTheme
                        ? "text-gray-200 bg-gray-800"
                        : "text-black bg-white"
                    } ${
                      isOutputFullscreen ? "!h-[calc(100vh-56px)]" : "h-[70vh]"
                    }`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      whiteSpace: "pre",
                      wordBreak: "break-word",
                      overflow: "auto",
                    }}
                  ></div>
                </div>
              </div>

              {showOutput && (
                <div
                  className={`lg:hidden md:hidden border-2 ${
                    darkTheme ? "border-blue-600" : "border-sky-700"
                  } w-full rounded-t-lg p-2 flex flex-col gap-y-1 absolute left-1/2 ${
                    darkTheme ? "bg-gray-800" : "bg-gray-100"
                  } -translate-x-1/2 ${
                    isOutputFullscreen ? "top-0 h-screen" : "bottom-0 h-1/2"
                  }`}
                >
                  <div
                    className={`h-12 w-full flex items-center justify-between gap-x-2 rounded-lg ${
                      darkTheme ? "bg-gray-700" : "bg-gray-200"
                    } px-2 py-1 ${isOutputFullscreen ? "!rounded-none" : ""}`}
                  >
                    <p
                      className={`font-black px-1 ${
                        darkTheme ? "text-white" : "text-black"
                      }`}
                    >
                      Output
                    </p>
                    <div className="flex items-center gap-x-2">
                      <button
                        onClick={toggleOutputModal}
                        className={`p-2 rounded-full ${
                          darkTheme ? "hover:bg-gray-600" : "hover:bg-gray-300"
                        }`}
                        title={isOutputFullscreen ? "Minimize" : "Maximize"}
                      >
                        {isOutputFullscreen ? (
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
                      <Button
                        classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold bg-[#FB2E38] hover:bg-[#FB2E10] px-4 rounded-lg text-xs`}
                        text={editorBtns[0].text}
                        icon={editorBtns[0].icon}
                        action={clearOutput}
                      />
                      {!isOutputFullscreen && (
                        <button
                          onClick={handleClose}
                          className={`p-2 rounded-full ${
                            darkTheme
                              ? "hover:bg-gray-600"
                              : "hover:bg-gray-300"
                          }`}
                        >
                          <X
                            size={20}
                            className={darkTheme ? "text-white" : "text-black"}
                          />
                        </button>
                      )}
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
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="p-2 hidden md:flex items-center justify-center min-h-[120px]">
            {/* <Ads /> */}
          </div>
        </div>
      </div>

      {isOutputModalOpen && <OutputModal />}
    </>
  );
}

export default HtmlIDE;
