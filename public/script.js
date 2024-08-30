const buttons = document.querySelectorAll('button[data-hero]');

buttons.forEach(button => {
    button.addEventListener('click', async function() {
        const hero = button.getAttribute('data-hero');
        try {
            const { data } = await axios.post(`https://faps.mlsc.tech/teams/${hero}`);
            const teamCardsContainer = document.getElementById('team-cards');

            // Clear previous content
            teamCardsContainer.innerHTML = '';

            if (data.status === 'error') {
                const h1 = document.createElement('h1');
                h1.innerText = data.message;
                h1.style.color = 'red';
                h1.style.textAlign = 'center';
                teamCardsContainer.appendChild(h1);
            } else if (data.status === 'success') {
                data.data.teams.forEach(team => {
                    const { name, tasks = [] } = team;

                    // Create team name header
                    const teamHeader = document.createElement('h1');
                    teamHeader.classList.add('text-3xl', 'font-bold', 'mb-4', 'text-center');
                    teamHeader.innerText = name;

                    // Create task list container
                    const taskListContainer = document.createElement('div');
                    taskListContainer.classList.add('task-list');

                    tasks.forEach((task, index) => {
                        const taskCard = document.createElement('div');
                        taskCard.classList.add('task-card', 'bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'mb-4');
                        
                        const taskTitle = document.createElement('h2');
                        taskTitle.classList.add('text-xl', 'font-semibold');
                        taskTitle.innerText = `Task ${index + 1}`;

                        const dropdown = document.createElement('select');
                        dropdown.classList.add('task-dropdown', 'border', 'p-2', 'rounded');
                        dropdown.innerHTML = `
                            <option value="low" ${task === 'low' ? 'selected' : ''}>❌ Low</option>
                            <option value="mid" ${task === 'mid' ? 'selected' : ''}>⭕ Mid</option>
                            <option value="high" ${task === 'high' ? 'selected' : ''}>✅ High</option>
                        `;
                        
                        dropdown.addEventListener('change', async (event) => {
                            const newStatus = event.target.value;
                            if (confirm(`Are you sure you want to change the status of Task ${index + 1} to ${getStatusSymbol(newStatus)}?`)) {
                                try {
                                    let newname = name.replace(/ /g, '%20');
                                    const updateResponse = await axios.put(`https://faps.mlsc.tech/team/${newname}`, {
                                        task: index + 1,
                                        status: newStatus
                                    });

                                    if (updateResponse.data.status === 'success') {
                                        alert('Task status updated successfully');
                                    } else {
                                        alert('Failed to update task status. Reverting changes.');
                                        // Revert dropdown selection
                                        dropdown.value = task;
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                    // Revert dropdown selection in case of error
                                    dropdown.value = task;
                                }
                            } else {
                                // Revert dropdown selection if canceled
                                dropdown.value = task;
                            }
                        });

                        taskCard.appendChild(taskTitle);
                        taskCard.appendChild(dropdown);
                        taskListContainer.appendChild(taskCard);
                    });

                    teamCardsContainer.appendChild(teamHeader);
                    teamCardsContainer.appendChild(taskListContainer);
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function getStatusSymbol(status) {
    switch (status) {
        case 'low':
            return '❌';
        case 'mid':
            return '⭕';
        case 'high':
            return '✅';
        default:
            return '';
    }
}
