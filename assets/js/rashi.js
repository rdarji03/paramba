const baseUrl = 'https://ai-horoscope.p.rapidapi.com/api/horoscope';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'a2e546cb81mshe2279ca03a03fcep150fa0jsn543b87379914',
        'x-rapidapi-host': 'ai-horoscope.p.rapidapi.com'
    }
};

const zodiacSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo',
    'virgo', 'libra', 'scorpio', 'sagittarius',
    'capricorn', 'aquarius', 'pisces'
];

const serviceContent = document.querySelector(".service-inner-content")
async function getZodiacHoroscope(sign) {
    const url = `${baseUrl}/${sign}/daily`;

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching horoscope for ${sign}:`, error);
        return null;
    }
}
function setZodiacLocal(zodiac, data) {
    localStorage.setItem(zodiac, JSON.stringify(data));
}
async function fetchHoroscopes() {
    const today = new Date().toISOString().split('T')[0];
    const lastFetchDate = localStorage.getItem('lastFetchDate');
    if (lastFetchDate === today) {
        console.log("Horoscopes have already been fetched today. Skipping API calls.");
        return;
    }
    console.log("Fetching horoscopes for today...");
    for (const sign of zodiacSigns) {
        try {
            const zodiacResponse = await getZodiacHoroscope(sign);

            if (zodiacResponse) {
                setZodiacLocal(sign, zodiacResponse);
                console.log(`Saved horoscope for ${sign}`, zodiacResponse);
            }
        } catch (error) {
            console.error(`Error processing ${sign}:`, error);
        }
    }
    localStorage.setItem('lastFetchDate', today);
    console.log("Horoscope data updated for today.");
}
fetchHoroscopes();

function fetchZodiacs() {
    let html = "";

    zodiacSigns.forEach(zodiac => {
        console.log(zodiac);
        const zodiacData = localStorage.getItem(zodiac);

        if (zodiacData) {
            try {
                const parsedZodiacData = JSON.parse(zodiacData);

                console.log(parsedZodiacData);

                html += `
                    <div class="col-md-6 p-2">
                        <div class="service-box bg-white d-flex flex-column justify-content-center align-items-center rounded-4 p-4">
                            <div class="service-img">
                                <img src="./assets/images/images/rashi/icons8-${zodiac}-96.png" alt="${zodiac}">
                            </div>
                            <h4 class="text-capitalize">${zodiac}</h4>
                            <p>${parsedZodiacData.horoscope}</p>
                            <p><span class="fw-medium">Health:</span>${parsedZodiacData.health}</p>
                            <p><span class="fw-medium">Money And Finance:</span>${parsedZodiacData.moneyAndFinance}</p>
                            <p><span class="fw-medium">Love And Relationship:</span>${parsedZodiacData.loveAndRelationship}</p>

                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error parsing data for ${zodiac}:`, error);
            }
        } else {
            console.log(`No data found for zodiac: ${zodiac}`);
        }
    });

    // Insert the generated HTML into the page
    const serviceContent = document.getElementById('zodiac-container');
    serviceContent.innerHTML = html;
}


fetchZodiacs()