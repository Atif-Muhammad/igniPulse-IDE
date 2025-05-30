const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("connection established with user:", socket.id);

    //     socket.on("runPy", (data, type) => {
    //       const injectInputPatch = `
    // import builtins
    // original_input = builtins.input
    // def custom_input(prompt=""):
    //     print(prompt + " INPUT_REQUEST", flush=True)
    //     return original_input()
    // builtins.input = custom_input
    // `;

    //       const injectDsGraphPatch = `
    // import matplotlib
    // matplotlib.use('Agg')
    // import matplotlib.pyplot as plt
    // def safe_show():
    //     try:
    //         plt.savefig("/temps/output.png")
    //     except Exception as e:
    //         print("Could not save plot:", str(e))
    // plt.show = safe_show
    // `;

    //       const modifiedCode =
    //         type === "ds"
    //           ? injectInputPatch + injectDsGraphPatch + "\n" + data
    //           : injectInputPatch + "\n" + data;

    //       execPy(socket, modifiedCode, type);
    //     });

    // const execPy = (socket, code, type) => {
    //   const container = type === 'ds' ? 'python-ds' : 'python-gen';
    //   // const pyProcess = spawn("python3", ["-u", "-c", code], {
    //   //   stdio: ["pipe", "pipe", "pipe"],
    //   // });
    //   const pyProcess = spawn("docker", ["run", "--rm", "-i", container, "python3", "-u", "-c", code])

    //   let fullOutput = "";
    //   let errorOutput = "";
    //   let expectingEntry = false;

    //   socket.removeAllListeners("userEntry");

    //   // Handle Python stdout
    //   pyProcess.stdout.on("data", (data) => {
    //     const outputCheck = data.toString();
    //     if (outputCheck.includes("INPUT_REQUEST")) {
    //       expectingEntry = true;
    //       socket.emit(
    //         "userInput",
    //         outputCheck.replace("INPUT_REQUEST", "").trim()
    //       );
    //     } else {
    //       // fullOutput += data.toString();
    //       const lines = data.toString().split(/\r?\n/);
    //       lines.forEach((line) => {
    //         if (line.trim()) {
    //           socket.emit("pyResponse", line);
    //         }
    //       });

    //     }
    //   });

    //   // Handle user input
    //   const handleUserEntry = (userInput) => {
    //     if (expectingEntry) {
    //       console.log("Received input from user:", userInput);
    //       pyProcess.stdin.write(userInput + "\n");
    //       expectingEntry = false;
    //     }
    //   };
    //   socket.on("userEntry", handleUserEntry);

    //   // Handle Python stderr
    //   pyProcess.stderr.on("data", (data) => {
    //     let errorMsg = data.toString();
    //     errorMsg = errorMsg.replace(
    //       /File "<string>", line (\d+)/g,
    //       (match, lineNum) => {
    //         const adjustedLine = Math.max(1, lineNum - 7);
    //         return `line ${adjustedLine}`;
    //       }
    //     );
    //     errorOutput += errorMsg;
    //   });

    //   // Handle process exit
    //   pyProcess.on("close", (code) => {
    //     if (errorOutput.trim()) {
    //       //   socket.emit("pyResponse", fullOutput.trim());
    //       socket.emit("pyResponse", "<b>Error!\n</b>" + errorOutput.trim());
    //     }
    //     // else {
    //     //   if (errorOutput.trim()) {
    //     //     socket.emit("pyResponse", "<b>Error!\n</b>" + errorOutput.trim());
    //     //   } else if (fullOutput.trim()) {
    //     //     socket.emit("pyResponse", fullOutput.trim());
    //     //   }
    //     // }

    //     socket.emit("EXIT_SUCCESS", "EXIT_SUCCESS");
    //   });

    //   // Cleanup when user disconnects
    //   socket.on("disconnect", () => {
    //     console.log("disconnected user:", socket.id);

    //     // Remove user entry listener
    //     socket.removeListener("userEntry", handleUserEntry);

    //     // Kill the Python process if still running
    //     if (!pyProcess.killed) {
    //       pyProcess.kill();
    //     }
    //   });
    // };


    socket.on("runPy", (data, type) => {
      const fileId = socket.id.replace(/[^a-zA-Z0-9]/g, "");
      const outputFile = `${fileId}.png`;

      const injectInputPatch = `
import builtins
original_input = builtins.input
def custom_input(prompt=""):
    print(prompt + " INPUT_REQUEST", flush=True)
    return original_input()
builtins.input = custom_input
`;

      const injectDsGraphPatch = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
def safe_show():
    try:
        plt.savefig("/temps/${outputFile}")
    except Exception as e:
        print("Could not save plot:", str(e))
plt.show = safe_show
`;

      const modifiedCode =
        type === "ds"
          ? injectInputPatch + injectDsGraphPatch + "\n" + data
          : injectInputPatch + "\n" + data;

      execPy(socket, modifiedCode, type, outputFile);
    });

    const execPy = (socket, code, type, outputFile) => {
      const container = type === "ds" ? "python-ds" : "python-gen";
      const hostTmpDir = path.resolve("./temps");
      const fullOutputPath = path.join(hostTmpDir, outputFile);

      // Ensure temps dir exists
      if (!fs.existsSync(hostTmpDir)) fs.mkdirSync(hostTmpDir);

      // Build Docker args
      const dockerArgs = [
        "run",
        "--rm",
        "-i",
        ...(type === "ds" ? ["-v", `${hostTmpDir}:/temps`] : []),
        container,
        "python3",
        "-u",
        "-c",
        code,
      ];

      const pyProcess = require("child_process").spawn("docker", dockerArgs);

      let errorOutput = "";
      let expectingEntry = false;

      socket.removeAllListeners("userEntry");

      pyProcess.stdout.on("data", (data) => {
        const outputCheck = data.toString();
        if (outputCheck.includes("INPUT_REQUEST")) {
          expectingEntry = true;
          socket.emit(
            "userInput",
            outputCheck.replace("INPUT_REQUEST", "").trim()
          );
        } else {
          const lines = outputCheck.split(/\r?\n/);
          lines.forEach((line) => {
            if (line.trim()) {
              socket.emit("pyResponse", line);
            }
          });
        }
      });

      const handleUserEntry = (userInput) => {
        if (expectingEntry) {
          pyProcess.stdin.write(userInput + "\n");
          expectingEntry = false;
        }
      };
      socket.on("userEntry", handleUserEntry);

      pyProcess.stderr.on("data", (data) => {
        let errorMsg = data.toString();
        errorMsg = errorMsg.replace(
          /File "<string>", line (\d+)/g,
          (match, lineNum) => {
            const adjustedLine = Math.max(1, lineNum - 7);
            return `line ${adjustedLine}`;
          }
        );
        errorOutput += errorMsg;
      });

      pyProcess.on("close", () => {
        if (errorOutput.trim()) {
          socket.emit("pyResponse", "<b>Error!\n</b>" + errorOutput.trim());
        }

        if (type === "ds" && fs.existsSync(fullOutputPath)) {
          const buffer = fs.readFileSync(fullOutputPath);
          const base64Image = buffer.toString("base64");
          // console.log(base64Image)
          socket.emit("graphOutput", `data:image/png;base64,${base64Image}`);
          fs.unlinkSync(fullOutputPath);
        }

        socket.emit("EXIT_SUCCESS", "EXIT_SUCCESS");
      });

      socket.on("disconnect", () => {
        socket.removeListener("userEntry", handleUserEntry);
        if (!pyProcess.killed) {
          pyProcess.kill();
        }
        if (type === "ds" && fs.existsSync(fullOutputPath)) {
          fs.unlinkSync(fullOutputPath);
        }
      });
    };



  });
};
