// DAILY RESET SYSTEM

const currentDate = new Date();
const todayKey =
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

const savedDate = localStorage.getItem("routineDate");

if (savedDate !== todayKey) {

    // Reset routine and diet checkboxes
    const keysToReset = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && (key.startsWith("tasks") || key.startsWith("diet"))) {
            keysToReset.push(key);
        }
    }

    keysToReset.forEach(key => localStorage.removeItem(key));

    // Reset water
    localStorage.setItem("waterCount", "0");

    // Reset custom task completion, keep names and times
    const customTasks = JSON.parse(localStorage.getItem("customTasks")) || [];

    customTasks.forEach(task => {
        task.completed = false;
    });

    localStorage.setItem("customTasks", JSON.stringify(customTasks));

    // Save today's date
    localStorage.setItem("routineDate", todayKey);
}
const tasks = document.querySelectorAll('.task input[type="checkbox"]');
const progressText = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');

function updateProgress() {
    const allTasks = document.querySelectorAll(
        '.task input[type="checkbox"]'
    );

    const completed = document.querySelectorAll(
        '.task input[type="checkbox"]:checked'
    ).length;

    const total = allTasks.length;
    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressText.textContent = `Progress: ${percentage}%`;
    progressFill.style.width = `${percentage}%`;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("summaryPercentage").textContent = `${percentage}%`; 
    updateStreak();
}

tasks.forEach((task, index) => {
    const savedtask = localStorage.getItem(`task${index}`);
    task.checked = savedtask === "true";
    task.addEventListener("change", () => {
        localStorage.setItem(`task${index}`, task.checked);
updateProgress();
       });
    });
    updateProgress();
const notificationButton = document.getElementById("enableNotifications");

notificationButton.addEventListener("click", async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        alert("Notifications enabled!");
    } else {
        alert("Notifications permission denied.");
    }
});
const timeInputs = document.querySelectorAll('.task input[type="time"]');

timeInputs.forEach((input, index) => {
    const savedTime = localStorage.getItem(`taskTime${index}`);

    if (savedTime) {
        input.value = savedTime;
    }

    input.addEventListener('change', () => {
        localStorage.setItem(`taskTime${index}`, input.value);
    });
});
function checkReminders() {
    const now = new Date();

    const currentTime =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0");

    timeInputs.forEach((input) => {
        if (input.value === currentTime) {

            const taskName =
                input.parentElement.querySelector("span").textContent;

            const reminderKey = `reminded_${currentTime}_${taskName}`;

            if (localStorage.getItem(reminderKey) !== "yes") {

                if (Notification.permission === "granted") {
                    new Notification("⏰ Daily Routine Reminder", {
                        body: taskName, 
                    });
                } else {
                    alert(`⏰ Reminder: ${taskName}`);
                }

                localStorage.setItem(reminderKey, "yes"); 
            }
        }
    });
}
setInterval(checkReminders, 1000); 
const dietItems = document.querySelectorAll(".diet input[type='checkbox']");
const dietProgressText = document.getElementById("dietProgress");

function updateDietProgress() {
    const completed = document.querySelectorAll(
        ".diet input[type='checkbox']:checked"
    ).length;

    const total = dietItems.length;
    const percentage = Math.round((completed / total) * 100);

    dietProgressText.textContent = `Diet Progress: ${percentage}%`;
}

dietItems.forEach((item, index) => {
    const saved = localStorage.getItem(`diet${index}`);
    if (saved === "true") {
        item.checked = true;
    }
    item.addEventListener("change", () => {
        localStorage.setItem(`diet${index}`, item.checked);
    });
});

dietItems.forEach((item) => {
    item.addEventListener("change", updateDietProgress);
});

updateDietProgress();
let waterCount = Number(localStorage.getItem("waterCount")) || 0;

const waterprogress = document.getElementById("waterProgress");
const addWater  = document.getElementById("addWater");
const removeWater = document.getElementById("removeWater");

function updateWater() {
    waterprogress.textContent = `Water: ${waterCount} / 8 glasses`;
    localStorage.setItem("waterCount", waterCount);

    document.getElementById("waterCardCount").textContent =
        `${waterCount}/8 Glasses`;
}
addWater .addEventListener("click", () => {
    if (waterCount < 8) {
        waterCount++;
        updateWater();
    }
});
removeWater.addEventListener("click", () => {
    if (waterCount > 0) {
        waterCount--;
        updateWater();
    }
});
updateWater();
const addTaskButton = document.getElementById("addTaskBtn");
const taskForm = document.getElementById("taskForm");

