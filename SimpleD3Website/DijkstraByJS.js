
// var dij_data.Road[0]=new Array(29932); // 正向表起点
// var dij_data.Road[1]=new Array(80000);// 正向表终点
// var dij_data.Road[2]=new Array(80000);// 终点对应边权

function gb_dijkstra(Vs,Ve)
{
	var v=29932;//节点个数
	var flag=new Array(v);//表示该节点是否被搜索过
	var r_min=new Array(v);//记录到该节点的最短路径长度
	var c=new Array(v);//记录当前节点的前序节点
	for(var i=0;i<v;i++)//初始化数组
	{
		flag[i]=false;
		r_min[i]=0x3f3f3f3f;
		c[i]=-1;
	}
	r_min[Vs]=0;
	
	var k=Vs;//记录当前节点
	var kp=Vs;//记录下一个搜索节点
	var minn=0x3f3f3f3f;//记录每次搜索中最短路的长度
	var mark_num=0;//搜索过的节点的个数
	var result=new Array();//最终的路径

	while(true)
	{
		//退出循环的条件
		if(mark_num==v) break;

		minn=0x3f3f3f3f;//初始化minn

		for(var i=dij_data.Road[0][k];i<dij_data.Road[0][k+1];i++)
		{
			if(r_min[k]+dij_data.Road[2][i]<r_min[dij_data.Road[1][i]])//如果更新的路径比原来的短
			{
				r_min[dij_data.Road[1][i]]=r_min[k]+dij_data.Road[2][i];//更新最短路程
				c[dij_data.Road[1][i]]=k;//更新前序节点
			}
		}
		flag[k]=true;
		mark_num++;
		for(var i=0;i<v;i++)
		{
			if(r_min[i]<minn&&flag[i]==0)
			{
				kp=i;//更新下一个节点
				minn=r_min[i];
			}
		}

		if(k!=kp)
			k=kp;
		else
		{
			for(var i=0;i<v;i++)
				if(flag[i]==0)
					k=i;
		}

	}//while语句结束
	//输出部分
	if(r_min[Ve]==0x3f3f3f3f)
	{
		return result;
	}
	else
	{
		var p=Ve;
		while(p!=Vs)
		{
			result.push(p);
			p=c[p];
		}
		result.push(Vs);
		return result;
	}//输出部分结束
	
}