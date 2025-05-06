import { React, useState, useRef, useEffect } from "react";
import {
  CirclePlay,
  Eraser,
  File,
  Play,
  Save,
  MenuIcon,
  XIcon,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, highlightActiveLineGutter } from "@codemirror/view";
import Config from "../../Config/config";
import toast, { Toaster } from "react-hot-toast";
import Data from "./Data";
import sql from "../assets/sql.svg";
import { useTheme } from "../context/ThemeContext";
import TableDetail from "./TableDetail";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { Info, X } from "lucide-react";
import { oneDark } from "@codemirror/theme-one-dark";
import LeftMenuSQL from "../components/leftmenuSQL";
// import { EditorView } from "@codemirror/view";

function sqlIDETwo() {
  const { darkTheme } = useTheme();
  const dataRef = useRef(null);
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [resDB, setResDb] = useState([]);
  const [db, setDb] = useState(
    () => window.localStorage.getItem("unique_id") || ""
  );
  const [details, setDetails] = useState([]);
  const [copyDone, setCopyDone] = useState(false);
  const [pasteDone, setPasteDone] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Add line wrapping extension
  const lineWrapping = EditorView.lineWrapping;

  const fullHeightEditor = EditorView.theme({
    ".cm-scroller": {
      maxHeight: "130px !important",
      overflow: "auto !important",
    },
    ".cm-content": {
      minHeight: "130px !important",
      whiteSpace: "pre",
    },
    ".cm-gutter": {
      minHeight: "130px !important",
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
      backgroundColor: "#3B82F6",
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

  const getTables = () => {
    // console.log(db);
    Config.getTables(db)
      .then((res) => {
        // console.log(res.data)
        const detail_data = Object.values(
          res.data.reduce((acc, row) => {
            if (!acc[row.TABLE_NAME]) {
              acc[row.TABLE_NAME] = { table: row.TABLE_NAME, columns: [] };
            }

            acc[row.TABLE_NAME].columns.push({
              column: row.COLUMN_NAME,
              type: row.DATA_TYPE,
            });
            return acc;
          }, {})
        );
        // console.log("dasdas",detail_data)
        setDetails(detail_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getDataBases = () => {
  //   Config.getDataBases()
  //     .then((res) => {
  //       // console.log(res.data)
  //       setDataBases([...res.data]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleRun = () => {
    const currentContent = editorRef.current?.state.doc.toString();
    if (currentContent !== "") {
      Config.postData(currentContent, db)
        .then((res) => {
          if (res.data.success) {
            toast.success("success");
            setResDb(res.data.result);
            getTables();
          } else {
            setResDb([]);
            if (res.data.code == "ER_NO_SUCH_TABLE") {
              const cleanedMessage = res.data.sqlMessage.replace(
                /'[^.]+\.([^']+)'/,
                "'$1'"
              );
              toast.error(cleanedMessage);
            } else {
              toast.error(res.data.sqlMessage);
            }
          }
        })
        .catch((err) => {
          toast.error(err.message || "An unexpected error occurred");
          setResDb([]);
        });
    }
  };

  const createDB = () => {
    const inq_id = window.localStorage.unique_id;
    Config.createDB(inq_id)
      .then((res) => {
        if (res.status === 200) {
          const unique_id = res.data;
          if (unique_id != inq_id) {
            window.localStorage.removeItem("unique_id");
            window.localStorage.setItem("unique_id", unique_id);
            setDb(unique_id);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    createDB();
    // getDataBases();
    getTables();
  }, []);

  useEffect(() => {
    if (dataRef.current) {
      dataRef.current.scrollTop = 0;
    }
  }, [resDB]);

  const handleDownload = async () => {
    if (window.showSaveFilePicker) {
      const fileHandler = await window.showSaveFilePicker({
        suggestedName: "code.sql",
        types: [
          {
            accept: { "text/plain": [".sql"] },
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
      // element.download = `code.sql`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const openFile = async () => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          accept: {
            "text/plain": [".txt", ".sql"],
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
          changes: {
            from: 0,
            to: editorRef.current.state.doc.length,
            insert: "",
          },
        });
        editorRef.current.focus();
      }
    }
  };

  const handleCopy = async () => {
    try {
      if (editorRef.current) {
        // Get the editor's content using `state.doc.toString()`
        const editorContent = editorRef.current.state.doc.toString();
        if (editorContent.trim()) {
          await navigator.clipboard.writeText(editorContent);
          setCopyDone(true);
          console.log("Copied to clipboard");
          setTimeout(() => {
            setCopyDone(false);
          }, 1000);
        }
      } else {
        console.error("Editor is not initialized properly.");
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && editorRef.current) {
        // Get the current cursor position
        const cursorPosition = editorRef.current.state.selection.main.head;
        // Dispatch changes to insert the pasted text at the current cursor position
        editorRef.current.dispatch({
          changes: {
            from: cursorPosition,
            to: cursorPosition,
            insert: text,
          },
        });
        setEditorContent(editorRef.current.state.doc.toString()); // Update state with new content
        editorRef.current.focus();
        setPasteDone(true);
        setTimeout(() => {
          setPasteDone(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

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

  useEffect(() => {
    setTimeout(() => {
      setShowInfo(true);
    }, 1500);
  }, []);

  return (
    <>
      {showInfo && (
        <div
          className={`w-[90%] sm:w-2/3 md:w-1/2 lg:w-1/3 h-auto px-4 py-3 absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-xl shadow-lg animate-pulse [animation-duration:3s] ${
            darkTheme ? "bg-red-700" : "bg-red-500"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-start">
              <Info className="text-white mt-1" />
              <p className="text-white text-xs sm:text-sm font-medium">
                Warning: Your user data, including databases, tables, and
                records will be{" "}
                <span className="underline">permanently deleted</span> after 7
                days.
              </p>
            </div>
            <button
              className="text-white hover:text-gray-300 transition"
              onClick={() => setShowInfo(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col h-screen w-screen overflow-hidden relative `}
      >
        <div className="w-full h-[15%] text-center p-2">
          <div className="h-full w-full"></div>
        </div>
        <div className="flex flex-row items-center justify-center h-full w-full overflow-hidden">
          <div className="h-full w-30 text-center p-2">
            <div className="h-full w-full"></div>
          </div>
          <div className="flex  flex-col items-center justify-center h-full w-full lg:gap-y-1 md:gap-y-1 px-1">
            <NavBar handleDownload={handleDownload} openFile={openFile} />
            <div
              className={`flex lg:flex-row flex-col lg:h-[85%] gap-2 md:h-[85%] h-[90%] w-full overflow-hidden px-2 gap-x-2 ${
                darkTheme ? "bg-gray-800" : "bg-gray-50"
              } p-2 rounded-lg`}
            >
              <LeftMenuSQL
                handleCopy={handleCopy}
                handlePaste={handlePaste}
                copyDone={copyDone}
                pasteDone={pasteDone}
                TableDetail={TableDetail}
                details={details}
              />
              <div className="lg:py-0  md:py-0 py-2 relative flex flex-col md:flex-row lg:flex-row gap-2 items-start justify-center h-full w-full">
                <div className="hidden md:block lg:block w-full md:w-[23%] h-full">
                  <TableDetail details={details} />
                </div>

                <div className="w-full md:w-[77%] flex flex-col gap-y-2 h-full">
                  <div
                    className={`border-2 ${
                      darkTheme ? "border-blue-600" : "border-sky-700"
                    } w-full h-49 rounded-lg flex flex-col items-center lg:justify-center md:justify-center justify-start p-1 gap-y-1 ${
                      darkTheme ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div
                      className={`w-full h-12 flex items-center justify-between gap-x-2 rounded-lg ${
                        darkTheme ? "bg-gray-700" : "bg-gray-200"
                      } px-1 py-5`}
                    >
                      <div className="flex items-center justify-center gap-x-1 px-2">
                        <img src={sql} alt="python" className="w-8 h-8" />
                        <p
                          className={`font-black ${
                            darkTheme ? "text-white" : "text-black"
                          }`}
                        >
                          SQL
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-x-2">
                        {editorBtns.map((btn, index) => (
                          <Button
                            key={index}
                            classNames={`cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold ${
                              btn.text === "Execute"
                                ? "bg-[#10B335] hover:bg-green-600"
                                : "bg-[#F7665D] hover:bg-[#f7766d]"
                            } px-4 rounded-lg`}
                            action={btn.action}
                            text={btn.text}
                            icon={btn.icon}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="lg:max-w-[1050px] min-w-[335px] w-full lg:w-full md:w-[500px] flex items-start justify-center overflow-auto rounded-lg">
                      <CodeMirror
                        defaultValue={editorContent}
                        className={`text-[1rem] w-full  scrollbar-custom rounded-lg ${
                          darkTheme ? "text-gray-200" : "text-gray-800"
                        }`}
                        theme={darkTheme ? oneDark : "light"}
                        extensions={[
                          fullHeightEditor,
                          customScrollbar,
                          highlightActiveLineGutter(),
                          lineWrapping, // Add this line to enable text wrapping
                        ]}
                        onChange={(newContent, viewUpdate) => {
                          setEditorContent(newContent);
                          editorRef.current = viewUpdate.view;
                        }}
                        onCreateEditor={(editor) => {
                          editorRef.current = editor;
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`w-full lg:h-full md:h-full h-[35vh] ${
                      darkTheme ? "border-blue-600" : "border-sky-700"
                    } border-2 rounded-lg overflow-auto ${
                      darkTheme
                        ? "bg-gray-800 text-gray-200"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <Data res={resDB} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-30 text-center p-2">
            <div className="h-full w-full"></div>
          </div>
        </div>
        <div className="w-full h-10 text-center p-2">
          <div className="h-full w-full"></div>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#10B335",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "white",
              secondary: "black",
            },
          },
          error: {
            duration: 3000,
            style: {
              backgroundColor: darkTheme ? "#7F1D1D" : "#EF4444",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: darkTheme ? "#7F1D1D" : "#EF4444",
            },
          },
        }}
      />
    </>
  );
}

export default sqlIDETwo;
