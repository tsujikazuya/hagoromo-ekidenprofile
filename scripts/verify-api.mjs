const baseUrl = 'http://localhost:3000/api';

async function verify() {
    console.log('--- Verifying APIs ---');

    // 1. Create Athlete
    console.log('1. Creating Athlete...');
    const athleteRes = await fetch(`${baseUrl}/athletes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Verification User',
            birthDate: '2000-01-01',
            historyAnemia: true,
            baselineFerritin: 20.5
        })
    });

    if (!athleteRes.ok) {
        console.error('Failed to create athlete:', await athleteRes.text());
        return;
    }

    const athlete = await athleteRes.json();
    console.log('Athlete Created:', athlete);
    const athleteId = athlete.id;

    // 2. Create Blood Test
    console.log('2. Creating Blood Test...');
    const bloodRes = await fetch(`${baseUrl}/blood-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            athleteId: athleteId,
            date: '2024-01-01',
            hemoglobin: 12.5,
            ferritin: 30.0
        })
    });
    const blood = await bloodRes.json();
    console.log('Blood Test Created:', blood);

    // 3. Create Daily Condition
    console.log('3. Creating Daily Condition...');
    const conditionRes = await fetch(`${baseUrl}/daily-conditions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            athleteId: athleteId,
            date: '2024-01-02',
            mensesStatus: 1,
            restingHeartRate: 50,
            sleepQuality: 4,
            subjectiveFatigue: 30,
            morningWeight: 45.5
        })
    });
    const condition = await conditionRes.json();
    console.log('Daily Condition Created:', condition);

    // 4. Verification Fetch
    console.log('4. Verifying Data Fetch...');
    const athletesList = await (await fetch(`${baseUrl}/athletes`)).json();
    console.log(`Athletes Count: ${athletesList.length}`);

    const bloodList = await (await fetch(`${baseUrl}/blood-tests?athleteId=${athleteId}`)).json();
    console.log(`Blood Tests for athlete: ${bloodList.length}`);

    const conditionList = await (await fetch(`${baseUrl}/daily-conditions?athleteId=${athleteId}&start=2024-01-01&end=2024-01-31`)).json();
    console.log(`Conditions for athlete: ${conditionList.length}`);

    console.log('--- Verification Complete ---');
}

verify().catch(console.error);
