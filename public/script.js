const buttons = document.querySelectorAll('button[data-hero]');

    buttons.forEach(button => {
        button.addEventListener('click', async function() {
            const hero = button.getAttribute('data-hero');
            try {
                const response = await axios.post(`https://faps.mlsc.tech/teams/${hero}`, {
                    hero: hero
                });
                console.log(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });