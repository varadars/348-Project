document.addEventListener('DOMContentLoaded', async () => {
    const data = await getData();
    loadTable(data);
});

const dateEl = document.getElementById('date');
const itemNameEl = document.getElementById('item-name');
//const categoryEl = document.getElementById('category');
const brandEl = document.getElementById('brand');
const quantEl = document.getElementById('quantity');
const totalEl = document.getElementById('total');

dateEl.addEventListener('click', async function() {
    const data = await getData('date');
    loadTable(data);
});

itemNameEl.addEventListener('click', async function() {
    const data = await getData('item_name');
    loadTable(data);
});

// categoryEl.addEventListener('click', async function() {
//     const data = await getData('category');
//     loadTable(data);
// });

brandEl.addEventListener('click', async function() {
    const data = await getData('brand');
    loadTable(data);
});

quantEl.addEventListener('click', async function() {
    const data = await getData('quantity');
    loadTable(data);
});

totalEl.addEventListener('click', async function() {
    const data = await getData('total');
    loadTable(data);
});

async function getData(columnName){
    try {
        const fetchString = '/api/allinstances?columnName=' + columnName;
        const response = await fetch(fetchString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('rows').textContent = 'Error fetching data';
    }
}

async function loadTable (data){

    const tableEl = document.getElementById('rows');

    $("#rows").find("tr:gt(0)").remove();

    for (let i = 0; i < data.length; i++){
        var row = tableEl.insertRow(1+i);

        // Access the cells collection directly
        const date = new Date(data[i]["date"]);
        const easternTime = date.toLocaleString("en-US", {timeZone: "America/New_York"});
        row.insertCell(0).innerHTML = easternTime;
        row.insertCell(1).innerHTML = data[i]["item_name"];
        row.insertCell(2).innerHTML = "fruit";
        row.insertCell(3).innerHTML = data[i]["brand"];
        const stringVal = data[i]["quantity"] + " " + data[i]["unit"];
        row.insertCell(4).innerHTML = stringVal;
        row.insertCell(5).innerHTML = "$" + data[i]["total"].toFixed(2);

    }
}


