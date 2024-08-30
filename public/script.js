const buttons = document.querySelectorAll('button[data-hero]');

buttons.forEach(button => {
    button.addEventListener('click', async function() {
        const hero = button.getAttribute('data-hero');
        try {
            const { data } = await axios.post(`https://faps.mlsc.tech/teams/${hero}`);
            const teamCardsContainer = document.getElementById('team-cards');

            // Clear previous cards
            teamCardsContainer.innerHTML = '';

            if (data.status === 'error') {
                const h1 = document.createElement('h1');
                h1.innerText = data.message;
                h1.style.color = 'red';
                h1.style.textAlign = 'center';
                document.body.appendChild(h1);
            } else if (data.status === 'success') {
                data.data.teams.forEach(team => {
                    const { name, tasks } = team;

                    // Count task types
                    const taskCounts = tasks.reduce((counts, task) => {
                        counts[task] = (counts[task] || 0) + 1;
                        return counts;
                    }, {});

                    const lowCount = taskCounts.low || 0;
                    const midCount = taskCounts.mid || 0;
                    const highCount = taskCounts.high || 0;

                    const card = document.createElement('div');
                    card.classList.add('card', 'bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition', 'duration-300', 'ease-in-out', 'w-full', 'max-w-lg');
                    
                    card.innerHTML = `
                        <h2 class="text-2xl font-semibold mb-4">${name}</h2>
                        <div class="task-info mb-2">
                            <p>❌ ${lowCount}</p>
                            <p>⭕ ${midCount}</p>
                            <p>✅ ${highCount}</p>
                        </div>
                    `;

                    card.addEventListener('click', () => {
                        // Add your logic for card click here
                        alert(`Clicked on ${name}`);
                    });

                    teamCardsContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