addTaskButton.addEventListener("click", () => {
taskForm.style.display = "block";
});
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskName = document.getElementById("taskName");
const taskTime = document.getElementById("taskTime");

saveTaskBtn.addEventListener("click", () => {
    const name = taskName.value.trim();
    const time = taskTime.value;

    if (name === "") {
        alert("Please enter task name");
        return;
    }

    const customTasks = JSON.parse(localStorage.getItem("customTasks")) || [];

    customTasks.push({
        name: name,
        time: time,
        completed: false
    });

    localStorage.setItem("customTasks", JSON.stringify(customTasks));

    taskName.value = "";
    taskTime.value = "";
    taskForm.style.display = "none";

    loadCustomTasks();
});


function loadCustomTasks() {
    const customTasks = JSON.parse(localStorage.getItem("customTasks")) || [];

    // Purane custom tasks screen se remove karo
    document.querySelectorAll(".custom-task").forEach(task => {
        task.remove();
    });

    customTasks.forEach((item, index) => {

        const task = document.createElement("div");
        task.className = "task custom-task";

        task.innerHTML = `
            <input type="checkbox" ${item.completed ? "checked" : ""}>
            <span>${item.name}</span>
            <input type="time" value="${item.time}">
            <button class="deleteTask">Delete</button>
            <button class="editTask">Edit</button>
        `;

        const checkbox = task.querySelector("input[type='checkbox']");
        const timeInput = task.querySelector("input[type='time']");
        const deleteButton = task.querySelector(".deleteTask");
        const editButton = task.querySelector(".editTask");

editButton.addEventListener("click", () => {
    const newName = prompt("Enter new task name:", item.name);

    if (newName === null || newName.trim() === "") {
        return;
    }

    const newTime = prompt("Enter new time (HH:MM):", item.time);

    if (newTime === null || newTime.trim() === "") {
        return;
    }

    const tasks = JSON.parse(localStorage.getItem("customTasks")) || [];

    tasks[index].name = newName.trim();
    tasks[index].time = newTime.trim();

    localStorage.setItem("customTasks", JSON.stringify(tasks));

    loadCustomTasks();
});

        // Checkbox save
        checkbox.addEventListener("change", () => {
            const tasks = JSON.parse(localStorage.getItem("customTasks")) || [];

            tasks[index].completed = checkbox.checked;

            localStorage.setItem("customTasks", JSON.stringify(tasks));

            updateProgress();
        });

        // Time save
        timeInput.addEventListener("change", () => {
            const tasks = JSON.parse(localStorage.getItem("customTasks")) || [];

            tasks[index].time = timeInput.value;

            localStorage.setItem("customTasks", JSON.stringify(tasks));
        });

        // Delete task
        deleteButton.addEventListener("click", () => {
            const tasks = JSON.parse(localStorage.getItem("customTasks")) || [];

            tasks.splice(index, 1);

            localStorage.setItem("customTasks", JSON.stringify(tasks));

            loadCustomTasks();
            updateProgress();
        });

        document.querySelector(".routine").appendChild(task);
    });
    updateProgress();
}

loadCustomTasks();
const todayDate = document.getElementById("todayDate");

const today = new Date();

todayDate.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});
function updateStreak() {
    const streakDisplay = document.getElementById("streakCount");
    const allTasks = document.querySelectorAll('.task input[type="checkbox"]');

    if (!streakDisplay || allTasks.length === 0) return;

    const allCompleted = [...allTasks].every(task => task.checked);

    let streak = Number(localStorage.getItem("dayStreak")) || 0;
    const today = new Date();
    const todayKey = today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    const lastDate = localStorage.getItem("lastStreakDate");

    if (allCompleted && lastDate !== todayKey) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayKey = yesterday.getFullYear() + "-" +
            String(yesterday.getMonth() + 1).padStart(2, "0") + "-" +
            String(yesterday.getDate()).padStart(2, "0");

        streak = lastDate === yesterdayKey ? streak + 1 : 1;

        localStorage.setItem("dayStreak", streak);
        localStorage.setItem("lastStreakDate", todayKey);
    }
const previousDay = new Date(today);
previousDay.setDate(today.getDate() - 1);

const previousDayKey = previousDay.getFullYear() + "-" +
    String(previousDay.getMonth() + 1).padStart(2, "0") + "-" +
    String(previousDay.getDate()).padStart(2, "0");

if (lastDate && lastDate !== todayKey && lastDate !== previousDayKey) {
    streak = 0;
    localStorage.setItem("dayStreak", "0");
}
    streakDisplay.textContent = streak + (streak === 1 ? " Day" : " Days");
}

updateStreak();