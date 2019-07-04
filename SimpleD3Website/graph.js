// JavaScript Document
// 下面为使用d3绘图的过程

var g_searchBoxIndex = 0; // 0代表起点框，1代表终点框

// 连通支绘图
function gb_graph_connected_component() {
	// 重置画图区域内的图形
	document.getElementById("graph_area").innerHTML = "";
	var width = innerWidth;
	var height = innerHeight * 1.1;
	var cc_data_trans = gb_dataTransform(cc_data, 0); // 让数据符合d3规范

	var pack = d3.layout.pack()
		.size([width, height])
		.radius(5);

	var zoom = d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", function zoomed() {
		g.attr("transform",
			"translate(" + zoom.translate() + ")"
			+ "scale(" + zoom.scale() + ")"
		);
	});

	var nodes = pack.nodes(cc_data_trans);

	var svg = d3.select("#graph_area").append("svg")
		.attr("width", width)
		.attr("height", height);

	var g = svg.append("g")
		.attr("transform", "translate(400,200)scale(0.2)")
		.call(zoom)
		.append("g"); // 两个g层，前一个用于缩放平移，后一个用于添加圆形图

	let tip = d3.select("body")
		.append("div")
		.style('position', 'absolute')
		.style('z-index', '10')
		.style('color', 'black')
		.style('visibility', 'hidden') // 是否可见（一开始设置为隐藏）
		.style('font-size', '10px')
		.style('font-weight', 'bold')
		.style("float", "left")
		.text('');

	g.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		.attr("fill", "rgb(31, 119, 180)")
		.attr("fill-opacity", "0.4")
		.attr("cx", function (d) {
			return d.x;
		})
		.attr("cy", function (d) {
			return d.y;
		})
		.attr("r", function (d) {
			return d.r;
		})
		.on("mouseover", function (d, i) {
			if (d3.select(this).attr("fill") != "rgb(255,0,0)") {
				d3.select(this)
					.attr("fill", "yellow");
			}
			tip.style('visibility', 'visible').text(gb_indexToName(parseInt(d.name)))
				.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px')
		})
		.on("mouseout", function (d, i) {
			if (d3.select(this).attr("fill") != "rgb(255,0,0)") {
				d3.select(this)
					.attr("fill", "rgb(31, 119, 180)");
			}
			tip.style('visibility', 'hidden');
		})
		.on("click", function (d) {
			d3.selectAll("circle").attr("fill", "rgb(31, 119, 180)"); // reset the color
			d3.select(this).attr("fill", "rgb(255,0,0)");
			gb_defaultSetSearchContent(d.name);
		});

}

// 最小生成树绘图
function gb_graph_spanning_tree() {
	// 重置画图区域内的图形
	document.getElementById("graph_area").innerHTML = "";
	var width = "100%";
	var height = "100%";
	var st_data_trans = gb_dataTransform(st_data, 1); // 让数据符合d3规范

	var zoom = d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", function zoomed() {
		g.attr("transform",
			"translate(" + zoom.translate() + ")"
			+ "scale(" + zoom.scale() + ")"
		);
	});

	var svg = d3.select("#graph_area").append("svg")
		.attr("width", width)
		.attr("height", height);

	var g = svg.append("g")
		.attr("transform", "translate(550,300)scale(0.2)")
		.call(zoom)
		.append("g"); // 两个g层，前一个用于缩放平移，后一个用于添加圆形图

	let tip = d3.select("body")
		.append("div")
		.style('position', 'absolute')
		.style('z-index', '10')
		.style('color', 'black')
		.style('visibility', 'hidden') // 是否可见（一开始设置为隐藏）
		.style('font-size', '10px')
		.style('font-weight', 'bold')
		.style("float", "left")
		.text('');

	var circles = g.selectAll("circle")
		.data(st_data_trans.nodes)
		.enter()
		.append("circle")
		.attr("fill", "rgb(31,119,180)")
		.attr("fill-opacity", "0.4")
		.attr("cx", function (d, i) { //圆心坐标从左向右依次递增，注意：i表示引入数据在数组的下标，如：d=5,i=0
			return gb_circleCenterX(i);
		})
		.attr("cy", function (d, i) {
			return gb_circleCenterY(i);
		})
		.attr("r", 22)
		.on("mouseover", function (d, i) {
			if (d3.select(this).attr("fill") != "rgb(255,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,255,0)") {
				d3.select(this)
					.attr("fill", "yellow");
			}
			// 标签
			tip.style('visibility', 'visible').text(gb_indexToName(parseInt(d.name)))
				.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px')
			// 线
			var indexnum = i;
			d3.selectAll("line")
				.each(function (d, i) {
					if (d3.select(this).attr("s") == String(indexnum)
						|| d3.select(this).attr("d") == String(indexnum)
					   || d3.select(this).attr("keyline") == "1") {
						d3.select(this).style("visibility", "visible");
					}
				})
		})
		.on("mouseout", function (d, i) {
			if (d3.select(this).attr("fill") != "rgb(255,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,255,0)") {
				d3.select(this)
					.attr("fill", "rgb(31,119,180)");
			}
			// 标签
			tip.style('visibility', 'hidden');
			//线
			if (d3.select(this).attr("fill") != "rgb(255,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,255,0)") {
				d3.selectAll("line").filter(function(){
					if (d3.select(this).attr("keyline") == "0")
						return true;
					else return false;
				})
				.style("visibility", "hidden");
			}
		})
		.on("click", function (d,i) {
			d3.selectAll("circle").attr("fill", "rgb(31,119,180)"); // reset the color
			d3.select(this).attr("fill", "rgb(255,0,0)");
			// 线
			var indexnum = i;
			d3.selectAll("line").style("visibility","hidden")
				.attr("keyline","0");
			d3.selectAll("line")
				.each(function (d, i) {
					if (d3.select(this).attr("s") == String(indexnum)
						|| d3.select(this).attr("d") == String(indexnum)) {
						d3.select(this).style("visibility", "visible")
							.attr("keyline","1");
					}
				})
			gb_defaultSetSearchContent(d.name);
		});

	var lines = g.selectAll("line")
		.data(st_data_trans.links)
		.enter()
		.append("line")
		.attr("x1", function (d) {
			return gb_circleCenterX(d.source);
		})
		.attr("y1", function (d) {
			return gb_circleCenterY(d.source);
		})
		.attr("x2", function (d) {
			return gb_circleCenterX(d.target);
		})
		.attr("y2", function (d) {
			return gb_circleCenterY(d.target);
		})
		.attr("s", function (d) {
			return String(d.source)
		})
		.attr("d", function (d) {
			return String(d.target)
		})
		.attr("keyline","0")
		.attr("stroke", "black")
		.attr("stroke-width", "2px")
		.style("visibility", "hidden");
}

