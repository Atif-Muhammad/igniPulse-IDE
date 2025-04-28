import { React, useState, useRef, useEffect } from "react";
import { CirclePlay, Eraser, File, Play, Save } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, highlightActiveLineGutter } from "@codemirror/view";
import Config from "../../Config/config";
import toast, { Toaster } from "react-hot-toast";
import Data from "./Data";
import sql from "../assets/sql.svg";

import TableDetail from "./TableDetail";
import LeftMenu from "../components/LeftMenu";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { Info, X } from "lucide-react";

function sqlIDETwo() {
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

  const fullHeightEditor = EditorView.theme({
    ".cm-scroller": {
      maxHeight: "130px !important",
      width: "1020px !important",
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
        <div className="bg-red-500 w-1/3 h-auto px-4 py-3 absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-xl shadow-lg animate-pulse [animation-duration:3s]">
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-start">
              <Info className="text-white mt-1" />
              <p className="text-white text-sm font-medium">
                Warning: Your user data, including databases, tables, and
                records will be{" "}
                <span className="underline">permanently deleted</span> after
                7days.
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
      <div className="flex flex-col h-screen w-screen overflow-hidden relative bg-white/40">
        <div className="w-full h-[15%]  text-center p-2">
          <div className=" h-full w-full "></div>
        </div>
        <div className="flex flex-row items-center justify-center h-full w-full overflow-hidden">
          <div className="h-full w-30 text-center p-2">
            <div className=" h-full w-full "></div>
          </div>
          <div className="flex flex-col items-center justify-center h-full w-full gap-y-1">
            <NavBar handleDownload={handleDownload} openFile={openFile} />
            <div className="flex flex-row h-[85%] w-full overflow-hiddenpx-2 gap-x-2 bg-gray-50 p-2 rounded-lg">
              <LeftMenu
                handleCopy={handleCopy}
                handlePaste={handlePaste}
                copyDone={copyDone}
                pasteDone={pasteDone}
              />
              <div className="flex flex-row gap-x-2 h-full w-full ">
                <TableDetail details={details} />
                <div className="h-full w-full flex flex-col gap-y-2">
                  <div className="border-2 border-sky-700 w-full h-55 rounded-lg flex flex-col items-center justify-center p-1 gap-y-1">
                    <div className="w-full h-12 flex items-center justify-between gap-x-2 rounded-lg bg-gray-200 px-1 py-5">
                      <div className="flex items-center justify-center gap-x-1 px-2">
                        <img src={sql} alt="python" className="w-8 h-8" />
                        <p className="font-black">SQL</p>
                      </div>
                      <div className="flex items-center justify-center gap-x-2">
                        {editorBtns.map((btn, index) => (
                          <Button
                            classNames={` cursor-pointer flex items-center justify-center gap-x-2 py-2.5 text-white font-semibold ${
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
                    <div className="w-full h-full flex items-start justify-center overflow-auto rounded-lg">
                      <CodeMirror
                        defaultValue={editorContent}
                        className="text-[1rem] scrollbar-custom rounded-lg"
                        theme="light"
                        extensions={[
                          fullHeightEditor,
                          customScrollbar,
                          highlightActiveLineGutter(),
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
                  <div className="w-full h-full border-sky-700 border-2 rounded-lg overflow-auto ">
                    <Data res={resDB} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-30 text-center p-2">
            <div className=" h-full w-full "></div>{" "}
          </div>
        </div>
        <div className="w-full h-10 text-center p-2">
          <div className=" h-full w-full"></div>{" "}
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
            background: "green",
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
              backgroundColor: "red",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "red",
            },
          },
        }}
      />
    </>
  );
}

export default sqlIDETwo;
