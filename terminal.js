document.addEventListener("DOMContentLoaded", () => {
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  const root = document.getElementById("root");
  const terminal = document.createElement("div");

  Object.assign(terminal.style, {
    fontFamily: "'JetBrains Mono', monospace",
    backgroundColor: "#0a0a0a",
    color: "#cccccc",
    padding: "1rem",
    height: "85vh",
    overflowY: "auto",
    borderRadius: "0.5rem",
    border: "1px solid #1a1a1a",
    boxSizing: "border-box",
  });

  root.appendChild(terminal);

  const inputWrapper = document.createElement("div");
  Object.assign(inputWrapper.style, {
    display: "flex",
    marginTop: "0.5rem",
  });

  const inputLabel = document.createElement("span");
  inputLabel.textContent = "xD";
  Object.assign(inputLabel.style, {
    color: "#666666",
    marginRight: "0.5rem",
  });

  inputWrapper.appendChild(inputLabel);

  const input = document.createElement("input");
  input.type = "text";
  Object.assign(input.style, {
    flex: "1",
    backgroundColor: "transparent",
    border: "none",
    color: "#cccccc",
    outline: "none",
    fontFamily: "'JetBrains Mono', monospace",
  });

  input.autocomplete = "off";
  inputWrapper.appendChild(input);
  terminal.appendChild(inputWrapper);

  const footer = document.createElement("div");
  Object.assign(footer.style, {
    marginTop: "1rem",
    fontFamily: "'JetBrains Mono', monospace",
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #ccc",
    maxWidth: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
  });

  footer.textContent = "Hover over a command to see its description.";
  root.appendChild(footer);

  const commandHistory = [];
  let historyIndex = -1;
  let commands = {};

  fetch('commands.php')
    .then(response => response.json())
    .then(data => {
      commands = data;
      autoType("help", () => executeAndDisplayCommand("help"));
    })
    .catch(error => console.error('Error loading commands:', error));

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = input.value.trim();
      if (!command) return;

      commandHistory.push(command);
      historyIndex = commandHistory.length;
      input.value = "";
      executeAndDisplayCommand(command);
    } else if (event.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (event.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
    }
  });

  function autoType(text, callback) {
    input.value = "";
    let index = 0;
    const interval = setInterval(() => {
      input.value += text[index];
      index++;
      if (index === text.length) {
        clearInterval(interval);
        callback();
      }
    }, 100);
  }

  function executeAndDisplayCommand(command) {
    const commandOutput = document.createElement("div");
    commandOutput.textContent = `=> ${command}`;
    Object.assign(commandOutput.style, { color: "#ffffff" });
    terminal.insertBefore(commandOutput, inputWrapper);

    const response = executeCommand(command);
    if (command === "help") {
      displayHelp(response);
    } else {
      const responseOutput = document.createElement("div");
      responseOutput.textContent = response;
      Object.assign(responseOutput.style, { color: "#cccccc" });
      terminal.insertBefore(responseOutput, inputWrapper);
    }

    input.value = "";
    input.focus();
    terminal.scrollTop = terminal.scrollHeight;
  }

  function displayHelp(response) {
    const responseContainer = document.createElement("div");
    Object.assign(responseContainer.style, { color: "#cccccc" });

    for (const cmdName in commands) {
      const cmd = commands[cmdName];
      const button = document.createElement("button");
      button.textContent = cmdName;
      Object.assign(button.style, {
        backgroundColor: "transparent",
        color: "#fedcba",
        border: "none",
        fontSize: "1.4rem",
        fontWeight: "bold",
        cursor: "pointer",
        textDecoration: "none",
        fontFamily: "'JetBrains Mono', monospace",
        display: "block",
        margin: "1rem 0",
      });

      button.addEventListener("mouseover", () => {
        footer.textContent = cmd.description;
      });

      button.addEventListener("mouseout", () => {
        footer.textContent = "Hover over a command to see its description.";
      });

      button.addEventListener("click", () => {
        commandHistory.push(cmdName);
        historyIndex = commandHistory.length;
        autoType(cmdName, () => {
          executeAndDisplayCommand(cmdName);
          input.focus();
        });
      });

      responseContainer.appendChild(button);
    }

    terminal.insertBefore(responseContainer, inputWrapper);
  }

  function executeCommand(command) {
    const cmd = commands[command.toLowerCase()];
    if (cmd) {
      if (cmd.operation === 'clear') {
        footer.textContent = "Type help to see available commands.";
        while (terminal.firstChild && terminal.firstChild !== inputWrapper) {
          terminal.removeChild(terminal.firstChild);
        }
        return "";
      } else if (cmd.operation === 'date') {
        return `Current date and time: ${new Date().toLocaleString()}`;
      } else if (cmd.operation === 'showHelp') {
        return "Displaying available commands...";
      } else if (cmd.operation === 'showProfileImage') {
        showProfileImage(cmd);
        return "";
      } else {
        return cmd.operation;
      }
    }
    return `Unrecognized command: ${command}`;
  }

  function showProfileImage(cmd) {
    const container = document.createElement("div");
    Object.assign(container.style, {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginTop: "1rem",
    });

    const img = document.createElement("img");
    img.src = cmd.picture;
    img.alt = "Profile picture";
    Object.assign(img.style, {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      border: "2px solid #cccccc",
    });

    const button = document.createElement("button");
    button.textContent = "Change picture";
    Object.assign(button.style, {
      backgroundColor: "#4CAF50",
      color: "#ffffff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      cursor: "pointer",
      fontFamily: "'JetBrains Mono', monospace",
    });

    button.addEventListener("click", () => {
      const access = {};
      const user = prompt("Enter your username:");
      if (user) {
        access.user = user;
        const pass = prompt("Enter your password:");
        if (pass) {
          access.pass = pass;
          const newImageUrl = prompt("Enter the new image URL:");
          if (newImageUrl) {
            img.src = newImageUrl;
            alert("Password: " + access.pass);
          } else {
            alert("No image URL entered.");
          }
        } else {
          alert("No password entered.");
        }
      } else {
        alert("No username entered.");
      }
    });

    container.appendChild(img);
    container.appendChild(button);
    terminal.insertBefore(container, inputWrapper);
  }

  input.focus();
});
