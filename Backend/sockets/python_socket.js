const { spawnSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("connection established with user:", socket.id);

    socket.on("runPy", (data, type) => {
      const fileId = socket.id.replace(/[^a-zA-Z0-9]/g, "");
      const outputFile = `${fileId}.png`;
      // console.log("outpufile: ", outputFile)

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
        print("Could not save plot:", str(e), flush=True)
plt.show = safe_show
`;

      const modifiedCode =
        type === "ds"
          ? injectInputPatch + injectDsGraphPatch + "\n" + data
          : injectInputPatch + "\n" + data;

      execPy(socket, modifiedCode, type, outputFile);
    });

    const execPy = (socket, code, type, outputFile) => {
      const image = type === "ds" ? "python-ds" : "python-gen";
      const sharedVolumePath = "/temps";
      const fullOutputPath = path.join(sharedVolumePath, outputFile);
      const containerName = `py-${socket.id}`;
      const dockerArgs = [
        "run",
        "--rm",
        "--name",
        containerName,
        "-i",
        ...(type === "ds" ? ["-v", `shared_temp:/temps`] : []),
        image,
        "python3",
        "-u",
        "-c",
        code,
      ];

      const pyProcess = spawn("docker", dockerArgs);
      let expectingEntry = false;
      let errorOutput = "";
      let wasCancelled = false;

      const handleUserEntry = (userInput) => {
        if (expectingEntry) {
          pyProcess.stdin.write(userInput + "\n");
          expectingEntry = false;
        }
      };

      socket.removeAllListeners("userEntry");
      socket.on("userEntry", handleUserEntry);

      let stdoutBuffer = ""; // keep outside the listener

      pyProcess.stdout.on("data", (data) => {
        stdoutBuffer += data.toString();

        // Split into lines
        const lines = stdoutBuffer.split(/\r?\n/);

        // Keep the last part in buffer if it's not a complete line
        stdoutBuffer = lines.pop(); // Save incomplete last line (if any)

        lines
          .filter((line) => line.trim())
          .forEach((line) => {
            if (line.includes("INPUT_REQUEST")) {
              expectingEntry = true;
              socket.emit(
                "userInput",
                line.replace("INPUT_REQUEST", "").trim()
              );
            } else {
              // console.log(line)
              // console.log(typeof(line))
              socket.emit("pyResponse", '"' + line.toString() + '"');
            }
          });
      });

      pyProcess.stderr.on("data", (data) => {
        let errorMsg = data.toString();
        errorMsg = errorMsg
          .replace(
            /File "<string>", line (\d+)/g,
            (_, lineNum) =>
              `line ${Math.max(1, lineNum - (type === "ds" ? 18 : 8))}`
          )
          .replace(
            /SyntaxError: unterminated string literal \(detected at line \d+\)/,
            "SyntaxError: unterminated string literal"
          );
        errorOutput += errorMsg;
      });

      pyProcess.on("close", () => {
        // clearTimeout(killTimeout);
        socket.removeListener("userEntry", handleUserEntry);

        if (errorOutput.trim()) {
          socket.emit("pyResponse", "<b>Error!</b>\n" + errorOutput.trim());
        }

        if (type === "ds") {
          try {
            if (fs.existsSync(fullOutputPath)) {
              const buffer = fs.readFileSync(fullOutputPath);
              const base64Image = buffer.toString("base64");
              socket.emit(
                "graphOutput",
                `data:image/png;base64,${base64Image}`
              );
              fs.unlinkSync(fullOutputPath);
            } else {
              console.log(`file ${fullOutputPath} not found.`);
            }
          } catch (e) {
            socket.emit("graphOutput", ``);
            console.error("Error reading/sending image file:", e);
          }
        }

        if(!wasCancelled && !errorOutput.trim()){
          socket.emit("EXIT_SUCCESS", "EXIT_SUCCESS");
        }else if(!wasCancelled && errorOutput.trim()){
          socket.emit("EXIT_ERROR", "EXIT_ERROR");
        }
      });

      socket.on("cancle", () => {
        if (pyProcess && !pyProcess.killed) {
          wasCancelled = true;
          // console.log("Cancelling process...");
          spawn("docker", ["kill", containerName]);
        }
      });

      socket.on("disconnect", () => {
        socket.removeListener("userEntry", handleUserEntry);
        if (!pyProcess.killed) {
          wasCancelled = true;
          spawn("docker", ["kill", containerName]);
        }
        if (type === "ds" && fs.existsSync(fullOutputPath)) {
          fs.unlinkSync(fullOutputPath);
        }
      });
    };
  });
};
