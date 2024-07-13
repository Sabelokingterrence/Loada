document.getElementById('addTruck').addEventListener('click', function () {
    const trucksDiv = document.getElementById('trucks');
    const truckCount = trucksDiv.getElementsByClassName('truck').length + 1;

    const newTruckDiv = document.createElement('div');
    newTruckDiv.className = 'truck';
    newTruckDiv.innerHTML = `
        <label for="truck_${truckCount}">Truck ${truckCount} Registration Number:</label>
        <input type="text" id="truck_${truckCount}" name="trucks[]" required>
    `;
    trucksDiv.appendChild(newTruckDiv);
});
