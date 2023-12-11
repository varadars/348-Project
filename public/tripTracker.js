document.addEventListener('DOMContentLoaded', async () => {
    const fetchString = `/api/gettrips`;
    const response = await fetch(fetchString);
    if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
    }

    const divEl = document.getElementById('storeList');
    const data = await response.json();
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        var x = document.createElement("BUTTON");
        var t = document.createTextNode(data[i]["store_name"]+", Total Trips:"+data[i]["day"]);
        x.appendChild(t);
        divEl.appendChild(x);
    }
});
