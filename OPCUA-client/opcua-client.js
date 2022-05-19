const { OPCUAClient } = require('node-opcua');
const { extractNodeBrowseData, treeWalk, childNodeHasChildren } = require('./opcua-client-utils')

async function queryByNodeId(serverurl = 'opc.tcp://opcuaserver.com:48010', nodeId = 'ns=3;s=AirConditioner_1.Temperature') {
    try {
        let client = OPCUAClient.create();
        await client.connect(serverurl);
        let session = await client.createSession();
        let res = await (session.read({ nodeId: nodeId }));
        await session.close();
        await client.disconnect();
        let queryResult = {
            statusCode: {
                value: res.statusCode._value,
                description: res.statusCode._description,
                name: res.statusCode._name
            },
            value: res.value.value
        }
        return queryResult;
    } catch (err) {
        console.log(err);
    }
}

async function browseNodesTree(serverurl = 'opc.tcp://opcuaserver.com:48010') {
    try {
        let client = OPCUAClient.create();
        await client.connect(serverurl);
        let session = await client.createSession();

        let tree = {
            nodeId: "RootFolder",
            hasChildren: true,
            children: []
        }

        await treeWalk(session, tree.nodeId, tree);

        //console.log(tree);
        await session.close();
        await client.disconnect();

        return tree;
    } catch (err) {
        console.log(err);
    }
}

async function browseNodesTreeShallow(serverurl = 'opc.tcp://opcuaserver.com:48010', nodeId = 'i=2256') {
    try {
        let client = OPCUAClient.create();
        await client.connect(serverurl);
        let session = await client.createSession();

        const browseResult = await session.browse(nodeId);
        let node = {
            nodeId: nodeId,
            hasChildren: false,
            children: []
        }

        for (const reference of browseResult.references) {
            let childNode = extractNodeBrowseData(reference);
            childNode.hasChildren = await childNodeHasChildren(session, childNode.nodeId);
            node.children.push(childNode);
        }
        node.hasChildren = browseResult.references.length === 0 ? false : true;

        //console.log(node);
        await session.close();
        await client.disconnect();

        return node;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    queryByNodeId: queryByNodeId,
    browseNodesTree: browseNodesTree,
    browseNodesTreeShallow: browseNodesTreeShallow
}