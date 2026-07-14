/* ==========================================================================
   TaskFlow Application Logic
   Oasis Infobyte Internship - To-Do Application
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. App State & Core Variables
    // ----------------------------------------------------------------------
    let tasks = [];
    let activeConfirmCallback = null; // Store callback for custom modal confirmation

    // Load tasks from LocalStorage
    try {
        const storedTasks = localStorage.getItem('taskflow-tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    } catch (e) {
        console.warn('LocalStorage tasks failed to parse: ', e);
        tasks = [];
    }

    // ----------------------------------------------------------------------
    // 2. DOM Selectors
    // ----------------------------------------------------------------------
    // Form elements
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskCategorySelect = document.getElementById('task-category');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskDueDateInput = document.getElementById('task-duedate');

    // Stats & Progress Counters
    const statTotalEl = document.getElementById('stat-total');
    const statPendingEl = document.getElementById('stat-pending');
    const statCompletedEl = document.getElementById('stat-completed');
    const progressPercentEl = document.getElementById('progress-percent');
    const progressBarFillEl = document.getElementById('progress-bar-fill');

    // Controls, Filter toolbar inputs
    const searchInput = document.getElementById('search-input');
    const filterStatus = document.getElementById('filter-status');
    const filterCategory = document.getElementById('filter-category');
    const filterPriority = document.getElementById('filter-priority');
    const sortSelect = document.getElementById('sort-select');

    // Bulk buttons
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Task list containers & Empty state
    const taskListEl = document.getElementById('task-list');
    const emptyStateEl = document.getElementById('empty-state');

    // Confirm Modal Elements
    const confirmModal = document.getElementById('confirm-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalAgreeBtn = document.getElementById('modal-agree-btn');

    // Edit Modal Elements
    const editModal = document.getElementById('edit-modal');
    const editTaskForm = document.getElementById('edit-task-form');
    const editTaskIdInput = document.getElementById('edit-task-id');
    const editTaskTitleInput = document.getElementById('edit-task-title');
    const editTaskDescInput = document.getElementById('edit-task-desc');
    const editTaskCategorySelect = document.getElementById('edit-task-category');
    const editTaskPrioritySelect = document.getElementById('edit-task-priority');
    const editTaskDueDateInput = document.getElementById('edit-task-duedate');
    const editModalClose = document.getElementById('edit-modal-close');
    const editCancelBtn = document.getElementById('edit-cancel-btn');

    // Theme Toggle & Notification Container
    const themeToggle = document.getElementById('theme-toggle');
    const toastContainer = document.getElementById('toast-container');

    // ----------------------------------------------------------------------
    // 3. Theme Toggle Setup
    // ----------------------------------------------------------------------
    const savedTheme = localStorage.getItem('taskflow-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('taskflow-theme', nextTheme);
        updateThemeToggleIcon(nextTheme);
        showToast('Theme switched to ' + nextTheme + ' mode!', 'info');
    });

    function updateThemeToggleIcon(theme) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    // ----------------------------------------------------------------------
    // 4. Toast Notifications
    // ----------------------------------------------------------------------
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-alert ${type}`;
        
        let iconMarkup = '';
        switch (type) {
            case 'success':
                iconMarkup = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
                break;
            case 'warning':
                iconMarkup = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
                break;
            case 'danger':
                iconMarkup = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
                break;
            default: // info
                iconMarkup = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
        }

        toast.innerHTML = `
            <span class="toast-icon">${iconMarkup}</span>
            <span class="toast-text">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after animation delay
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2500);
    }

    // ----------------------------------------------------------------------
    // 5. Custom Modals (Confirmation dialog)
    // ----------------------------------------------------------------------
    function showConfirmModal(title, text, confirmCallback) {
        modalTitle.textContent = title;
        modalDesc.textContent = text;
        activeConfirmCallback = confirmCallback;
        confirmModal.classList.remove('hidden');
    }

    function closeConfirmModal() {
        confirmModal.classList.add('hidden');
        activeConfirmCallback = null;
    }

    modalClose.addEventListener('click', closeConfirmModal);
    modalCancelBtn.addEventListener('click', closeConfirmModal);
    modalAgreeBtn.addEventListener('click', () => {
        if (typeof activeConfirmCallback === 'function') {
            activeConfirmCallback();
        }
        closeConfirmModal();
    });

    // Close modal on escape press or overlay click
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeConfirmModal();
            closeEditModal();
        }
    });

    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
    });

    // ----------------------------------------------------------------------
    // 6. Custom Edit Modal
    // ----------------------------------------------------------------------
    function openEditModal(task) {
        editTaskIdInput.value = task.id;
        editTaskTitleInput.value = task.title;
        editTaskDescInput.value = task.description || '';
        editTaskCategorySelect.value = task.category;
        editTaskPrioritySelect.value = task.priority;
        editTaskDueDateInput.value = task.dueDate || '';
        editModal.classList.remove('hidden');
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
    }

    editModalClose.addEventListener('click', closeEditModal);
    editCancelBtn.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    editTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = editTaskIdInput.value;
        const taskIndex = tasks.findIndex(t => t.id === id);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].title = editTaskTitleInput.value.trim();
            tasks[taskIndex].description = editTaskDescInput.value.trim();
            tasks[taskIndex].category = editTaskCategorySelect.value;
            tasks[taskIndex].priority = editTaskPrioritySelect.value;
            tasks[taskIndex].dueDate = editTaskDueDateInput.value || null;
            
            saveTasks();
            render();
            closeEditModal();
            showToast('Task updated successfully!', 'success');
        }
    });

    // ----------------------------------------------------------------------
    // 7. Statistics Management
    // ----------------------------------------------------------------------
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        statTotalEl.textContent = total;
        statPendingEl.textContent = pending;
        statCompletedEl.textContent = completed;
        progressPercentEl.textContent = `${percent}%`;
        progressBarFillEl.style.width = `${percent}%`;
    }

    // ----------------------------------------------------------------------
    // 8. Core Task Handling (CRUD Actions)
    // ----------------------------------------------------------------------
    function saveTasks() {
        localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
        updateStats();
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();
        const category = taskCategorySelect.value;
        const priority = taskPrioritySelect.value;
        const dueDate = taskDueDateInput.value || null;

        if (!title) return;

        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            category,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask); // Prepend task
        saveTasks();
        render();

        // Reset form
        taskForm.reset();
        showToast('Task added successfully!', 'success');
    });

    function toggleTaskComplete(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            render();
            if (task.completed) {
                showToast('Task completed! Keep it up!', 'success');
            } else {
                showToast('Task marked as pending.', 'info');
            }
        }
    }

    function deleteTask(id) {
        showConfirmModal(
            'Delete Task',
            'Are you sure you want to delete this task? This action cannot be reverted.',
            () => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                render();
                showToast('Task deleted successfully.', 'danger');
            }
        );
    }

    // Bulk delete functions
    clearCompletedBtn.addEventListener('click', () => {
        const completedTasks = tasks.filter(t => t.completed);
        if (completedTasks.length === 0) {
            showToast('No completed tasks to clear.', 'warning');
            return;
        }

        showConfirmModal(
            'Clear Completed Tasks',
            `Are you sure you want to clear all ${completedTasks.length} completed tasks?`,
            () => {
                tasks = tasks.filter(t => !t.completed);
                saveTasks();
                render();
                showToast('Completed tasks cleared successfully.', 'success');
            }
        );
    });

    clearAllBtn.addEventListener('click', () => {
        if (tasks.length === 0) {
            showToast('There are no tasks to clear.', 'warning');
            return;
        }

        showConfirmModal(
            'Clear All Tasks',
            'Are you sure you want to erase all tasks? This will wipe your active database.',
            () => {
                tasks = [];
                saveTasks();
                render();
                showToast('All tasks cleared.', 'danger');
            }
        );
    });

    // ----------------------------------------------------------------------
    // 9. Query Engine (Search, Filter, Sort)
    // ----------------------------------------------------------------------
    function getFilteredAndSortedTasks() {
        const searchQuery = searchInput.value.toLowerCase().trim();
        const statusVal = filterStatus.value;
        const categoryVal = filterCategory.value;
        const priorityVal = filterPriority.value;
        const sortVal = sortSelect.value;

        // Step 1: Filter
        let result = tasks.filter(task => {
            // Search
            const matchesSearch = task.title.toLowerCase().includes(searchQuery);
            
            // Status
            let matchesStatus = true;
            if (statusVal === 'completed') matchesStatus = task.completed;
            else if (statusVal === 'pending') matchesStatus = !task.completed;

            // Category
            const matchesCategory = categoryVal === 'all' || task.category === categoryVal;

            // Priority
            const matchesPriority = priorityVal === 'all' || task.priority === priorityVal;

            return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
        });

        // Step 2: Sort
        const priorityWeights = { high: 3, medium: 2, low: 1 };
        
        result.sort((a, b) => {
            switch (sortVal) {
                case 'created-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'created-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'due-asc':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'due-desc':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(b.dueDate) - new Date(a.dueDate);
                case 'priority-desc':
                    return priorityWeights[b.priority] - priorityWeights[a.priority];
                case 'priority-asc':
                    return priorityWeights[a.priority] - priorityWeights[b.priority];
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        return result;
    }

    // ----------------------------------------------------------------------
    // 10. List Rendering & Template Building
    // ----------------------------------------------------------------------
    function isOverdue(dueDate, completed) {
        if (!dueDate || completed) return false;
        
        // Normalize today to start of day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        
        return due < today;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }

    function render() {
        const filteredTasks = getFilteredAndSortedTasks();
        taskListEl.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyStateEl.classList.remove('hidden');
            taskListEl.classList.add('hidden');
            return;
        }

        emptyStateEl.classList.add('hidden');
        taskListEl.classList.remove('hidden');

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.setAttribute('draggable', 'true');
            li.setAttribute('data-id', task.id);
            li.setAttribute('data-index', index);
            
            // Check overdue state
            const overdue = isOverdue(task.dueDate, task.completed);
            if (overdue) {
                li.classList.add('overdue');
            }
            if (task.completed) {
                li.classList.add('completed');
            }

            // Map category tags with corresponding icons
            const categoryIcons = {
                Work: '💼',
                Personal: '👤',
                Shopping: '🛒',
                Health: '🍏',
                Education: '🎓',
                Urgent: '🔥'
            };
            const catIcon = categoryIcons[task.category] || '📋';

            li.innerHTML = `
                <!-- Drag Grip Handle -->
                <div class="drag-handle" title="Drag to reorder">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </div>
                
                <!-- Complete Checkbox -->
                <label class="checkbox-container" aria-label="Toggle completed status">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
                
                <!-- Details Card Body -->
                <div class="task-details">
                    <div class="task-title-row">
                        <span class="task-title">${task.title}</span>
                    </div>
                    ${task.description ? `<p class="task-desc">${task.description}</p>` : ''}
                    
                    <div class="badges">
                        <span class="badge badge-category">${catIcon} ${task.category}</span>
                        <span class="badge badge-priority priority-${task.priority}">${task.priority} Priority</span>
                        ${task.dueDate ? `
                            <span class="badge badge-date" title="${overdue ? 'Task is Overdue!' : 'Due date'}">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="margin-right:2px;">
                                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 3h5v5h-5v-5z"/>
                                </svg>
                                ${formatDate(task.dueDate)} ${overdue ? ' (Overdue)' : ''}
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Action Controls -->
                <div class="task-actions">
                    <button class="btn-icon edit-btn" aria-label="Edit task" title="Edit details">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete-btn" aria-label="Delete task" title="Delete task">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            `;

            // Complete Toggle Listener
            li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
                toggleTaskComplete(task.id);
            });

            // Edit Action Listener
            li.querySelector('.edit-btn').addEventListener('click', () => {
                openEditModal(task);
            });

            // Delete Action Listener
            li.querySelector('.delete-btn').addEventListener('click', () => {
                deleteTask(task.id);
            });

            // Setup HTML5 Drag and Drop listeners
            setupDragAndDrop(li);

            taskListEl.appendChild(li);
        });
    }

    // ----------------------------------------------------------------------
    // 11. HTML5 Drag and Drop Reordering Logic
    // ----------------------------------------------------------------------
    let draggedId = null;

    function setupDragAndDrop(element) {
        element.addEventListener('dragstart', (e) => {
            draggedId = element.getAttribute('data-id');
            element.classList.add('dragging');
            
            // Set drag transfer details
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedId);
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const draggingEl = document.querySelector('.dragging');
            const targetEl = e.currentTarget;
            
            // Allow drag position detection (before/after sibling cards)
            if (draggingEl && draggingEl !== targetEl) {
                const bounding = targetEl.getBoundingClientRect();
                const offset = e.clientY - bounding.top;
                
                if (offset > bounding.height / 2) {
                    targetEl.after(draggingEl);
                } else {
                    targetEl.before(draggingEl);
                }
            }
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            reorderTasksFromDOM();
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    }

    function reorderTasksFromDOM() {
        const renderedItems = taskListEl.querySelectorAll('.task-item');
        const newOrderedTasks = [];
        
        renderedItems.forEach(item => {
            const id = item.getAttribute('data-id');
            const originalTask = tasks.find(t => t.id === id);
            if (originalTask) {
                newOrderedTasks.push(originalTask);
            }
        });

        // Insert unrendered/filtered out tasks back at the end to prevent data loss
        tasks.forEach(task => {
            if (!newOrderedTasks.some(t => t.id === task.id)) {
                newOrderedTasks.push(task);
            }
        });

        tasks = newOrderedTasks;
        saveTasks();
        // Skip calling render() immediately to avoid snapping the drag animation
        updateStats();
    }

    // ----------------------------------------------------------------------
    // 12. Backup Utilities (JSON Import & Export)
    // ----------------------------------------------------------------------
    exportBtn.addEventListener('click', () => {
        if (tasks.length === 0) {
            showToast('Nothing to export. Task database is empty.', 'warning');
            return;
        }

        try {
            const dataStr = JSON.stringify(tasks, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showToast('Tasks database exported successfully!', 'success');
        } catch (error) {
            showToast('Failed to export tasks: ' + error.message, 'danger');
        }
    });

    importBtn.addEventListener('click', () => {
        importFile.click(); // Trigger file dialog clicks
    });

    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // Integrity Validation
                if (!Array.isArray(importedData)) {
                    throw new Error('Data format must be a JSON array.');
                }
                
                // Verify basic objects structure
                const validatedTasks = importedData.filter(item => {
                    return item && typeof item === 'object' && 'id' in item && 'title' in item && 'completed' in item;
                });

                if (validatedTasks.length === 0) {
                    throw new Error('No valid task objects found in backup.');
                }

                // Merge tasks database, resolving duplicate keys by overwriting
                const merged = [...tasks];
                let addedCount = 0;
                
                validatedTasks.forEach(impTask => {
                    const idx = merged.findIndex(t => t.id === impTask.id);
                    if (idx !== -1) {
                        merged[idx] = impTask; // Overwrite
                    } else {
                        merged.unshift(impTask); // Insert new
                        addedCount++;
                    }
                });

                tasks = merged;
                saveTasks();
                render();
                showToast(`Database parsed! Merged ${validatedTasks.length} tasks successfully.`, 'success');
            } catch (error) {
                showToast('Import failed: ' + error.message, 'danger');
            }
            // Reset file input value
            importFile.value = '';
        };
        reader.readAsText(file);
    });

    // ----------------------------------------------------------------------
    // 13. Event Listeners for Filters & Sorting
    // ----------------------------------------------------------------------
    searchInput.addEventListener('input', render);
    filterStatus.addEventListener('change', render);
    filterCategory.addEventListener('change', render);
    filterPriority.addEventListener('change', render);
    sortSelect.addEventListener('change', render);

    // ----------------------------------------------------------------------
    // 14. Initialization Boot
    // ----------------------------------------------------------------------
    updateStats();
    render();
});
