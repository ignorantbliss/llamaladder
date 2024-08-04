
class LadderLogic {

	//Stores the individual items in the ladder logic in a grid of rungs and nodes.
	grid = [];
	
	//The last element added
	lastcomp = null;
	
	//A list of the first element of each rung
	startcomps = [];
			
	//A list of elements. Each element is a single item in the grid.
	elems = [];
	//A list of components. Each component is a single NAMED item in the logic (there might be several elements that reference a component).
	components = {};
	
	//The 'width' of the grid - max number of items per rung.
	width = 6;
	
	//The width, minus 1.
	lastpoint = 5;
	
	//The y coordinate of the lowest rung.
	lowestpoint = 300;

	//Draw a single item from the grid as an SVG
	drawElement(ele,x,y,typ) {
		//Add a group with a transform to locate the grid item correctly in the SVG file
		var content = '<g transform="translate(' + x*100 + ' ' + y*100 + ')" class="xp' + x + ' yp' + y + '">';
		var fsize = 10;
		var foffset = 0;
		
		if (ele.type == "coil")
		{
			if (ele.edge != undefined)			
			{
				if (((ele.edge == "falling") && (ele.edge == "on")) || ((ele.edge == "rising") && (ele.edge == "off")))
				{
					//This is a negative (falling) coil
					content += `
						<line class="st0" x1="-0.5" y1="50" x2="30" y2="50"/>		
						<line class="st0" x1="71" y1="50" x2="100" y2="50"/>		
						<path class="st0" d="M44.19,63.88C36.35,63.88,30,57.53,30,49.69S36.35,35.5,44.19,35.5"/>
						<path class="st0" d="M57,63.88c7.84,0,14.19-6.35,14.19-14.19S64.84,35.5,57,35.5"/>`;
						
					content += '<text x="50" y="55" text-anchor="middle" font-size="20" font-weight="bold">N</text>';
					
					var newcomp = {"type": "nedge", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
					if (this.lastcomp != null) 
						this.lastcomp['next'] = newcomp;
					else
						this.startcomps.push(newcomp);
					this.elems.push(newcomp);
					this.lastcomp = newcomp;					
				}
				else
				{
					//This is a positive (rising) coil
					content += `
						<line class="st0" x1="-0.5" y1="50" x2="30" y2="50"/>		
						<line class="st0" x1="71" y1="50" x2="100" y2="50"/>		
						<path class="st0" d="M44.19,63.88C36.35,63.88,30,57.53,30,49.69S36.35,35.5,44.19,35.5"/>
						<path class="st0" d="M57,63.88c7.84,0,14.19-6.35,14.19-14.19S64.84,35.5,57,35.5"/>`;
					content += '<text x="50" y="55" text-anchor="middle" font-size="20" font-weight="bold">P</text>';
					
					var newcomp = {"type": "pedge", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
					if (this.lastcomp != null) 
						this.lastcomp['next'] = newcomp;
					else
						this.startcomps.push(newcomp);
					this.elems.push(newcomp);
					this.lastcomp = newcomp;
				}
					
			}
			else
			{
				if (ele.state == "on")
				{	
					//A normally-open coil
					content += `
			<line class="st0" x1="0" y1="50" x2="35" y2="50"/>
			<line class="st0" x1="66" y1="50" x2="100" y2="50"/>
			<line class="st0" x1="35.5" y1="25" x2="35.5" y2="75"/>
			<line class="st0" x1="65.5" y1="25" x2="65.5" y2="75"/> `;
			
					var newcomp = {"type": "no", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
					if (this.lastcomp != null) 
						this.lastcomp['next'] = newcomp;
					else
						this.startcomps.push(newcomp);
					this.elems.push(newcomp);
					this.lastcomp = newcomp;
				}
				else
				{
					//A normally-closed coil
					content += `
			<line class="st0" x1="-0.5" y1="50" x2="35" y2="50"/>
			<line class="st0" x1="66" y1="50" x2="100" y2="50"/>
			<line class="st0" x1="35.5" y1="25" x2="35.5" y2="75"/>
			<line class="st0" x1="65.5" y1="25" x2="65.5" y2="75"/>
			<line class="st0" x1="26.5" y1="68.5" x2="72.5" y2="28.5"/>`;
			
				var newcomp = {"type": "nc", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
				if (this.lastcomp != null) 
					this.lastcomp['next'] = newcomp;
				else
					this.startcomps.push(newcomp);
				this.elems.push(newcomp);
				this.lastcomp = newcomp;
				}
				
				
			}
		}
		
		if (ele.type == "output")
		{
			//An output
			content += `
				<line class="st0" x1="-0.5" y1="50" x2="30" y2="50"/>		
				<line class="st0" x1="71" y1="50" x2="100" y2="50"/>		
				<path class="st0" d="M44.19,63.88C36.35,63.88,30,57.53,30,49.69S36.35,35.5,44.19,35.5"/>
				<path class="st0" d="M57,63.88c7.84,0,14.19-6.35,14.19-14.19S64.84,35.5,57,35.5"/>`;
				
			var newcomp = {"type": "out", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;			
				
		}
				
		if (ele.type == "latch")
		{
			//A latching operation	
			content += `
				<line class="st0" x1="-0.5" y1="50" x2="30" y2="50"/>		
				<line class="st0" x1="71" y1="50" x2="100" y2="50"/>		
				<path class="st0" d="M44.19,63.88C36.35,63.88,30,57.53,30,49.69S36.35,35.5,44.19,35.5"/>
				<path class="st0" d="M57,63.88c7.84,0,14.19-6.35,14.19-14.19S64.84,35.5,57,35.5"/>`;
			content += '<text x="50" y="55" text-anchor="middle" font-size="20" font-weight="bold">S</text>';
			
			var newcomp = {"type": "out_latch", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;					
		}
		if (ele.type == "unlatch")
		{
			//An unlatch operation
			content += `
				<line class="st0" x1="-0.5" y1="50" x2="30" y2="50"/>		
				<line class="st0" x1="71" y1="50" x2="100" y2="50"/>		
				<path class="st0" d="M44.19,63.88C36.35,63.88,30,57.53,30,49.69S36.35,35.5,44.19,35.5"/>
				<path class="st0" d="M57,63.88c7.84,0,14.19-6.35,14.19-14.19S64.84,35.5,57,35.5"/>`;
			content += '<text x="50" y="55" text-anchor="middle" font-size="20" font-weight="bold">R</text>';
			
			var newcomp = {"type": "out_unlatch", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;
			//outputs.push({"name": ele.name,"value": 0});
				
		}
		if (ele.type == "on-delay")
		{
			//An on-delay timer
			content += `
		<line class="st0" x1="-0.5" y1="50" x2="8.44" y2="50"/>
		<line class="st0" x1="91.06" y1="50" x2="100" y2="50"/>
		<rect x="8.44" y="4.67" class="st0" width="82.61" height="91.33"/>`;
			foffset += 10;
				
			content += '<text x="50" y="50" text-anchor="middle" font-size="' + fsize + '">ON Delay</text>';
			if (ele.duration != undefined) 
			{
				var dur = ele.duration;
				if (ele.units != undefined)
					dur += " " + ele.units;
				
				content += '<text x="50" y="80" text-anchor="middle" font-size="' + fsize + '">' + dur + '</text>';
			}
			
			var thresh = ele.duration;
			var newcomp = {"type": "timer", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name, "threshold": thresh, "style": "on"};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;			
				
		}	
		if (ele.type == "off-delay")
		{
			//An off-delay timer
			content += `
		<line class="st0" x1="-0.5" y1="50" x2="8.44" y2="50"/>
		<line class="st0" x1="91.06" y1="50" x2="100" y2="50"/>
		<rect x="8.44" y="4.67" class="st0" width="82.61" height="91.33"/>`;
			foffset += 10;
				
			content += '<text x="50" y="50" text-anchor="middle" font-size="' + fsize + '">OFF Delay</text>';
			if (ele.duration != undefined) 
			{
				var dur = ele.duration;
				if (ele.units != undefined)
					dur += " " + ele.units;
				
				content += '<text x="50" y="80" text-anchor="middle" font-size="' + fsize + '">' + dur + '</text>';
			}
			
			var thresh = ele.duration;
			var newcomp = {"type": "timer", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name, "threshold": thresh, "style": "off"};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;
				
		}
		if (ele.type == "timer")
		{
			//Input from a timer
			content += `
		<line class="st0" x1="-0.5" y1="50" x2="8.44" y2="50"/>
		<line class="st0" x1="91.06" y1="50" x2="100" y2="50"/>
		<rect x="8.44" y="4.67" class="st0" width="82.61" height="91.33"/>`;
			foffset += 10;

			var thresh = ele.duration;
			var newcomp = {"type": "timer", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name, "threshold": thresh};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;
		}
		
		if (ele.type == "counter")
		{
			//Increment a Counter
			content += `
		<line class="st0" x1="-0.5" y1="50" x2="8.44" y2="50"/>
		<line class="st0" x1="91.06" y1="50" x2="100" y2="50"/>
		<rect x="8.44" y="4.67" class="st0" width="82.61" height="91.33"/>`;
			foffset += 10;
				
			if (ele.action != undefined) content += '<text x="50" y="80" text-anchor="middle" font-size="' + fsize + '">' + ele.action + '</text>';
			
			var newcomp = {"type": "counter", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;
				
		}
		if (ele.type == "analog")
		{
			//An analog comparator
			content += `
		<line class="st0" x1="-0.5" y1="50" x2="8.44" y2="50"/>
		<line class="st0" x1="91.06" y1="50" x2="100" y2="50"/>
		<rect x="8.44" y="4.67" class="st0" width="82.61" height="91.33"/>`;
			foffset += 10;
		
			if (ele.type != undefined) content += '<text x="50" y="35" text-anchor="middle" font-size="' + fsize + '">' + ele.type + '</text>';
			if (ele.comparison != undefined) content += '<text x="50" y="65" text-anchor="middle" font-size="' + fsize + '">' + ele.comparison + '</text>';
			if (ele.value != undefined) content += '<text x="50" y="80" text-anchor="middle" font-size="' + fsize + '">' + ele.value + '</text>';
			
			var newcomp = {"type": "analog", "prev": this.lastcomp, "x": x, "y": y, "name": ele.name};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;
				
		}
		if (ele.name != undefined)
		{
			content += '<text x="50" y="' + (15 + foffset) + '" text-anchor="middle" font-size="' + fsize + '">' + ele.name + '</text>';
		}
		if (ele.type == "straight")
		{
			//An empty (straight) line
			content += `<line class="st0" x1="-0.5" y1="50" x2="100" y2="50"/>`;
			
			var newcomp = {"type": "straight", "x": x, "y": y};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;
		}
		if (ele.type == "or")
		{
			//Combines this rung with the previous one.
			content += '<polyline class="st0" points="0,50 10,50 10,-50	"/>'		
			
			var newcomp = {"type": "or", "x": x, "y": y};
			if (this.lastcomp != null) 
				this.lastcomp['next'] = newcomp;
			else
				this.startcomps.push(newcomp);
			this.elems.push(newcomp);
			this.lastcomp = newcomp;
			
			//Copy the above comps...
			var nx = null;
			var newy = y-1;
			for(var i=0;i<this.elems.length;i++)
			{
				if (this.elems[i].x == x)
				{
					if (this.elems[i].y == newy)
					{
						if (this.elems[i].type == 'or')
						{
							i = 0;
							newy--;
							if (newy < 0) break;
						}
						else
						{
							newcomp.next = this.elems[i];
							break;
						}
					}
				}
			}
			
		}
		content += '</g>';
		return content;
	}

	//Parse JSON into a grid
	parse(jsn,selector) {
		var tg = document.querySelector(selector);
			
		//Prepare the variables
		var xpos = 0;
		var ypos = 0;
		var obpos = {};
		this.grid = [];
		this.lastpoint = this.width - 1;
		this.lowestpoint = jsn.length * 100;
		
		//Create the grid
		for(var rng=0;rng < jsn.length;rng++)
		{
			var ln = [];
			for(var x=0;x<this.width;x++)
			{
				ln.push(null);
			}
			this.grid.push(ln);
		}

		//Initialise the SVG
		var content = "";
		
		//Create the main items in the grid
		for(var rng = 0;rng<jsn.length;rng++)
		{		
			var rung = jsn[rng];
			
			if ((rung.output != undefined) && (!Array.isArray(rung.output))) rung.output = [rung.output];
			if (!Array.isArray(rung.input)) rung.input = [rung.input];
			var xpos = 0;
			
			//Add each input
			for(var i=0;i<rung.input.length;i++)
			{
				this.grid[ypos][xpos] = rung.input[i];
				xpos++;
			}
			xpos = 5;		
			
			//If there are any outputs defined, add them here.
			if (rung.output != undefined)
			{
				for(var i=0;i<rung.output.length;i++)
				{
					if ((rung.output[i].type == "coil") || (rung.output[i].type == "latch")) {
						if (rung.output[i].latch != undefined)
						{
							if (rung.output[i].latch == "off")
								rung.output[i].type = "unlatch";
							else
								rung.output[i].type = "latch";
						}
						if (rung.output[i].state != undefined)
						{
							if (rung.output[i].state == "off")
								rung.output[i].type = "unlatch";
						}
					}
					
					var found = false;
					for(var x=0;x<jsn.length;x++)
					{
						if (this.grid[x][this.width-1] != null)
						{
							if ((this.grid[x][this.width-1].name == rung.output[i].name) && (this.grid[x][this.width-1].type == rung.output[i].type))
							{
								found = true;
								break;
							}
						}
					}
					if (found == false)
					{
						if (rung.output[i].type == "coil") 
						{
							if (rung.output[i].latch != undefined)
							{
								rung.output[i].type = "latch";																								
							}
							else
							{
								if (rung.output[i].unlatch != undefined)
									rung.output[i].type = "unlatch";
								else
									rung.output[i].type = "output";
							}
						}
						this.grid[ypos][xpos] = rung.output[i];
					}			
				}
			}
			
			//In some cases, other parts of the run are specified without 'outputs' or 'inputs' - they'll be checked for here.
			var outset = [];
			Object.keys(rung).forEach(function(key,index) {
				if ((key != "input") && (key != "output"))
				{
					var ob = rung[key];
					if (ob['type'] == undefined) ob['type'] = key;
					outset.push(ob);
				}
			});
			if (outset.length > 0)
			{
				for(var q=this.width-1;q>=0;q--)
				{
					if (this.grid[rng][q] == null)
					{
						this.grid[rng][q] = outset.pop();
						if (outset.length == 0) break;
					}
				}
			}
			
			ypos++;		
		}
		
		//Fill in the straight gaps for all items.
		for(var rng = 0;rng<jsn.length;rng++)
		{		
			if (this.grid[rng][0] != null)
			{
				for(var x=1;x<this.width;x++)
				{
					if (this.grid[rng][x] == null)
					{
						this.grid[rng][x] = {"type": "straight"};
					}			
				}
			}				
		}
		
		//Remove duplicate outputs...
		var prevname = null;
		var prevtype = null;
		for(var rng = 0;rng<jsn.length;rng++)
		{		
			if (this.grid[rng][this.lastpoint] != null)
			{			
				if (this.grid[rng][this.lastpoint].type == "straight")
				{
					this.grid[rng][this.lastpoint] = {"type": "or"};
				}
				else
				{
					if ((this.grid[rng][this.lastpoint].name == prevname) && (this.grid[rng][this.lastpoint].type == prevtype))
					{
						this.grid[rng][this.lastpoint] = {"type": "or"};
					}
					else
					{
						prevname = this.grid[rng][this.lastpoint].name;
						prevtype = this.grid[rng][this.lastpoint].type;
					}
				}
			}						
		}
		
		//Draw each of the items
		for(var rng = 0;rng<jsn.length;rng++)
		{	
			this.lastcomp = null;
			for(var x=0;x<this.width;x++)
			{				
				if (this.grid[rng][x] != null)
				{
					content += this.drawElement(this.grid[rng][x],x,rng);
				}			
			}				
		}

		//Draw the vertical lines on the left and right of the image.
		content += '<line x1="' + (this.width * 100) + '" y1="30" y2="' + (this.lowestpoint-30) + '" x2="' + (this.width * 100) + '" stroke="black" stroke-width="3"/>';
		content += '<line x1="2" y1="30" y2="' + (this.lowestpoint-30) + '" x2="2" stroke="red" stroke-width="3"/>';
				
		tg.innerHTML = content;
		
		//Find the unique components (ie. named items) in the elements
		for(x=0;x<this.elems.length;x++)
		{
			if (this.elems[x].name == undefined) continue;
			
			var nm = this.elems[x].name;
			if (this.components[nm] == undefined)
			{
				this.components[nm] = {};
				this.components[nm]['type'] = this.elems[x].type;
				if (this.elems[x]['style'] != undefined) 
					this.components[nm]['style'] = this.elems[x].style;
				if (this.elems[x]['threshold'] != undefined) 
					this.components[nm]['threshold'] = this.elems[x].threshold;
			}
			this.elems[x].master = this.components[nm];

			//Set the value of all items to '0' to initialise them
			this.SetCoilInactive(nm);
		}

		//Simulate the logic
		this.UpdateLogic();
	}
	
	//Simulation - set an input coil active
	SetCoilActive(nm) {
		if (this.components[nm] != undefined)
		{
			var pv = this.components[nm].value
			this.components[nm].value = 1;			
			this.components[nm].pvalue = pv;
		}
	}

	//Simulation - set an input coil inactive
	SetCoilInactive(nm) {
		if (this.components[nm] != undefined)
		{
			var pv = this.components[nm].value
			this.components[nm].value = 0;			
			this.components[nm].pvalue = pv;
		}
	}
	
	//Process the logic
	UpdateLogic() {
		var toprocess = [];
		
		//Reset all elements
		Object.keys(ll.components).forEach(function(key,index) {			
			if (ll.components[key].type == "timer")
				ll.components[key].active = 0;			
			if (ll.components[key].type == "out")
			{
				ll.components[key].value = 0;			
			}
		});
		
		//Prepare a queue of all of the operations to commit after processing the logic.
		var WriteQueue = [];
		
		//For each rung (starting from the first element)...
		for(var q=0;q<this.startcomps.length;q++)
		{
			//Each rung begins active
			var active = true;

			//Add the first element of the rung to the list.
			toprocess.push(this.startcomps[q]);
			
			//For each element...
			while(toprocess.length > 0)
			{
				var hit = false;
				var proc = toprocess.pop();				
				
				if (proc.type == "no")
				{
					//Normally Open
					if (proc.master.value == 0)
					{
						if ((proc.master.latched == undefined) || (proc.master.latched == 0))
						{
							active = false;
						}						
					}
					else
						hit = 1;
				}
				if (proc.type == "nc")
				{
					//Normally Closed
					if (proc.master.value == 1)					
					{
						if ((proc.master.latched == undefined) || (proc.master.latched == 1))
						{
							active = false;
						}						
					}		
					else
						hit = 1;
				}				
				if (proc.type == "analog")
				{
					//Analog Comparisons
					if (proc.master.value == 0)																
						active = false;
				}
				if (proc.type == "pedge")
				{
					//Positive Edge
					if ((proc.master.value == 1) && (proc.master.pvalue == 0))
						active = true;						
					else
						active = false;					
				}
				if (proc.type == "nedge")
				{
					//Negative Edge
					if ((proc.master.value == 0) && (proc.master.pvalue == 1))
						active = true;						
					else
						active = false;					
				}				
				
				if (proc.type == "timer")
				{
					//TImer
					
					if (proc.x == this.lastpoint)
					{
						//This is used if you're WRITING to the timer.
						if (active == true)
						{
							proc.master.value += 0.5;
							proc.master.active = true;
						}
						else
							proc.master.value = 0;
					}
					
					if (proc.x < 5)
					{
						//This is used if you're READING from the timer.
						if (active == true)
						{
							active = false;
							if (proc.master.active == true)
							{
								if (proc.master.value > proc.master.threshold)	
								{	
									if (proc.master.style == "on")		
									{	
										hit = true;
										active = true;										
									}
								}
								else
								{
									if (proc.master.style == "off")							
									{
										hit = true;
										active = true;										
									}
								}
							}
						}
					}
					
					//Is this active?
					if (proc.master.value > proc.master.threshold)	
					{							
						if (proc.master.style == "off")							
							active = false;										
						else
							hit = true;
					}
					else
					{
						//If the trigger is active, highlight it.
						if (proc.master.style == "on")							
							active = false;		
						else
							hit = true;
					}
					
				}
				
				if (proc.type == "counter")
				{
					//Increment a counter					
					if (proc.x < 5)
					{
						if (active == true)
						{
							proc.master.value += 1;
							proc.master.active = true;
						}						
					}										
				}
				
				if (proc.type == "counter_reset")
				{					
					//Reset a counter
					if (active == true)
					{
						proc.master.value = 0;
						proc.master.active = true;
					}										
				}
				
				if (proc.type == "out")
				{
					//Write an output
					if (active == true)
					{
						//proc.master.value = 1;						
						WriteQueue.push([proc.master,"value",1]);
						hit = true;
					}
					else
					{
						if (proc.master.value == 1)
						{
							active = true;							
						}
					}
					if (proc.master.value == 1)
						hit = true;
				}
				
				if (proc.type == "out_latch")
				{					
					//Latch an output
					if (active == true)
					{
						WriteQueue.push([proc.master,"value",1]);
						WriteQueue.push([proc.master,"latched",1]);
						hit = true;
						//proc.master.latched = 1;
					}					
				}
				
				if (proc.type == "out_unlatch")
				{
					//Unlatch an output
					if (active == true)
					{		
						WriteQueue.push([proc.master,"latched",0]);										
						hit = true;
					}					
				}
				
				if (proc.next != undefined)
					toprocess.push(proc.next);
						
				if ((active == false) && (hit == false))
				{		
					//Remove highlighting from the SVG.
					var pieces = document.querySelectorAll(".xp" + proc.x + ".yp" + proc.y + " .at0");
					for(var e=0;e<pieces.length;e++)
					{
						pieces[e].setAttribute("class","st0");
					}					
				}
				else
				{
					//Highlight the SVG.
					var pieces = document.querySelectorAll(".xp" + proc.x + ".yp" + proc.y + " .st0");
					for(var e=0;e<pieces.length;e++)
					{
						pieces[e].setAttribute("class","at0");
					}

				}
			}
		}
		
		//Write all delayed actions
		for(var q=0;q<WriteQueue.length;q++)
		{
			if ((WriteQueue[q][1] == "value") || (WriteQueue[q][1] == "latched"))			
				WriteQueue[q][0].value = WriteQueue[q][2];			
			if (WriteQueue[q][1] == "latched")
				WriteQueue[q][0].latched = WriteQueue[q][2];
		}

		//Perform some end-of-cycle maintenance
		Object.keys(ll.components).forEach(function(key,index) {			
			//Record previous output value for edge detection
			if ((ll.components[key].type == "no") || (ll.components[key].type == "nc") || (ll.components[key].type == "nedge") || (ll.components[key].type == "pedge"))
				ll.components[key].pvalue = ll.components[key].value;
			
			//Highlight any outputs in interactive mode
			if ((ll.components[key].type == "out") || (ll.components[key].type == "out_latch"))
			{				
				var items = document.querySelectorAll('.ind_' + ll.components[key].cxid);
				for(var x=0;x<items.length;x++)
				{
					if (ll.components[key].value == 1)
						items[x].setAttribute("fill","red");
					else
						items[x].setAttribute("fill","silver");
				}								
			}					
		});
	}
	
	//Make an SVG file interactive by adding controls and starting a timer.
	makeInteractive(speed = 500) {
		var ctrls = "";
		var cxid = 0;
		//Add Inputs
		Object.keys(ll.components).forEach(function(key,index) {
			if ((ll.components[key].type == "no") || (ll.components[key].type == "nc") ||  (ll.components[key].type == "analog") ||  (ll.components[key].type == "pedge") ||  (ll.components[key].type == "nedge"))
			{
				ctrls += '<rect x="0" y="' + (this.lowestpoint + (cxid * 30)) + '" width="100" height="30" fill="silver" link="' + key + '" cx="' + cxid + '" class="trigger cx' + cxid + '"/>';
				ctrls += '<text x="50" y="' + ((this.lowestpoint + 18) + (cxid * 30)) + '" text-anchor="middle" pointer-events="none" font-size="12" >' + key + '</text>';
				cxid++;
			}			
		}.bind(this));

		//Add Outputs
		var cxid = 0;
		var loffset = (this.width-1) * 100;
		Object.keys(ll.components).forEach(function(key,index) {			
			if ((ll.components[key].type == "out") || (ll.components[key].type == "out_latch"))
			{
				if (ll.components[key].cxid == undefined)
				{
					ll.components[key].cxid = cxid;
				}
				ctrls += '<rect x="' + loffset + '" y="' + (this.lowestpoint + (cxid * 30)) + '" width="100" height="30" fill="silver" link="' + key + '" cx="' + cxid + '" class="indicator ind_' + cxid  + '"/>';
				ctrls += '<text x="' + (loffset + 50) + '" y="' + ((this.lowestpoint + 18) + (cxid * 30)) + '" text-anchor="middle" pointer-events="none" font-size="12" >' + key + '</text>';
				cxid++;
			}			
		}.bind(this));

		//Add the controls to the SVG
		var nw = document.querySelector('#diagram').innerHTML + ctrls;
		document.querySelector('#diagram').innerHTML = nw;

		//Start the update timer for the system
		window.setInterval(function() {
			ll.UpdateLogic();
		},speed);

		//Add event listeners for input controls.
		var items = document.querySelectorAll('#diagram .trigger');
		for(var q=0;q<items.length;q++)
		{
			items[q].addEventListener('mousedown',function (d) {
				var nm = d.currentTarget.getAttribute("link");
				var cx = d.currentTarget.getAttribute("cx");
				document.querySelector(".trigger.cx" + cx).setAttribute("fill","red");
				ll.SetCoilActive(nm);	
			});
			
			items[q].addEventListener('mouseup',function (d) {
				var nm = d.currentTarget.getAttribute("link");
				var cx = d.currentTarget.getAttribute("cx");
				document.querySelector(".trigger.cx" + cx).setAttribute("fill","silver");
				ll.SetCoilInactive(nm);	
			});
		}
	}
}