// Dijsktra算法绘图
function gb_graph_dijkstra() {
	// 重置画图区域内的图形
	document.getElementById("graph_area").innerHTML = "";
	var width = "100%";
	var height = "100%";
	var st_data_trans = gb_dataTransform(st_data, 1); // 让数据符合d3规范

	var zoom = d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", function zoomed() {
		g.attr("transform",
			"translate(" + zoom.translate() + ")"
			+ "scale(" + zoom.scale() + ")"
		);
	});

	var svg = d3.select("#graph_area").append("svg")
		.attr("width", width)
		.attr("height", height);

	var g = svg.append("g")
		.attr("transform", "translate(550,300)scale(0.2)")
		.call(zoom)
		.append("g"); // 两个g层，前一个用于缩放平移，后一个用于添加圆形图

	let tip = d3.select("body")
		.append("div")
		.style('position', 'absolute')
		.style('z-index', '10')
		.style('color', 'black')
		.style('visibility', 'hidden') // 是否可见（一开始设置为隐藏）
		.style('font-size', '10px')
		.style('font-weight', 'bold')
		.style("float", "left")
		.text('');

	var circles = g.selectAll("circle")
		.data(st_data_trans.nodes)
		.enter()
		.append("circle")
		.attr("fill", "rgb(31,119,180)")
		.attr("fill-opacity", "0.4")
		.attr("cx", function (d, i) { //圆心坐标从左向右依次递增，注意：i表示引入数据在数组的下标，如：d=5,i=0
			return gb_circleCenterX(i);
		})
		.attr("cy", function (d, i) {
			return gb_circleCenterY(i);
		})
		.attr("r", 22)
		.on("mouseover", function (d, i) {
			if (d3.select(this).attr("fill") != "rgb(255,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,255,0)") {
				d3.select(this)
					.attr("fill", "yellow");
			}
			// 标签
			tip.style('visibility', 'visible').text(gb_indexToName(parseInt(d.name)))
				.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px')
		})
		.on("mouseout", function (d, i) {
			if (d3.select(this).attr("fill") != "rgb(255,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,0,0)"
			   && d3.select(this).attr("fill") != "rgb(0,255,0)") {
				d3.select(this)
					.attr("fill", "rgb(31,119,180)");
			}
			// 标签
			tip.style("visibility", "hidden");
		})
		.on("click", function (d,i) {
			d3.selectAll("circle").attr("fill", "rgb(31,119,180)"); // reset the color
			d3.select(this).attr("fill", "rgb(255,0,0)");
			// 线
			d3.selectAll("line").remove();
			var indexnum = i;
			gb_defaultSetSearchContent(d.name);
		});
	
}

