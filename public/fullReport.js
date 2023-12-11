document.addEventListener('DOMContentLoaded', async () => {
    const data = await getData();
    loadPickers();
    loadTable(data);
});

const dateEl = document.getElementById('date');
const itemNameEl = document.getElementById('item-name');
const categoryEl = document.getElementById('category');
const brandEl = document.getElementById('brand');
const quantEl = document.getElementById('quantity');
const priceEl = document.getElementById('price');
const totalEl = document.getElementById('total');

dateEl.addEventListener('click', () => handleClick('date', 0));
dateEl.addEventListener('dblclick', () => handleClick('date', 1));
itemNameEl.addEventListener('click', () => handleClick('item_name', 0));
itemNameEl.addEventListener('dblclick', () => handleClick('item_name', 1));
categoryEl.addEventListener('click', () => handleClick('category', 0));
categoryEl.addEventListener('dblclick', () => handleClick('category', 1));
brandEl.addEventListener('click', () => handleClick('brand', 0));
brandEl.addEventListener('dblclick', () => handleClick('brand', 1));
quantEl.addEventListener('click', () => handleClick('quantity', 0));
quantEl.addEventListener('dblclick', () => handleClick('quantity', 1));
priceEl.addEventListener('click', () => handleClick('unit_price', 0));
priceEl.addEventListener('dblclick', () => handleClick('unit_price', 1));
totalEl.addEventListener('click', () => handleClick('total', 0));
totalEl.addEventListener('dblclick', () => handleClick('total', 1));

// categoryEl.addEventListener('click', async function() {
//     const data = await getData('category');
//     loadTable(data);
// });

const handleClick = async (colName, descValue) => {
    const data = await getData(colName, descValue);
    loadTable(data);
};

async function loadPickers (){
    const namePickerEl = document.getElementById('itemNameSelect');
    const categoryPickerEl = document.getElementById('categorySelect');
    const startDatePickerEl = document.getElementById('start-date');
    const endDatePickerEl = document.getElementById('end-date');

    //categories
    const catResponse = await fetch('/api/allcategories');
    if (!catResponse.ok) {
      throw new Error(`Server responded with status: ${catResponse.status}`);
    }
  
    // Display data on the HTML page
    const catData = await catResponse.json();

    for (let i = 0; i < catData.length; i++) {
        let option = document.createElement("option");
        option.text = catData[i]["category_name"];
        categoryPickerEl.add(option);
    }

    //items

    const itemResponse = await fetch('/api/allitems');
    if (!itemResponse.ok) {
        throw new Error(`Server responded with status: ${itemResponse.status}`);
    }

    // Display data on the HTML page
    const itemData = await itemResponse.json();

    for(let k = 0; k < itemData.length; k++){
        let option = document.createElement("option");
        option.text = itemData[k]["item_name"];
        namePickerEl.add(option);
    }
}

async function getData(columnName, desc){
    try {
        const params = new URLSearchParams({
            columnName: columnName,
            descVal: desc
        });

        const fetchString = `/api/allinstances?${params.toString()}`;
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
        console.log(data[i]);
        const date = new Date(data[i]["date"]);
        const easternTime = date.toLocaleString("en-US", {timeZone: "America/New_York"});
        const eDate = moment(easternTime, "").format("MMM Do, YY")
        row.insertCell(0).innerHTML = eDate;
        row.insertCell(1).innerHTML = data[i]["item_name"];
        row.insertCell(2).innerHTML = data[i]["category"];
        row.insertCell(3).innerHTML = data[i]["brand"];
        const stringVal = data[i]["quantity"] + " " + data[i]["unit"];
        row.insertCell(4).innerHTML = stringVal;
        row.insertCell(5).innerHTML = "$" + data[i]["unit_price"].toFixed(2);
        row.insertCell(6).innerHTML = "$" + data[i]["total"].toFixed(2);

    }
}


