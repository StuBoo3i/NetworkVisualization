import neo4j from 'neo4j-driver';

// 定义数据库连接信息
const uri = 'neo4j://localhost';
const user = 'neo4j';
const password = 'ammonia-formula-classic-kilo-atlanta-6103'; // 请替换为你的密码

// 创建一个新的驱动程序实例
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// 创建一个新的会话
const session = driver.session();

// 定义插入数据的 Cypher 查询语句
const cypherQuery = `
  CREATE (p:Person {name: $name, age: $age})
  RETURN p
`;

// 定义要插入的数据
const data = {name: 'John', age: 20};

// 执行 Cypher 查询
session
    .run(cypherQuery, data)
    .then(result => {
        console.log('Data inserted successfully:');
        console.log(result.records[0].get('p').properties);
    })
    .catch(error => {
        console.error('Error inserting data:', error);
    })
    .finally(() => {
        // 关闭会话和驱动程序
        session.close();
        driver.close();
    });
