import neo4j from 'neo4j-driver';

// Neo4j数据库连接信息
const uri = 'neo4j://localhost:7687';
const user = 'neo4j';
const password = 'ammonia-formula-classic-kilo-atlanta-6103';

// 连接到Neo4j数据库
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

// 添加节点
async function createNode(label, properties) {
    try {
        const result = await session.run(
            `CREATE (n:${label} $props) RETURN n`, { props: properties }
        );
        return result.records[0].get(0).properties;
    } catch (error) {
        console.error('Error creating node:', error);
        throw error;
    }
}

// 查询节点
async function findNode(label, properties) {
    try {
        const result = await session.run(
            `MATCH (n:${label} $props) RETURN n`, { props: properties }
        );
        return result.records.map(record => record.get(0).properties);
    } catch (error) {
        console.error('Error finding node:', error);
        throw error;
    }
}

// 更新节点
async function updateNode(label, properties, newProperties) {
    try {
        const result = await session.run(
            `MATCH (n:${label} $props) SET n += $newProps RETURN n`, {
                props: properties,
                newProps: newProperties
            }
        );
        return result.records[0].get(0).properties;
    } catch (error) {
        console.error('Error updating node:', error);
        throw error;
    }
}

// 删除节点
async function deleteNode(label, properties) {
    try {
        const result = await session.run(
            `MATCH (n:${label} $props) DELETE n`, { props: properties }
        );
        return result.summary.counters._stats.nodesDeleted;
    } catch (error) {
        console.error('Error deleting node:', error);
        throw error;
    }
}

// 添加关系
async function createRelationship(startLabel, endLabel, type, properties) {
    try {
        const result = await session.run(
            `MATCH (a:Node), (b:Node)
             WHERE a.label = '${startLabel}' AND b.label = '${endLabel}'
             CREATE (a)-[r:${type} $props]->(b)
             RETURN r`, {
                props: properties
            }
        );
        return result.records;
    } catch (error) {
        console.error('Error creating relationship:', error);
        throw error;
    }
}

// 关闭数据库连接
async function closeConnection() {
    await session.close();
    await driver.close();
}

export { createNode, findNode, createRelationship, updateNode, deleteNode, closeConnection };
