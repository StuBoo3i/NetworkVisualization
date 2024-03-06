<template>
  <div class="background-image">
    <div class="svg-container" ref="svgContainer">
      <svg class="svg-content left">
        <g transform="translate(10, 10)"> <!-- 通过 translate 属性调整位置 -->
          <!-- 左侧节点信息 -->
          <foreignObject class="info-box left" width="200" height="210" font-size="15" font-style="normal" >
            <p>Node Info:</p>
            <p>Label: {{ selectedNode ? selectedNode.label : maxNode.label }}</p>
            <p>Value: {{ selectedNode ? parseFloat(selectedNode.value).toFixed(3) : parseFloat(maxNode.value).toFixed(3) }}</p>
            <p>Edge Info:</p>
            <p>Label: {{ selectedEdge ? selectedEdge.label : maxEdge.label }}</p>
            <p>Value: {{ selectedEdge ? parseFloat(selectedEdge.value).toFixed(3) : parseFloat(maxEdge.value).toFixed(3) }}</p>
          </foreignObject>
        </g>
      </svg>
    </div>
    <div class="command-line-container">
      <div class="chart-area">
        <!-- 在这里放置图表显示区域 -->
      </div>
      <div class="conversation-area">
        <!-- 在这里放置命令输入记录与系统回复的区域 -->
        <div class="conversation-log">
          <!-- 命令输入记录与系统回复 -->
          <p v-for="item of conversationLog">{{ item }}</p>
        </div>
        <div class="command-input">
          <!-- 命令输入行 -->
          <input type="text" class="transparent-input" placeholder="Input System Instructions ..." @keyup.enter="handleEnter">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background-image {
  background-image: url('../assets/chai/gteman.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.svg-container {
  position: relative;
  background-color: rgba(200, 200, 200, 0.7);
  width: 70%; /* 调整 SVG 容器宽度，使其不占满整个页面 */
  height: 100%;
  overflow: hidden; /* 隐藏 SVG 容器外部溢出内容 */
}

.svg-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.command-line-container {
  width: 30%; /* 调整命令行式交互区域容器的宽度 */
  height: 100%;
  background-color: rgba(244, 244, 244, 0.7); /* 背景颜色 */
  border-left: 5px solid; /* 添加左边框，以便与 SVG 区域分隔 */
  border-color: rgba(255, 255, 255, 0); /* 边框颜色 */
  padding: 20px; /* 添加内边距 */
  box-sizing: border-box; /* 让 padding 不影响容器的实际宽度 */
  display: flex; /* 使用 Flex 布局 */
  flex-direction: column; /* 垂直方向布局 */
}

.chart-area {
  height: 40%; /* 图表区域占 40% 的高度 */
  overflow: hidden; /* 隐藏内容溢出 */
  display: flex; /* 使用 Flex 布局 */
  justify-content: center; /* 在水平方向上居中 */
  align-items: center; /* 在垂直方向上居中 */
}

.conversation-area {
  display: flex; /* 使用 Flex 布局 */
  flex-direction: column; /* 垂直方向布局 */
  height: 60%; /* 命令记录区域占 60% 的高度 */
}

.conversation-log {
  font-family: "",math;
  font-weight: bold; /* 设置字体加粗 */
  color: #333;
  flex: 1; /* 将命令输入记录与系统回复的区域高度设置为剩余空间的一部分 */
  overflow-y: auto; /* 如果内容溢出，添加垂直滚动条 */
  font-size: 14px; /* 设置字体大小 */
  line-height: 0.4; /* 设置行高 */
  padding: 0px; /* 设置内边距 */
  margin: 0px 0; /* 设置外边距 */
}

.transparent-input {
  height: 30px; /* 设置输入框的高度 */
  border: none; /* 移除边框 */
  outline: none; /* 移除聚焦时的外边框 */
  background-color: rgba(244, 244, 244, 1); /* 设置背景为透明 */
  width: 100%; /* 使输入框宽度与容器等长 */
  padding: 0; /* 移除内边距 */
  margin: 0; /* 移除外边距 */
}

.info-box {
  font-family: "",math;
  font-weight: bold; /* 设置字体加粗 */
  color: #333;
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #999;
}

.left {
  margin-left:auto;
}

</style>

<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      selectedNode: null,
      selectedEdge: null,
      maxNode: { id: null, label: null, value: null },
      maxEdge: { source: { id: null }, target: { id: null }, label: null, value: null },
      nodesData: [],
      edgesData: [],
      chartImageSrc: '../assets/yixiang.jpg', // 图表区的图片路径
      conversationLog: [], // 命令记录数组
    };
  },

  methods: {
    handleEnter(event) {
      const command = event.target.value.trim();
      if (command === 'image-enlarge') {
        const chartArea = document.querySelector('.chart-area');
        console.log(chartArea);
        if (chartArea) {
          const imageUrl = chartArea.querySelector('img').src; // 获取图表区图片的路径
          // 创建新的标签页
          const newTab = window.open(imageUrl, '_blank');
          console.log(newTab);
        }
      } else if (command === 'clear') {
        this.clearConversationLog(); // 清空命令记录
        event.target.value = ''; // 清空输入框
      } else {
        this.addToConversation(command); // 将命令添加到记录中
        event.target.value = ''; // 清空输入框
        this.addToChart(); // 添加图片到图表区域
      }
    },

    clearConversationLog() {
      // 清空命令记录数组
      this.conversationLog = [];
    },
    addToConversation(command) {
      // 将输入内容追加到命令记录数组
      this.conversationLog.push(command);
    },
    addToChart() {
      // 获取图表区域
      const chartArea = document.querySelector('.chart-area');
      console.log(chartArea);
      // 删除所有已有的图片
      chartArea.innerHTML = '';

      // 创建并插入新的图片
      const newImage = document.createElement('img');
      newImage.src = 'src/assets/yixiang.jpg'; // 修改为你的图片路径
      newImage.style.maxWidth = '100%'; // 设置图片最大宽度为容器宽度
      newImage.style.maxHeight = '100%'; //
      newImage.style.width = 'auto'; //
      newImage.style.height = 'auto'; //
      console.log(newImage);
      chartArea.appendChild(newImage);
    }
  },
  mounted() {
    // 创建BA无标度网络
    const numNodes = 8; // 将节点数目改为10
    const nodes = d3.range(numNodes).map(i => ({ id: i, label: `Node ${i}`, value: getRandomNumber() }));
    for (let i = 0; i < numNodes - 1; i++) {
      this.nodesData.push([nodes[i].id,nodes[i].label,nodes[i].value]);
    }

    const links = [];
    const m0 = Math.floor(numNodes / 2);
    const m = m0 > 1 ? m0 : 2;

    for (let i = m; i < numNodes; i++) {
      const nodeIndices = Array.from({ length: m }, (_, j) => i - j - 1);
      for (const target of nodeIndices) {
        const value = getRandomNumber();
        const edge = { source: i, target, distance: 6, label: `Edge ${i}-${target}`, value };
        links.push(edge);
        this.edgesData.push([edge.label,edge.value]); // 存储边属性
      }
    }

    // 找出节点中属性最大的值
    const maxNodeValue = d3.max(nodes, d => d.value);
    // 找出具有最大值的节点
    const maxNode = nodes.find(node => node.value === maxNodeValue);
    // 更新maxNode
    this.maxNode = { id: maxNode.id, label: maxNode.label, value: maxNodeValue };

    // 找出边中属性最大的值
    const maxEdgeValue = d3.max(links, d => d.value);
    // 找出具有最大值的边
    const maxEdge = links.find(edge => edge.value === maxEdgeValue);
    // 更新maxEdge
    this.maxEdge = { source: { id: maxEdge.source }, target: { id: maxEdge.target }, label: maxEdge.label, value: maxEdgeValue };

    // 创建SVG容器
    const svgWidth = 900;
    const svgHeight = 740;
    const svg = d3.select(this.$refs.svgContainer)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .style('position', 'absolute')
        .style('left', '50%')
        .style('top', '50%')
        .style('transform', 'translate(-50%, -50%)');

    // 创建力导向布局
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.distance * 50)) // 将距离放大以便观察
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2));

    // 绘制链接
    const link = svg.selectAll('line')
        .data(links)
        .enter().append('line')
        .style('stroke', '#ffa')
        .style('stroke-width', d => Math.max(2, d.value * 4))
        .on('click', (event,d) => {
          showInfoLabel(event, d);
          // 将之前选中的边恢复颜色
          svg.selectAll('line')
              .transition()
              .duration(200)
              .style('stroke', '#ffa');
          // 设置当前选中的边
          this.selectedEdge = d;
          const currLabel = event.target.__data__.label;
          d3.select(event.currentTarget)
              .transition().duration(200)
              .style('stroke', '#0ff');
        });

    // 绘制节点
    const node = svg.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', d => getSize(d.value) * 8)
        .style('fill', d => d.id === this.maxNode.id ? 'green' : getColor(d.value))
        .style('stroke', d => d.id === this.maxNode.id ? '#8ff' : '#ffa') // 边框颜色
        .style('stroke-width', '2px') // 边框宽度
        .on('click', (event,d) => {
          showInfoLabel(event, d);
          // 将所有节点恢复颜色
          svg.selectAll('circle')
              .transition().duration(200)
              .style('fill', d => getColor(d.value))
              .style('stroke', '#ffa');
          // 设置当前选中的节点
          this.selectedNode = d;
          // 为当前选中的节点设置特殊颜色
          d3.select(event.currentTarget)
              .transition().duration(200)
              .style('fill', 'green')
              .style('stroke', '#8ff');
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    d3.select('body').on('click', () => {
      d3.select('.info-label').remove();
    });

    // 更新节点和链接位置
    simulation.on('tick', () => {
      link.attr('x1', d => Math.max(0, Math.min(svgWidth, d.source.x)))
          .attr('y1', d => Math.max(0, Math.min(svgHeight, d.source.y)))
          .attr('x2', d => Math.max(0, Math.min(svgWidth, d.target.x)))
          .attr('y2', d => Math.max(0, Math.min(svgHeight, d.target.y)));

      node.attr('cx', d => Math.max(0, Math.min(svgWidth, d.x)))
          .attr('cy', d => Math.max(0, Math.min(svgHeight, d.y)));


      // 在数据更新后调用标签数据改变动画
      this.$watch('selectedNode', updateLabels);
      this.$watch('selectedEdge', updateLabels);

    });
    // 标签数据改变时的动画
    let lastUpdateTime = 0; // 记录上次更新时间的时间戳

    // 点击节点或边时显示信息标签，并设置位置
    function showInfoLabel(event, data) {
      // 移除已有的信息标签
      d3.select('.info-label').remove();

      // 创建新的信息标签
      const infoLabel = d3.select('body')
          .append('div')
          .classed('info-label', true)
          .text(`Label: ${data.label}, Value: ${parseFloat(data.value).toFixed(3)}`);

      // 设置信息标签位置
      const offsetX = 10; // X轴偏移量
      const offsetY = 10; // Y轴偏移量
      infoLabel.style('left', `${event.pageX + offsetX}px`)
          .style('top', `${event.pageY + offsetY}px`);
    }

    function updateLabels(type) {
      const currentTime = Date.now(); // 获取当前时间戳

      // 检查当前时间与上次更新时间的间隔是否超过一秒
      if (currentTime - lastUpdateTime >= 1000) {
        const infoBoxes = d3.selectAll('.info-box');

        // 根据参数 type 决定更新哪些标签
        if (type === 'node') {
          infoBoxes.select('p:nth-child(2)')
              .transition()
              .duration(50) // 过渡持续时间
              .style('color', 'red') // 设置颜色为红色
              .transition() // 添加另一个过渡
              .duration(800) // 过渡持续时间
              .style('color', '#333'); // 设置颜色为原来的颜色

          infoBoxes.select('p:nth-child(3)')
              .transition()
              .duration(50) // 过渡持续时间
              .style('color', 'red') // 设置颜色为红色
              .transition() // 添加另一个过渡
              .duration(800) // 过渡持续时间
              .style('color', '#333'); // 设置颜色为原来的颜色
        } else if (type === 'edge') {
          infoBoxes.select('p:nth-child(5)')
              .transition()
              .duration(50) // 过渡持续时间
              .style('color', 'red') // 设置颜色为红色
              .transition() // 添加另一个过渡
              .duration(800) // 过渡持续时间
              .style('color', '#333'); // 设置颜色为原来的颜色

          infoBoxes.select('p:nth-child(6)')
              .transition()
              .duration(50) // 过渡持续时间
              .style('color', 'red') // 设置颜色为红色
              .transition() // 添加另一个过渡
              .duration(800) // 过渡持续时间
              .style('color', '#333'); // 设置颜色为原来的颜色
        }

        lastUpdateTime = currentTime; // 更新上次更新时间的时间戳
      }
    }

// 监听 selectedNode 的变化
    this.$watch('selectedNode', () => {
      updateLabels('node'); // 更新节点标签
    });

// 监听 selectedEdge 的变化
    this.$watch('selectedEdge', () => {
      updateLabels('edge'); // 更新边标签
    });


    function getSize(value) {
      return d3.scaleLinear()
          .domain([0, 1])
          .range([1, 2])(value);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }


    function getColor(value) {
      return d3.interpolateReds(value);
    }

    function getRandomNumber() {
      // 获取一个0到9999之间的整数
      var randomInteger = Math.floor(Math.random() * 10000);
      // 将整数除以10000，保留小数点后四位
      var randomNumber = randomInteger / 10000;
      return randomNumber;
    }

  }
};
</script>
