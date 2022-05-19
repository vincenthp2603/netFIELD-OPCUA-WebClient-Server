const { NodeClass } = require('node-opcua');

function extractNodeBrowseData(reference)
{
    //console.log(reference);
    let displayName = reference.displayName.text.toString();
    let nodeId = reference.nodeId.toString();
    let browseName = reference.browseName.toString();
    let nodeClass = NodeClass[String(reference.nodeClass)];
    
    return {
        displayName: displayName,
        nodeId: nodeId,
        browseName: browseName,
        nodeClass: nodeClass,
        children: []
    }
}

async function childNodeHasChildren(session, nodeId)
{
    try {
        const browseResult = await session.browse(nodeId);
        return (browseResult.references.length === 0 ? false : true);
    } catch (err) {
        console.log(err)
    }
}

async function treeWalk(session, currentNodeId, treeRoot) {
    try {  
        const browseResult = await session.browse(currentNodeId);
        
        if (browseResult.references.length === 0) {
            treeRoot.hasChildren = false;
            return;
        }

        for (const reference of browseResult.references) {
            let node = extractNodeBrowseData(reference);
            await treeWalk(session, node.nodeId, node);
            treeRoot.children.push(node);
        }

        treeRoot.hasChildren = true;
    } catch (err) {
        console.log(err);
    }
} 

module.exports = {
    extractNodeBrowseData: extractNodeBrowseData,
    treeWalk: treeWalk,
    childNodeHasChildren: childNodeHasChildren
}