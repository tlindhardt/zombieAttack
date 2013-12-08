var map = new Map();

map.showGrid(true);

var currentLayer = 'bottom';

var selectedTile = {
	bottom: { left: 22, right: 9  },
	middle: { left: 16, right: 21 },
	upper:  { left: 0, 	right: 1  },
	events: { left: 0, 	right: 1  },
	player: false
};

map.setSelected(selectedTile);

var selectColor = {
  left: 'red',
  right: 'green'
};

var events = ["treasure", "bush", "hole", "door"];
var eventsMap = {
  "treasure": 0, 
  "bush": 1, 
  "hole": 2, 
  "door": 3
}

var eventsOptions = {
  treasure: 1,
  destination: {
    id: -1,
    x: 0,
    y: 0
  }
};

map.eventsOptions(eventsOptions);