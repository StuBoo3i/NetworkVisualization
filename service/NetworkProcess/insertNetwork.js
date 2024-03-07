import { createNode, createRelationship, closeConnection } from '../Database/database.js';

// 生成BA无标度网络
function generateBANetwork(nodeCount, mParameter) {
    const nodes = [];
    const edges = [];

    // 生成节点
    for (let i = 0; i < nodeCount; i++) {
        const label = `Node_${i}`;
        const edgeCount = Math.min(i + mParameter, nodeCount);
        const value = (0.5 + (edgeCount / nodeCount) * 0.5).toFixed(4); // 节点的value属性
        nodes.push({ label, value });

        // 生成边
        for (let j = i + 1; j < edgeCount; j++) {
            const label1 = `Node_${i}`;
            const label2 = `Node_${j}`;
            const label = `Edge${i}`+ '-' +`${j}`;
            const edgeValue = (Math.random() * 0.5 + 0.5).toFixed(4); // 边的value属性
            edges.push({ label1, label2, label, edgeValue });
        }
    }

    return { nodes, edges };
}

// 插入节点到数据库
async function insertNodesToDatabase(network) {
    try {
        // 插入节点
        for (const node of network.nodes) {
            const properties = {
                label: node.label,
                value: node.value
            };
            await createNode('Node', properties);
        }

        // 插入边
        for (const edge of network.edges) {
            const properties = {
                label1: edge.label1,
                label2: edge.label2,
                label: edge.label,
                value: edge.edgeValue,
            };
            await createRelationship(edge.label1, edge.label2, 'edge', properties);
        }


        console.log('Nodes and edges inserted successfully.');
    } catch (error) {
        console.error('Error inserting nodes and edges:', error);
        throw error; // 重新抛出错误以确保调用者能够捕获到错误
    } finally {
        await closeConnection();
    }
}

// 设置BA无标度网络参数
const nodeCount = 8;
const mParameter = 2;

// 生成BA无标度网络
const network = generateBANetwork(nodeCount, mParameter);

// 将生成的网络插入数据库
(async () => {
    try {
        await insertNodesToDatabase(network);
    } catch (error) {
        console.error('Error inserting nodes and edges:', error);
    }
})();