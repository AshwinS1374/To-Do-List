let allTasksArr = [];

        const addbutton = document.getElementById("addbutton");
        const clearbutton = document.getElementById("clearbutton");

        addbutton.addEventListener("click", () => {
            const inputtext = document.getElementById("userinputtext").value;
            const duedatetime = document.getElementById("datetimelimit").value;

            if (inputtext === "" || duedatetime === "") {
                alert("Please enter both task and due date/time.");
                return;
            }

            for (let i = 0; i < allTasksArr.length; i++) {
                if (inputtext === allTasksArr[i].newtask) {
                    alert("Task is already present!!");
                    return;
                }
            }

            const dueDate = new Date(duedatetime);
            const now = new Date();
            let diff = dueDate.getTime() - now.getTime();

            if (diff < 0) {
                alert("Due date and time must be in the future.");
                return;
            }

            const div = document.createElement("div");
            div.className = "task";

            const activeTasksCount = document.querySelectorAll(".newtasks .task").length;
            const prioritylvl = activeTasksCount + 1;

            const plvl = document.createElement("div");
            plvl.className = "prioritylvl";
            plvl.textContent = prioritylvl;

            const newtaskadd = document.createElement("div");
            newtaskadd.className = "newcontent";
            newtaskadd.textContent = inputtext;

            const remaining_datetime = document.createElement("div");
            remaining_datetime.className = "remainingdatetime";
            remaining_datetime.textContent = calculateRemainingTime(duedatetime);

            const arrow = document.createElement("div");
            const upicon = document.createElement("button");
            upicon.className = "arrow";
            upicon.innerHTML = "⬆";
            arrow.appendChild(upicon);

            const downicon = document.createElement("button");
            downicon.className = "arrow";
            downicon.innerHTML = "⬇";
            arrow.appendChild(downicon);

            const cancelbutton = document.createElement("div");
            const cancelicon = document.createElement("button");
            cancelicon.className = "cancelbtn";
            cancelicon.innerHTML = "🗑️";
            cancelbutton.appendChild(cancelicon);

            const tickbutton = document.createElement("div");
            const tickicon = document.createElement("button");
            tickicon.className = "tickbtn";
            tickicon.innerHTML = "&#10003";
            tickbutton.appendChild(tickicon);

            div.append(plvl, newtaskadd, remaining_datetime, arrow, cancelbutton, tickbutton);

            cancelicon.addEventListener("click", () => {
                div.remove();
                allTasksArr = allTasksArr.filter(task => task.prioritylvl !== prioritylvl);
                updatePriorityLevels();
                saveTasksToLocalStorage();
            });

            upicon.addEventListener("click", () => {
                const taskElement = upicon.closest(".task");
                const currentPriority = parseInt(taskElement.querySelector(".prioritylvl").textContent);
                if (currentPriority > 1) {
                    const prevTaskElement = taskElement.previousElementSibling;
                    if (prevTaskElement) {
                        taskElement.parentNode.insertBefore(taskElement, prevTaskElement);
                        updatePriorityLevels();
                        updateTaskArrayOrder();
                        saveTasksToLocalStorage();
                    }
                }
            });

            downicon.addEventListener("click", () => {
                const taskElement = downicon.closest(".task");
                const currentPriority = parseInt(taskElement.querySelector(".prioritylvl").textContent);
                if (currentPriority < allTasksArr.length) {
                    const nextTaskElement = taskElement.nextElementSibling;
                    if (nextTaskElement) {
                        taskElement.parentNode.insertBefore(nextTaskElement, taskElement);
                        updatePriorityLevels();
                        updateTaskArrayOrder();
                        saveTasksToLocalStorage();
                    }
                }
            });

            tickicon.addEventListener("click", () => {
                const taskElement = tickicon.closest(".task");
                const text = taskElement.querySelector(".newcontent").textContent;
                allTasksArr = allTasksArr.filter(task => task.newtask !== text);
                div.remove();
                updatePriorityLevels();
                updateTaskArrayOrder();
                saveTasksToLocalStorage();
            });

            const newlyAddedTask = {
                prioritylvl: prioritylvl,
                newtask: inputtext,
                duedatetime: duedatetime
            };

            allTasksArr.push(newlyAddedTask);
            document.querySelector(".newtasks").appendChild(div);
            document.getElementById("userinputtext").value = "";
            document.getElementById("datetimelimit").value = "";

            // Updating the remaining time for this task
            dynamiCountDown(div, duedatetime);
            
            // Save updated allTasksArr to local storage
            saveTasksToLocalStorage();
        });

        function renderTasks() {
            const tasksContainer = document.querySelector('.newtasks');
            tasksContainer.innerHTML = ''; // Clear existing tasks

            allTasksArr.forEach(task => {
                const div = document.createElement("div");
                div.className = "task";

                const plvl = document.createElement("div");
                plvl.className = "prioritylvl";
                plvl.textContent = task.prioritylvl;

                const newtaskadd = document.createElement("div");
                newtaskadd.className = "newcontent";
                newtaskadd.textContent = task.newtask;

                const remaining_datetime = document.createElement("div");
                remaining_datetime.className = "remainingdatetime";
                remaining_datetime.textContent = calculateRemainingTime(task.duedatetime);

                const arrow = document.createElement("div");

                const upicon = document.createElement("button");
                upicon.className = "arrow";
                upicon.innerHTML = "⬆";
                arrow.appendChild(upicon);

                const downicon = document.createElement("button");
                downicon.className = "arrow";
                downicon.innerHTML = "⬇";
                arrow.appendChild(downicon);

                const cancelbutton = document.createElement("div");
                const cancelicon = document.createElement("button");
                cancelicon.className = "cancelbtn";
                cancelicon.innerHTML = "🗑️";
                cancelbutton.appendChild(cancelicon);

                const tickbutton = document.createElement("div");
                const tickicon = document.createElement("button");
                tickicon.className = "tickbtn";
                tickicon.innerHTML = "&#10003";
                tickbutton.appendChild(tickicon);

                div.append(plvl, newtaskadd, remaining_datetime, arrow, cancelbutton, tickbutton);

                cancelicon.addEventListener("click", () => {
                    div.remove();
                    allTasksArr = allTasksArr.filter(t => t.newtask !== task.newtask);
                    updatePriorityLevels();
                    updateTaskArrayOrder();
                    saveTasksToLocalStorage();
                });

                upicon.addEventListener("click", () => {
                    const taskElement = upicon.closest(".task");
                    const currentPriority = parseInt(taskElement.querySelector(".prioritylvl").textContent);
                    if (currentPriority > 1) {
                        const prevTaskElement = taskElement.previousElementSibling;
                        if (prevTaskElement) {
                            taskElement.parentNode.insertBefore(taskElement, prevTaskElement);
                            updatePriorityLevels();
                            updateTaskArrayOrder();
                            saveTasksToLocalStorage();
                        }
                    }
                });

                downicon.addEventListener("click", () => {
                    const taskElement = downicon.closest(".task");
                    const currentPriority = parseInt(taskElement.querySelector(".prioritylvl").textContent);
                    if (currentPriority < allTasksArr.length) {
                        const nextTaskElement = taskElement.nextElementSibling;
                        if (nextTaskElement) {
                            taskElement.parentNode.insertBefore(nextTaskElement, taskElement);
                            updatePriorityLevels();
                            updateTaskArrayOrder();
                            saveTasksToLocalStorage();
                        }
                    }
                });

                tickicon.addEventListener("click", () => {
                    div.remove();
                    allTasksArr = allTasksArr.filter(t => t.newtask !== task.newtask);
                    updatePriorityLevels();
                    updateTaskArrayOrder();
                    saveTasksToLocalStorage();
                });

                tasksContainer.appendChild(div);
                dynamiCountDown(div, task.duedatetime);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            allTasksArr = loadTasksFromLocalStorage();
            renderTasks();
        });

        clearbutton.addEventListener("click", () => {
            allTasksArr = [];
            saveTasksToLocalStorage();
            document.querySelector(".newtasks").innerHTML = "";
        });

        function saveTasksToLocalStorage() {
            localStorage.setItem('tasks', JSON.stringify(allTasksArr));
        }

        function loadTasksFromLocalStorage() {
            const tasks = localStorage.getItem('tasks');
            return tasks ? JSON.parse(tasks) : [];
        }

        function updatePriorityLevels() {
            const tasks = document.querySelectorAll(".task");
            for (let i = 0; i < tasks.length; i++) {
                const priorityLevelElement = tasks[i].querySelector(".prioritylvl");
                priorityLevelElement.textContent = i + 1;
                allTasksArr[i].prioritylvl = i + 1;
            }
        }

        function updateTaskArrayOrder() {
            const tasks = document.querySelectorAll(".task");
            const updatedTasks = [];
            for (let i = 0; i < tasks.length; i++) {
                const taskObj = {
                    prioritylvl: i + 1,
                    newtask: tasks[i].querySelector(".newcontent").textContent,
                    duedatetime: allTasksArr.find(task => task.newtask === tasks[i].querySelector(".newcontent").textContent).duedatetime
                };
                updatedTasks.push(taskObj);
            }
            allTasksArr = updatedTasks;
        }

        function calculateRemainingTime(dueDateTime) {
            const dueDate = new Date(dueDateTime);
            const now = new Date();
            let diff = dueDate.getTime() - now.getTime();
            if (diff < 0) {
                return "Past due";
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff -= days * (1000 * 60 * 60 * 24);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            diff -= hours * (1000 * 60 * 60);
            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            let remainingTime = "";
            if (days > 0) {
                remainingTime += days + "d ";
            }
            if (hours > 0) {
                remainingTime += hours + "h ";
            }
            if (minutes > 0) {
                remainingTime += minutes + "m ";
            }
            if (seconds > 0) {
                remainingTime += seconds + "s";
            }
            return remainingTime;
        }

        function dynamiCountDown(taskElement, dueDateTime) {
            const remainingTimeElement = taskElement.querySelector('.remainingdatetime');
            const plvl = taskElement.querySelector('.prioritylvl');
            setInterval(() => {
                const remainingTime = calculateRemainingTime(dueDateTime);
                remainingTimeElement.textContent = remainingTime;
                
                if (remainingTime === "Past due" && taskElement.style.backgroundColor !== 'red') {
                    plvl.style.backgroundColor = 'rgb(79, 75, 75)';
                    taskElement.style.backgroundColor = 'red';
                }
            }, 1000);
        }