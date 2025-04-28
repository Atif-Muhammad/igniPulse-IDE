const { spawn } = require('child_process');

module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log("connection established with user:", socket.id);
    
        socket.on("runPy", (data) => {
            const modifiedCode = `
import builtins
original_input = builtins.input
def custom_input(prompt=""):
    print(prompt + " INPUT_REQUEST", flush=True)  
    return original_input()
builtins.input = custom_input
${data}
    `;
    
            execPy(socket, modifiedCode);
        });
    
        const execPy = (socket, code) => {
            const pyProcess = spawn("python", ["-u", "-c", code], {
                stdio: ["pipe", "pipe", "pipe"],
            });
    
            let fullOutput = "";
            let errorOutput = "";
            let expectingEntry = false;
    
            // Handle Python stdout
            pyProcess.stdout.on("data", (data) => {
                const outputCheck = data.toString();
                if (outputCheck.includes("INPUT_REQUEST")) {
                    expectingEntry = true;
                    socket.emit("userInput", outputCheck.replace("INPUT_REQUEST", "").trim());
                } else {
                    fullOutput += data.toString();
                }
            });
    
            // Handle user input
            const handleUserEntry = (userInput) => {
                if (expectingEntry) {
                    console.log("Received input from user:", userInput);
                    pyProcess.stdin.write(userInput + "\n"); // Send input to Python
                    expectingEntry = false;
                }
            };
            socket.on("userEntry", handleUserEntry);
    
            // Handle Python stderr
            pyProcess.stderr.on("data", (data) => {
                let errorMsg = data.toString();
                errorMsg = errorMsg.replace(/File "<string>", line (\d+)/g, (match, lineNum) => {
                    const adjustedLine = Math.max(1, lineNum - 7);
                    return `line ${adjustedLine}`;
                });
                errorOutput += errorMsg;
            });
    
            // Handle process exit
            pyProcess.on("close", (code) => {
                if (errorOutput.trim() && fullOutput.trim()) {
                    socket.emit("pyResponse", fullOutput.trim());
                    socket.emit("pyResponse", "<b>Error!\n</b>" + errorOutput.trim());
                } else {
                    if (errorOutput.trim()) {
                        socket.emit("pyResponse", "<b>Error!\n</b>" + errorOutput.trim());
                    } else if (fullOutput.trim()) {
                        socket.emit("pyResponse", fullOutput.trim());
                    }
                }
    
                socket.emit("EXIT_SUCCESS", "EXIT_SUCCESS");
            });
    
            // Cleanup when user disconnects
            socket.on("disconnect", () => {
                console.log("disconnected user:", socket.id);
    
                // Remove user entry listener
                socket.removeListener("userEntry", handleUserEntry);
    
                // Kill the Python process if still running
                if (!pyProcess.killed) {
                    pyProcess.kill();
                }
            });
        };
    });
}