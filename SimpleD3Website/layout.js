// JavaScript Document
// 下面为nav导航栏的响应函数
var g_selectedNavIndex = -1;	// 下次点击图像时选择的搜索框
var g_searchTime = 0;	// 该功能使用“查询”的次数

function gb_nav_onAClick(index) {
	gb_allNavInit(); // 重置所有的类
	g_selectedNavIndex = -1;
	document.getElementById("result_area").value = null; // 清空查询框中内容
	document.getElementById("src_name").value = null;
	document.getElementById("dest_name").value = null;
	g_selectedNavIndex = index;
	var str_obj_id = "nav_a_" + String(index);
	var nav_a_obj = document.getElementById(str_obj_id);
	nav_a_obj.className = "nav_a_selected";
	switch (index) {
		case 0:
			gb_graph_connected_component();
			break;
		case 1:
			gb_graph_spanning_tree();
			break;
		case 2:
			gb_graph_dijkstra();
			break;
			/* TODO：补充剩余的情况 */
	}
}

function gb_allNavInit() {
	var alist = document.getElementById("nav_area").getElementsByTagName("a");
	for (var i = 0; i < alist.length; i++) {
		alist[i].className = "nav_a_normal";
	}
}

function gb_btn_search() {
	switch (g_selectedNavIndex) {
		case 0:
			gb_search_cc();
			break;
		case 1:
			gb_search_st();
			break;
		case 2:
			gb_search_dij();
			break;
		default:

			break;
	}
}

function gb_search_cc() {
	var str1 = document.getElementById("src_name").value;
	var str2 = document.getElementById("dest_name").value;
	var element1 = gb_nameToIndex(str1);
	var element2 = gb_nameToIndex(str2);

	var index_tuple1 = [-1, -1];
	var index_tuple2 = [-1, -1];
	// 寻找第一个元素的下标二元组
	for (let i = 0; i < cc_data.nodes.length; i++) {
		let j;
		if ((j = cc_data.nodes[i].indexOf(element1)) != -1) {
			index_tuple1[0] = i;
			index_tuple1[1] = j;
			break;
		}
	}
	// 寻找第二个元素的下标二元组
	for (let i = 0; i < cc_data.nodes.length; i++) {
		let j;
		if ((j = cc_data.nodes[i].indexOf(element2)) != -1) {
			index_tuple2[0] = i;
			index_tuple2[1] = j;
			break;
		}
	}

	if (index_tuple1[0] == -1 || index_tuple2[0] == -1) {
		d3.select("#result_area").append("div")
			.text("查无此路径！");
	} else if (index_tuple1[0] == index_tuple2[0]) {
		let ans = str1 + "与" + str2
			+ "在同一连通支\n";
		document.getElementById("result_area").value += ans;
		d3.selectAll("circle")
			.attr("fill", "rgb(31, 119, 180)")
			.filter(function (d) {
				if (d.name == String(element1) || d.name == String(element2)) {
					return true;
				} else
					return false;
			})
			.attr("fill", "rgb(255,0,0)");
	} else {
		let ans = str1 + "与" + str2
			+ "不在同一连通支\n";
		document.getElementById("result_area").value += ans;
	}
}

function gb_search_st() {
	var str1 = document.getElementById("src_name").value;
	var str2 = document.getElementById("dest_name").value;
	var element1 = gb_nameToIndex(str1);
	var element2 = gb_nameToIndex(str2);

	var roadpath = _search_road_st(element1, element2);

	if (roadpath.length == 0) {
		let ans = "  " + str1 + "与" + str2
			+ "不在同一连通支\n";
		document.getElementById("result_area").value += ans;
	} else {
		// 设置字符串
		let ans = "  从" + str1 + "至" + str2 + "共" + String(roadpath.length) + "人，分别为：" + gb_indexToName(roadpath[0]);
		for (let i = 1; i < roadpath.length; i++) {
			ans += ("、" + gb_indexToName(roadpath[i]))
		}
		ans += '\n';
		document.getElementById("result_area").value += ans;

		gb_highlightPath_st(roadpath);
		/*
		d3.selectAll("circle").filter(function(d,i){
			return (roadpath.indexOf(d.name) != -1)
		})
		.attr("fill","rgb(255,0,0)");
		*/
	}
}