// json数据格式转换函数
function gb_dataTransform(data, c) {
	switch (c) {
		case 0:
			return _ccDataTransform(data);
			break;
		case 1:
			return _stDataTransform(data);
			break;
		case 2:

			break;
	}
}

function _ccDataTransform(data) {
	var circle0 = {
		"name": null,
		"children": []
	};
	for (var i = 0; i < data.nodes.length; i++) {
		var circle1 = {
			"name": null,
			"children": []
		}
		for (var j = 0; j < data.nodes[i].length; j++) {
			var circle2 = {
				"name": null
			};
			circle2.name = String(data.nodes[i][j]);
			circle1.children.push(circle2);
		}
		circle0.children.push(circle1);
	}
	return circle0;
}

function _stDataTransform(data) {
	var list0 = {
		"nodes": [],
		"links": []
	};
	for (let i = 0; i < mm_data.Moviepeople.length; i++) {
		let node = {
			"name": i,
		};
		list0.nodes.push(node);
	}
	for (let i = 0; i < st_data.Tree.length; i++) {
		let link = {
			"source": st_data.Tree[i][0],
			"target": st_data.Tree[i][1]
		};
		list0.links.push(link);
	}
	return list0;
}

// 自动设置被选中框中的内容
function gb_defaultSetSearchContent(str_name) {
	var input1 = document.getElementById("src_name");
	var input2 = document.getElementById("dest_name");
	if (input1.value == "undefined" || input1.value == null
		|| input1.value == "") {
		g_searchBoxIndex = 0;
	} else if (input2.value == "undefined" || input2.value == null
		|| input2.value == "") {
		g_searchBoxIndex = 1;
	}
	switch (g_searchBoxIndex) {
		case 0:
			input1.value = gb_indexToName(parseInt(str_name));
			g_searchBoxIndex = 1;
			break;
		case 1:
			input2.value = gb_indexToName(parseInt(str_name));
			g_searchBoxIndex = 0;
			break;
	}
}

function gb_indexToName(index) {
	if (index >= 0 && index < mm_data.Moviepeople.length) {
		return mm_data.Moviepeople[index].name;
	} else
		return null;
}

function gb_nameToIndex(name) {
	for (let i = 0; i < mm_data.Moviepeople.length; i++) {
		if (mm_data.Moviepeople[i].name == name) {
			return i;
		}
	}
	return -1;
}

// 返回电影数组
function gb_indexToMovie(index) {
	if (index >= 0 && index < mm_data.Moviepeople.length) {
		return mm_data.Moviepeople[index].Movie;
	} else
		return [];

}

// 返回第index个圆的圆心X坐标
function gb_circleCenterX(index) {
	var theta = index * 3;
	var r = 25 * Math.sqrt(theta);
	return parseInt(r * Math.cos(theta));
}

// 返回第index个圆的圆心Y坐标
function gb_circleCenterY(index) {
	var theta = index * 3;
	var r = 25 * Math.sqrt(theta);
	return parseInt(r * Math.sin(theta));
}

// 返回从下标为index1到index2的点之间的最小生成树路径
function _search_road_st(index1,index2){
	var arr_used = new Array(st_data.Tree.length);
	var arr_before = new Array(st_data.Tree.length);
	for (let i = 0;i < arr_used.length;i++){
		arr_used[i] = -1;
		arr_before[i] = -1;
	}	// 初始化数组，前一个数组用于标记边是否已入栈，后一个数组记录某点的上一个节点下标
	arr_before[index1] = index1;
	
	var isFind = false;
	var queue = [];
	queue.push(index1);
	
	while(queue.length >= 1 && !isFind){
		let t = queue.shift();
		for (let i = 0;i < st_data.Tree.length;i++){
			// 若此边已用过，则跳出此次循环
			if (arr_used[i] != -1){
				continue;
			}
			
			if (st_data.Tree[i][0] == t){
				let next = st_data.Tree[i][1];
				if (arr_before[next] != -1) continue;
				arr_used[i] = 1;
				arr_before[next] = t;
				queue.push(next);
				if (next == index2){ 
					isFind = true;
					break;
				}
			}
			else if (st_data.Tree[i][1] == t){
				let next = st_data.Tree[i][0];
				if (arr_before[next] != -1) continue;
				arr_used[i] = 1;
				arr_before[next] = t;
				queue.push(next);
				if (next == index2){ 
					isFind = true;
					break;
				}
			}

		}
	}
	
	var ans = [];
	if (arr_before[index2] != -1){
		ans.unshift(index2);
		let t = arr_before[index2];
		while(t != index1){
			ans.unshift(t);
			t = arr_before[t];
		}
		ans.unshift(index1);
	}
	return ans;
}