function gb_search_dij() {
	var str1 = document.getElementById("src_name").value;
	var str2 = document.getElementById("dest_name").value;
	var element1 = gb_nameToIndex(str1);
	var element2 = gb_nameToIndex(str2);

	var roadpath = gb_dijkstra(element1, element2);

	if (roadpath.length == 0) {
		let ans = "  " + str1 + "与" + str2
			+ "不在同一连通支\n";
		document.getElementById("result_area").value += ans;
	} else {
		// 设置字符串
		let ans = "  从" + str1 + "至" + str2 + "的最短路径共" + String(roadpath.length) + "人，分别为：" + gb_indexToName(roadpath[roadpath.length - 1]);
		for (let i = roadpath.length - 2; i >= 0; i--) {
			ans += ("、" + gb_indexToName(roadpath[i]))
		}
		ans += '\n';
		document.getElementById("result_area").value += ans;

		gb_highlightPath_dij(roadpath);
		/*
		d3.selectAll("circle").filter(function(d,i){
			return (roadpath.indexOf(d.name) != -1)
		})
		.attr("fill","rgb(255,0,0)");
		*/
	}
}

function gb_highlightPath_st(path) {
	if (path.length == 0) return;

	// 路径节点全染红
	d3.selectAll("circle").filter(function (d, i) {
			return (path.indexOf(d.name) != -1)
		})
		.attr("fill", "rgb(255,0,0)");

	// 首尾节点设为绿与黑色
	d3.selectAll("circle").filter(function (d, i) {
		return (path[0] == d.name);
	})
	.attr("fill","rgb(0,255,0)");
	d3.selectAll("circle").filter(function (d, i){
			return (path[path.length - 1] == d.name);
	})
	.attr("fill","rgb(0,0,0)");
	
	d3.selectAll("line")
		.filter(function(d){
		let t = path.indexOf(d.source);
		if (t == -1) return false;
		else{
			let t2 = path.indexOf(d.target);
			if (t2 != -1 && Math.abs(t - t2) == 1){
				return true;
			}
			else return false;
		}
	})
	.style("visibility","visible")
	.attr("keyline","1");
}

function gb_highlightPath_dij(path) {
	if (path.length == 0) return;

	// 路径节点全染红
	d3.selectAll("circle").filter(function (d, i) {
			return (path.indexOf(d.name) != -1)
		})
		.attr("fill", "rgb(255,0,0)");

	// 首尾节点设为绿与黑色
	d3.selectAll("circle").filter(function (d, i) {
		return (path[0] == d.name);
	})
	.attr("fill","rgb(0,0,0)");
	d3.selectAll("circle").filter(function (d, i){
			return (path[path.length - 1] == d.name);
	})
	.attr("fill","rgb(0,255,0)");
	
	// 删除原有线
	d3.selectAll("line").remove();
	
	// 增加新线
	var arr_temp = new Array(path.length - 1);
	for (let i = 0;i < arr_temp.length;i++){
		arr_temp[i] = 0;	
	}
	d3.select("svg").select("g").select("g").selectAll("line")
		.data(arr_temp)
		.enter()
		.append("line")
		.attr("x1", function (d, i) {
			return gb_circleCenterX(path[i]);
		})
		.attr("y1", function (d,i) {
			return gb_circleCenterY(path[i]);
		})
		.attr("x2", function (d,i) {
			return gb_circleCenterX(path[i + 1]);
		})
		.attr("y2", function (d,i) {
			return gb_circleCenterY(path[i + 1]);
		})
		.attr("s", function (d,i) {
			return String(path[i]);
		})
		.attr("d", function (d,i) {
			return String(path[i] + 1);
		})
		.attr("keyline","1")
		.attr("stroke", "black")
		.attr("stroke-width", "2px");
}
